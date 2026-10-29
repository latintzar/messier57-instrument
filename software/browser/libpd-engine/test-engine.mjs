/** Offline execution of the shipped AudioWorklet in isolated Node VM contexts. */
import fs from 'node:fs';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=new URL('./',import.meta.url);
const runtime=fs.readFileSync(new URL('libpd-worklet.js',root),'utf8');
const files=['main.pd','allp~.pd','allp4~.pd','chair.dc-offset~.pd','chair.distance.pd','bongo~.pd','allp-d~.pd','chair.touchgate~.pd','chair.polyphony.pd'].map(path=>({path,content:fs.readFileSync(new URL(`source/${path}`,root),'utf8')}));
const raw=fs.readFileSync(new URL('../engine/assets/head-excitation.wav',root));let pcm;
for(let pos=12;pos+8<raw.length;){const n=raw.readUInt32LE(pos+4);if(raw.toString('ascii',pos,pos+4)==='data'){pcm=raw.subarray(pos+8,pos+8+n);break;}pos+=8+n+(n%2);}
const results=[];
for(const p of [{tuning:.6,rattle:.8,damping:.6},{tuning:.1,rattle:.8,damping:.6},{tuning:.9,rattle:.8,damping:.6},{tuning:.6,rattle:.1,damping:.6},{tuning:.6,rattle:.95,damping:.6},{tuning:.6,rattle:.8,damping:.1},{tuning:.6,rattle:.8,damping:.95},{tuning:0,rattle:0,damping:0},{tuning:1,rattle:1,damping:1}]){
 let Processor,resolve,reject;const messages=[];const ready=new Promise((res,rej)=>{resolve=res;reject=rej});
 class AudioWorkletProcessor {constructor(){this.port={postMessage(data){messages.push(data);if(data.type==='ready')resolve();if(data.type==='error')reject(new Error(data.message));},onmessage:null};}}
 // Do not inject the host WebAssembly object: it causes cross-realm TypeError
 // identity differences in Emscripten's callback registration, absent in browsers.
 const context=vm.createContext({console,TextDecoder,TextEncoder,URL,setTimeout,clearTimeout,performance,atob,btoa,fetch,sampleRate:44100,AudioWorkletProcessor,registerProcessor(name,cls){Processor=cls;}});
 vm.runInContext(runtime,context);const proc=new Processor();await ready;
 proc._onMessage({type:'load',files,openPath:'main.pd'});
 for(const [name,value]of Object.entries(p))proc._onMessage({type:'float',receiver:`messier-${name}`,value});
 let peak=0,sum=0,bad=0,nearClip=0,checksum=0;
 for(let b=0;b<760;b++){
  const input=new Float32Array(128),out=[new Float32Array(128),new Float32Array(128)];
  for(let j=0;j<128;j++){const i=b*128+j;input[j]=i*2<pcm.length?pcm.readInt16LE(i*2)/32768*.65:0;}
  proc.process([[input]],[out]);
  for(let j=0;j<128;j++){const v=out[0][j];if(!Number.isFinite(v))bad++;peak=Math.max(peak,Math.abs(v));sum+=v*v;if(Math.abs(v)>.97)nearClip++;checksum+=v*((j%43)+1);}
 }
 const errors=messages.filter(m=>m.type==='error'||/couldn't create|connection failed|DSP loop detected|error:/i.test(m.text||''));
 results.push({params:p,peak,rms:Math.sqrt(sum/(760*128)),nonfinite_samples:bad,near_clip_samples:nearClip,checksum,errors});
 proc._onMessage({type:'close-patch'});
}
const passed=results.every(r=>r.peak>0&&!r.nonfinite_samples&&!r.errors.length&&!r.near_clip_samples)&&new Set(results.map(r=>r.checksum)).size===results.length;
const report={passed,engine:'libpd-wasm 0.1.6, Pd 0.56.2 C DSP',method:'Shipped AudioWorklet executed in isolated Node VM, mono archive excitation, 44.1kHz, two 64-frame Pd ticks per quantum; browser integration is outside this numeric test',results};
fs.writeFileSync(new URL('VALIDATION.json',root),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));if(!passed)process.exit(1);
