import * as THREE from 'three';
// Small tiled PBR maps give the coating and metal real surface response.
function grainTexture(size,base,spread,streaks=false){const canvas=document.createElement('canvas');canvas.width=canvas.height=size;const c=canvas.getContext('2d'),data=c.createImageData(size,size);let seed=671;const rows=[];for(let y=0;y<size;y++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;rows[y]=(seed/4294967296-.5)*spread}for(let i=0;i<size*size;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const value=Math.max(0,Math.min(255,base+(seed/4294967296-.5)*spread+(streaks?rows[Math.floor(i/size)]*1.5:0)));data.data.set([value,value,value,255],i*4)}c.putImageData(data,0,0);const texture=new THREE.CanvasTexture(canvas);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.colorSpace=THREE.NoColorSpace;return texture}
const coating=grainTexture(256,190,36),brushed=grainTexture(128,125,23,true);coating.repeat.set(5,5);brushed.repeat.set(3,12);
const cache=new Map();
export function finishMaterial(material,role){if(cache.has(material))return cache.get(material);const name=material.name.toLowerCase();let m=material;
 if(role==='head'){m=new THREE.MeshPhysicalMaterial({color:0xeee9dc,roughness:.82,metalness:0,map:material.map,bumpMap:coating,bumpScale:.000045,roughnessMap:coating,clearcoat:.035,clearcoatRoughness:.7});}
 else if(/sapele|mahogany|wood|timber/.test(name)){m=new THREE.MeshPhysicalMaterial({color:material.color,map:material.map,normalMap:material.normalMap,normalScale:material.normalScale,roughnessMap:material.roughnessMap,roughness:.55,metalness:0,clearcoat:.3,clearcoatRoughness:.27});}
 else if(/chrome|stainless|steel/.test(name)){m=material.clone();m.metalness=1;m.roughness=.22;m.roughnessMap=brushed;m.bumpMap=brushed;m.bumpScale=.000012;}
 else if(/brass/.test(name)){m=material.clone();m.metalness=.95;m.roughness=.3;m.roughnessMap=brushed;m.bumpMap=brushed;m.bumpScale=.000018;}
 m.name=material.name;m.envMapIntensity=.9;cache.set(material,m);return m}
