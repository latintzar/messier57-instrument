import {baile} from './baile.js';
import {createRoomReverb} from './room-reverb.js';
import {editablePattern,toggleStep,setLoosenStep,loosenValues} from './sequencer.js';
import {grooves} from './grooves.js';
import {createMessierPd} from './libpd-engine/engine.js';
const $=id=>document.getElementById(id);
const labels={head:'Head',rim:'Rim',shell:'Shell',kick:'Kick'};
const state={mode:'all',tuning:.6,rattle:.8,damping:.6,velocity:.65,blend:.65,pull:0,power:true};
let context,master,pd,dryBus,wetBus,excitationBus,analyser,roomInput,enabled=false,initializing=null,muted=false,meterUntil=0,meterRunning=false;
const voices=new Set(),heldKeys=new Set();let pointerPull=0,sliderPull=0,loopPull=0,buffers={};
let transport=null,transportTimer=null,cursorFrame=0,visualTimers=new Set();
function status(text,on=false){$('status').textContent=text;$('status').parentElement.classList.toggle('active',on)}
function emitState(){window.dispatchEvent(new CustomEvent('messier:state',{detail:{...state,enabled}}))}
function actualRattle(){return state.rattle*(1-state.pull)}
function updateSound(){if(pd&&enabled)pd.setParams({tuning:state.tuning,rattle:actualRattle(),damping:state.damping})}
function updateLatch(capture=true){
 const previous=state.pull;state.pull=Math.max(pointerPull,sliderPull,loopPull,heldKeys.size?1:0);const held=state.pull>.02;
 syncSlider();$('latch-key').setAttribute('aria-pressed',String(held));$('latch-state').textContent=held?'Snares loose':'Snares tight';$('latch-value').textContent=held?'Loose':'Tight';$('latch-meter').style.width=(state.pull*100)+'%';updateSound();emitState();
 if(enabled)status(held?'Snares loose':'Ready',true);
}
function releaseLatch(){heldKeys.clear();pointerPull=0;updateLatch()}
function setMode(mode,capture=true){
 
 state.mode=mode;document.querySelectorAll('.zone').forEach(b=>{const selected=b.dataset.mode===mode;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected))});
 $('lever-knob').style.transform=`translateX(${{head:-38,rim:0,all:38}[mode]}px) rotate(${{head:-22,rim:0,all:22}[mode]}deg)`;
 $('switch-lever').setAttribute('aria-label','Cycle sensing switch; '+(mode==='all'?'all areas':mode+' only'));emitState();if(enabled)status('Sensing · '+(mode==='all'?'all areas → one synth':mode+' only'),true);
}
async function enable(){
 if(enabled){await context.resume();return}if(initializing)return initializing;
 initializing=(async()=>{
  status('Loading Pure Data…',true);$('audio').disabled=true;
  context=new (window.AudioContext||window.webkitAudioContext)({sampleRate:44100,latencyHint:'interactive'});await context.resume();
  const limiter=context.createDynamicsCompressor();limiter.threshold.value=-8;limiter.knee.value=8;limiter.ratio.value=8;limiter.attack.value=.002;limiter.release.value=.08;limiter.connect(context.destination);
  master=context.createGain();master.gain.value=+$('volume').value/100;analyser=context.createAnalyser();analyser.fftSize=1024;master.connect(analyser).connect(limiter);
  roomInput=context.createGain();createRoomReverb(context,roomInput,master);
  dryBus=context.createGain();dryBus.gain.value=(1-state.blend)*.5;dryBus.connect(roomInput);wetBus=context.createGain();wetBus.gain.value=state.power?state.blend:0;wetBus.connect(roomInput);
  const data=await Promise.all(['head','rim','kick'].map(async z=>{const response=await fetch(`engine/assets/${z}-excitation.wav`);if(!response.ok)throw Error('Could not load recorded '+z+' input.');return context.decodeAudioData(await response.arrayBuffer())}));
  buffers.head=data[0];buffers.rim=data[1];buffers.kick=data[2];const len=Math.max(data[0].length,data[1].length);buffers.shell=context.createBuffer(1,len,context.sampleRate);const mix=buffers.shell.getChannelData(0),a=data[0].getChannelData(0),b=data[1].getChannelData(0);for(let i=0;i<len;i++)mix[i]=((a[i]||0)+(b[i]||0))*.5;
  pd=await createMessierPd(context,{onPrint:text=>{if(/error|couldn't create|connection failed|DSP loop/i.test(text))console.error(text)},onError:error=>{status(error.message);console.error(error)}});excitationBus=context.createChannelMerger(2);excitationBus.connect(pd.node);pd.node.connect(wetBus);
  pd.node.onprocessorerror=()=>{status('Pure Data stopped. Reload to restart.');$('engine-light').classList.remove('active')};
  enabled=true;updateSound();$('audio').classList.add('on');$('audio').innerHTML='Audio on <span>●</span>';$('engine-light').classList.add('active');status('Ready · snares tight',true);$('render-info').textContent='Pure Data · original CHAIR snare · 44.1 kHz';emitState();
 })();
 try{await initializing}catch(e){status(e.message);console.error(e);if(context)await context.close();enabled=false;pd=null;initializing=null;$('audio').innerHTML='Retry sound <span></span>';throw e}finally{$('audio').disabled=false}
}
function meter(){
 meterUntil=performance.now()+3200;if(meterRunning)return;meterRunning=true;let peakHold=0;const values=new Float32Array(analyser.fftSize),canvas=$('scope'),c=canvas.getContext('2d'),w=canvas.width,h=canvas.height;
 function frame(){analyser.getFloatTimeDomainData(values);let peak=0;for(const v of values)peak=Math.max(peak,Math.abs(v));peakHold=Math.max(peakHold,peak);c.clearRect(0,0,w,h);c.strokeStyle='#bbc4ae';c.lineWidth=1;c.beginPath();c.moveTo(0,h/2);c.lineTo(w,h/2);c.stroke();c.strokeStyle='#567250';c.lineWidth=1.2;c.beginPath();for(let x=0;x<w;x++){const y=h/2-values[Math.floor(x/w*values.length)]*h*.85;x?c.lineTo(x,y):c.moveTo(x,y)}c.stroke();$('render-info').textContent='Pure Data · peak '+(peakHold?(20*Math.log10(peakHold)).toFixed(1)+' dBFS':'—');if(performance.now()<meterUntil)requestAnimationFrame(frame);else meterRunning=false}requestAnimationFrame(frame);
}
function strike(zone,{when=null,velocity=state.velocity,fromPlayback=false}={}){
 if(!enabled){status('Enable sound to play');$('audio').focus();return}if(context.state==='suspended')context.resume();
 muted=false;master.gain.setTargetAtTime(+$('volume').value/100,context.currentTime,.005);
 const at=when===null?context.currentTime:Math.max(context.currentTime,when);
 
 const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffers[zone];gain.gain.value=Math.max(0,Math.min(1,velocity));source.connect(gain);if(zone!=='kick')gain.connect(dryBus);const sensed=zone==='kick'||(state.power&&(state.mode==='all'||state.mode===zone));if(sensed)gain.connect(excitationBus,0,zone==='kick'?1:0);source.start(at);voices.add(source);source.onended=()=>{voices.delete(source);source.disconnect();gain.disconnect()};
 const show=()=>{const key=$(zone==='head'?'head-key':zone==='rim'?'rim-key':zone==='kick'?'kick-key':'head-key');key.classList.add('active');setTimeout(()=>key.classList.remove('active'),85);status(labels[zone],true);window.dispatchEvent(new CustomEvent('messier:hit',{detail:{zone,sensed,velocity}}));meter()};
 const delay=(at-context.currentTime)*1000;if(delay>5){const id=setTimeout(()=>{visualTimers.delete(id);show()},delay);visualTimers.add(id)}else show();
}
$('audio').addEventListener('click',()=>enable().catch(()=>{}));$('head-key').addEventListener('click',()=>strike('head'));$('rim-key').addEventListener('click',()=>strike('rim'));$('kick-key').addEventListener('click',()=>strike('kick'));
document.querySelectorAll('.zone').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
$('switch-lever').addEventListener('click',()=>{const modes=['head','rim','all'];setMode(modes[(modes.indexOf(state.mode)+1)%3])});
for(const name of ['tuning','rattle','damping','velocity'])$(name).addEventListener('input',()=>{state[name]=+$(name).value/100;$(name+'-value').textContent=$(name).value;if(enabled){if(name==='blend'){dryBus.gain.setTargetAtTime((1-state.blend)*.5,context.currentTime,.02);wetBus.gain.setTargetAtTime(state.power?state.blend:0,context.currentTime,.02)}updateSound()}emitState()});
$('volume').addEventListener('input',()=>{if(master&&!muted)master.gain.setTargetAtTime(+$('volume').value/100,context.currentTime,.01)});
$('stop').addEventListener('click',()=>{stopGroove();releaseLatch();for(const voice of voices){try{voice.stop()}catch{}}voices.clear();muted=true;if(master)master.gain.setTargetAtTime(0,context.currentTime,.01);status('Stopped',enabled)});
const latchButton=$('latch-key');
latchButton.addEventListener('pointerdown',e=>{e.preventDefault();latchButton.setPointerCapture(e.pointerId);pointerPull=1;updateLatch()});
for(const event of ['pointerup','pointercancel','lostpointercapture'])latchButton.addEventListener(event,()=>{pointerPull=0;updateLatch()});
latchButton.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();if(!e.repeat){heldKeys.add('button');updateLatch()}}});latchButton.addEventListener('keyup',e=>{if(e.key===' '||e.key==='Enter'){heldKeys.delete('button');updateLatch()}});
function typingTarget(e){return e.target?.isContentEditable||(['INPUT','TEXTAREA','SELECT'].includes(e.target?.tagName)&&e.target.type!=='range')}
document.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey||typingTarget(e))return;const key=e.key.toLowerCase();if(key==='s'||key==='shift'){e.preventDefault();heldKeys.add(key);updateLatch();return}if(e.repeat)return;if(key==='h'||key==='r'||key==='k'){e.preventDefault();strike(key==='h'?'head':key==='r'?'rim':'kick')}});
document.addEventListener('keyup',e=>{const key=e.key.toLowerCase();if(key==='s'||key==='shift'){heldKeys.delete(key);updateLatch()}});
window.addEventListener('blur',releaseLatch);document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseLatch()});
window.addEventListener('messier:latch-input',e=>{pointerPull=Math.min(1,Math.max(0,Number(e.detail.amount)||0));updateLatch()});window.addEventListener('messier:strike-input',e=>{if(labels[e.detail.zone])strike(e.detail.zone)});
setMode(state.mode);emitState();
window.addEventListener('messier:request-state',emitState);

