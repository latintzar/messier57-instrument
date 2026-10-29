/** Actual libpd C/WASM runtime, not a reimplementation of Pd operators. */
const SOURCE_FILES = ['main.pd', 'allp~.pd', 'allp4~.pd', 'chair.dc-offset~.pd', 'chair.distance.pd', 'bongo~.pd', 'allp-d~.pd', 'chair.touchgate~.pd', 'chair.polyphony.pd'];
const directory = new URL('./', import.meta.url);

export async function createMessierPd(audioContext, {onPrint = console.debug, onError = console.error} = {}) {
  const files = await Promise.all(SOURCE_FILES.map(async path => {
    const response = await fetch(new URL(`source/${path}`, directory));
    if (!response.ok) throw new Error(`Cannot load Pd source ${path}: ${response.status}`);
    return {path, content: await response.text()};
  }));
  await audioContext.audioWorklet.addModule(new URL('libpd-worklet.js', directory));
  const node = new AudioWorkletNode(audioContext, 'libpd', {
    numberOfInputs: 1, numberOfOutputs: 1, outputChannelCount: [2],
    channelCount: 2, channelCountMode: 'explicit'
  });
  let readyResolve, readyReject, loadedResolve, loadedReject;
  const ready = new Promise((resolve,reject) => {readyResolve=resolve;readyReject=reject;});
  const loaded = new Promise((resolve,reject) => {loadedResolve=resolve;loadedReject=reject;});
  loaded.catch(() => {}); // Avoid an unhandled rejection if startup fails before load.
  const timer = setTimeout(() => readyReject(new Error('libpd startup timed out')), 15000);
  node.port.onmessage = ({data}) => {
    if (data.type === 'ready') {clearTimeout(timer); readyResolve();}
    else if (data.type === 'patch-opened') data.ok ? loadedResolve() : loadedReject(new Error('libpd patch failed to open'));
    else if (data.type === 'print') {
      onPrint(data.text);
      if (/couldn't create|connection failed|DSP loop detected|error:/i.test(data.text)) loadedReject(new Error(data.text));
    }
    else if (data.type === 'error') {
      const error = new Error(data.message); clearTimeout(timer); readyReject(error); loadedReject(error); onError(error);
    }
  };
  await ready;
  node.port.postMessage({type:'load', files, openPath:'main.pd'});
  await loaded;
  const sendFloat = (receiver,value) => {
    if (!Number.isFinite(value)) throw new TypeError('Pd float must be finite');
    node.port.postMessage({type:'float',receiver,value});
  };
  const setParams = ({tuning=.6,rattle=.8,damping=.6}={}) => {
    for (const [name,value] of Object.entries({tuning,rattle,damping})) {
      if (!Number.isFinite(value)||value<0||value>1) throw new RangeError(`${name} must be 0..1`);
      sendFloat(`messier-${name}`,value);
    }
  };
  setParams();
  return {node, audioContext, sendFloat, setParams,
    connect(destination=audioContext.destination) {node.connect(destination);},
    close() {node.port.postMessage({type:'close-patch'});node.disconnect();}
  };
}
