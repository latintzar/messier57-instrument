export const baile={name:'Baile groove',bpm:130,lengthBeats:8,referenceVelocity:1,events:[
 {beat:0,type:'mode',mode:'all'},
 ...[[0,'head',.94],[.75,'head',.7],[1,'rim',.76],[1.5,'head',.86],[2,'rim',.66],[2.75,'head',.88],[3.25,'rim',.5],[3.5,'head',.72],[3.75,'rim',.42],[4,'head',.98],[4.75,'head',.68],[5,'rim',.82],[5.5,'head',.8],[6,'rim',.72],[6.5,'head',.7],[6.75,'rim',.48],[7.25,'rim',.6],[7.5,'head',.86],[7.75,'rim',.44]].map(([beat,zone,velocity])=>({beat,type:'hit',zone,velocity})),
 ...[[0,.95],[1.5,.86],[2.75,.9],[4,.98],[5.5,.85],[6.75,.94]].map(([beat,velocity])=>({beat,type:'hit',zone:'kick',velocity})),
 {beat:6.4,type:'latch',pull:.7},{beat:6.95,type:'latch',pull:0}].sort((a,b)=>a.beat-b.beat)};