window.addEventListener('messier:power-input',async()=>{if(!enabled){await enable();state.power=true}else state.power=!state.power;if(wetBus)wetBus.gain.setTargetAtTime(state.power?state.blend:0,context.currentTime,.025);$('engine-light').classList.toggle('active',state.power);status(state.power?'Bela on · synth active':'Bela off · pickup only',state.power);emitState()});
window.addEventListener('messier:component-info',e=>{status(e.detail.text,enabled)});

// Editable patterns retain timing and dynamics; automation is shown per step.
const library={baile,...Object.fromEntries(grooves.map(g=>[g.id,g]))},edits=new Map();
for(const g of grooves){const option=document.createElement('option');option.value=g.id;option.textContent=g.name.replace(/ study$/,'');$('preset').append(option)}
function preset(){const id=$('preset').value;if(!edits.has(id))edits.set(id,editablePattern(library[id]||baile));return edits.get(id)}
function syncSlider(){const e=$('snare-amount');if(!e)return;const value=Math.round(state.pull*100);e.style.setProperty('--value',value+'%');e.setAttribute('aria-valuenow',value);e.querySelector('output').textContent=value+'%'}
function bindPercent(el,get,set){let drag=null;el.addEventListener('pointerdown',e=>{e.preventDefault();el.setPointerCapture(e.pointerId);drag={x:e.clientX,y:e.clientY,value:get(),moved:false}});el.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=drag.y-e.clientY;if(Math.hypot(dx,dy)>2)drag.moved=true;set(Math.max(0,Math.min(1,drag.value+(dx+dy)/100)))});const finish=e=>{if(!drag)return;if(e&& !drag.moved){const r=el.getBoundingClientRect();set(Math.max(0,Math.min(1,(r.bottom-e.clientY)/r.height)))}drag=null};el.addEventListener('pointerup',finish);el.addEventListener('pointercancel',()=>{drag=null});el.addEventListener('lostpointercapture',()=>{drag=null});el.addEventListener('keydown',e=>{const delta=['ArrowUp','ArrowRight'].includes(e.key)?.01:['ArrowDown','ArrowLeft'].includes(e.key)?-.01:0;if(delta||e.key==='Home'||e.key==='End'){e.preventDefault();set(e.key==='Home'?0:e.key==='End'?1:Math.max(0,Math.min(1,get()+delta*(e.shiftKey?10:1))))}})}
function edited(){if(!transport)return;transport.pattern=preset();const beat=Math.max(0,(context.currentTime+.125-transport.start)*transport.bpm/60);transport.cycle=Math.floor(beat/8);const phase=beat%8;transport.index=transport.pattern.events.findIndex(e=>e.beat>phase);if(transport.index<0){transport.index=0;transport.cycle++}}
function drawPattern(){const data=preset(),root=$('pattern');root.replaceChildren();const corner=document.createElement('span');corner.className='pattern-label';root.append(corner);for(let i=0;i<32;i++){const number=document.createElement('span');number.className='step-number';number.textContent=i%4===0?String(i/4+1):'';root.append(number)}for(const zone of ['kick','head','rim']){const label=document.createElement('span');label.className='pattern-label';label.textContent=labels[zone];root.append(label);for(let i=0;i<32;i++){const cell=document.createElement('button');cell.className='step'+(i%4===0?' beat':'');cell.dataset.step=i;cell.dataset.zone=zone;const notes=data.events.filter(e=>e.type==='hit'&&e.zone===zone&&Math.floor(e.beat*4+.001)%32===i);cell.classList.toggle('note',Boolean(notes.length));cell.setAttribute('aria-label',labels[zone]+', step '+(i+1));cell.setAttribute('aria-pressed',String(Boolean(notes.length)));cell.addEventListener('click',()=>{toggleStep(data,zone,i);cell.classList.toggle('note');cell.setAttribute('aria-pressed',String(cell.classList.contains('note')));edited()});root.append(cell)}}const label=document.createElement('span');label.className='pattern-label';label.textContent='Loosen';root.append(label);const values=loosenValues(data);for(let i=0;i<32;i++){const cell=document.createElement('div');cell.className='percent-control step-loosen';cell.tabIndex=0;cell.dataset.step=i;cell.setAttribute('role','slider');cell.setAttribute('aria-label','Snare loosening, step '+(i+1));cell.setAttribute('aria-valuemin','0');cell.setAttribute('aria-valuemax','100');cell.setAttribute('aria-orientation','vertical');cell.innerHTML='<i></i><output></output>';const paint=()=>{const n=Math.round(values[i]*100);cell.style.setProperty('--value',n+'%');cell.setAttribute('aria-valuenow',n);cell.querySelector('output').textContent=n+'%'};paint();bindPercent(cell,()=>values[i],v=>{values[i]=v;setLoosenStep(data,i,v);paint();edited()});root.append(cell)}}
bindPercent($('snare-amount'),()=>sliderPull,v=>{sliderPull=v;updateLatch(false)});
function stopGroove(){clearInterval(transportTimer);cancelAnimationFrame(cursorFrame);transport=null;for(const t of visualTimers)clearTimeout(t);visualTimers.clear();for(const voice of voices){try{voice.stop()}catch{}}voices.clear();loopPull=0;updateLatch(false);$('groove-play').textContent='Play';$('groove-play').classList.remove('active');document.querySelectorAll('[data-step].cursor').forEach(e=>e.classList.remove('cursor'))}
function scheduleEvent(event,at){if(event.type==='hit'){strike(event.zone,{when:at,velocity:Math.min(1,event.velocity*state.velocity/(transport.pattern.referenceVelocity||1)),fromPlayback:true});return}const id=setTimeout(()=>{visualTimers.delete(id);if(!transport)return;if(event.type==='latch'){loopPull=event.pull;updateLatch(false)}else if(event.type==='mode')setMode(event.mode,false)},Math.max(0,(at-context.currentTime)*1000));visualTimers.add(id)}
async function startGroove(){await enable();stopGroove();const data=preset(),bpm=+$('tempo').value;transport={pattern:data,bpm,start:context.currentTime+.1,cycle:0,index:0};$('groove-play').textContent='Stop';$('groove-play').classList.add('active');function tick(){if(!transport)return;const t=transport,seconds=60/t.bpm;let guard=0;while(guard++<200){if(t.index>=t.pattern.events.length){t.cycle++;t.index=0}const event=t.pattern.events[t.index],at=t.start+(t.cycle*8+event.beat)*seconds;if(at>context.currentTime+.12)break;if(at>=context.currentTime-.04)scheduleEvent(event,at);t.index++}}tick();transportTimer=setInterval(tick,25);function cursor(){if(!transport)return;const step=Math.floor(Math.max(0,(context.currentTime-transport.start)*transport.bpm/60)%8*4);document.querySelectorAll('[data-step]').forEach(cell=>cell.classList.toggle('cursor',+cell.dataset.step===step));cursorFrame=requestAnimationFrame(cursor)}cursorFrame=requestAnimationFrame(cursor)}
$('groove-play').addEventListener('click',()=>transport?stopGroove():startGroove().catch(e=>status(e.message)));
$('preset').addEventListener('change',()=>{const playing=Boolean(transport);stopGroove();$('tempo').value=preset().bpm;$('tempo-value').textContent=preset().bpm;drawPattern();if(playing)startGroove().catch(e=>status(e.message))});$('tempo').addEventListener('input',()=>{$('tempo-value').textContent=$('tempo').value});$('tempo').addEventListener('change',()=>{if(transport)startGroove().catch(e=>status(e.message))});document.addEventListener('visibilitychange',()=>{if(document.hidden)stopGroove()});drawPattern();syncSlider();
// Embedding contract: the visitor chooses sound inside this frame.
if(new URLSearchParams(location.search).has('embed')){
 document.body.classList.add('embedded');
 const gate=document.createElement('div');gate.className='audio-gate';gate.setAttribute('role','dialog');gate.setAttribute('aria-modal','true');gate.setAttribute('aria-label','Choose whether to start audio');document.querySelector('main').inert=true;document.querySelector('header').inert=true;gate.innerHTML='<div><h2>Enable audio?</h2><button class="start-sound">Enable audio</button><button class="silent">Continue without audio</button></div>';document.body.append(gate);requestAnimationFrame(()=>gate.querySelector('.start-sound').focus());const dismissGate=()=>{document.querySelector('main').inert=false;document.querySelector('header').inert=false;gate.remove()};
 gate.querySelector('.start-sound').addEventListener('click',async()=>{const b=gate.querySelector('.start-sound');b.disabled=true;b.textContent='Starting…';try{await enable();dismissGate();$('head-key').focus()}catch{b.disabled=false;b.textContent='Try audio again'}});
 gate.querySelector('.silent').addEventListener('click',()=>{dismissGate();$('head-key').focus()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){releaseLatch();stopGroove();if(master)master.gain.value=0;window.parent.postMessage({type:'messier:close'},location.origin)}});
}

window.addEventListener('messier:switch-input',()=>$('switch-lever').click());

// Closing the portfolio modal unloads this frame and its owned audio graph.
window.addEventListener('pagehide',()=>{
 releaseLatch();stopGroove();for(const voice of voices){try{voice.stop()}catch{}}voices.clear();
 if(master)master.gain.value=0;if(pd?.node)pd.node.disconnect();
 if(context&&context.state!=='closed')context.close().catch(()=>{});
});
