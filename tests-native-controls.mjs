import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync(new URL('assets-task-interactions.json',import.meta.url)));
globalThis.fetch=async()=>({json:async()=>data});
globalThis.Image=class {set src(value){this.onload();}};
globalThis.requestAnimationFrame=()=>0;globalThis.cancelAnimationFrame=()=>{};
class Element {
 constructor(){this.style={};this.attrs={};this.children=[];this.classList={add(){},remove(){}};}
 setAttribute(k,v){this.attrs[k]=v;}append(e){this.children.push(e);}remove(){}setPointerCapture(){}
 querySelector(s){return this.named[s];}
 getBoundingClientRect(){return {left:0,top:0,width:this.width,height:this.height};}
 getContext(){return new Proxy({getTransform:()=>({a:1,b:0,c:0,d:1,e:0,f:0})},{get:(o,k)=>o[k]||(()=>{})});}
}
globalThis.document={createElement:()=>new Element()};
const {NativeTaskView,loadTaskLayers}=await import('./native-task-view.js?v=3.6.0');
const core=await import('./native-controls-core.js?v=3.6.0'),more=await import('./native-controls-more.js?v=3.6.0');
await loadTaskLayers();
function view(id,type,controller,stage=0,saved={}){const root=new Element(),board=new Element(),canvas=new Element(),output=new Element();board.named={canvas};root.named={'.native-interaction-board':board,output};const v=new NativeTaskView(root,id,type,type,()=>()=>{},()=>{},saved);v.action=()=>{};controller(v,{id:type,type,stage,keySlot:1,fanCode:[0,1,2,3]},saved);v.paint();return v;}
const button=(v,label)=>v.buttons.find(b=>b.attrs['aria-label']===label);
function event(v,p){return {clientX:(p.x-v.view[0])/v.view[2]*v.canvas.width,clientY:(p.y-v.view[1])/v.view[3]*v.canvas.height,pointerId:1,preventDefault(){}};}
function drag(v,b,a,z){b.onpointerdown(event(v,a));b.onpointermove(event(v,z));b.onpointerup(event(v,z));}
test('native wire handlers reject a click and finish only after all four actual drags',()=>{const saved={order:[2,0,3,1]},v=view(12,'wires',core.wireControls,0,saved),left=v.all(/^\/WireMinigame\/LeftWires\/LeftWireNode(?: \(\d\))?\/Head$/),right=v.all(/^\/WireMinigame\/RightWires\/RightWireNode(?: \(\d\))?$/),colors=['red','blue','yellow','pink'];try{for(let i=0;i<4;i++){const color=saved.order[i],b=button(v,'Left '+colors[color]+' wire'),a=v.center(left[i]),z=v.center(right[color]);b.onpointerdown(event(v,a));b.onpointerup(event(v,a));assert.equal(saved.joined?.length||0,i);drag(v,b,a,z);}assert.ok(v.finished);assert.equal(saved.joined.length,4);}finally{v.close();}});
test('native bottle handlers dock at the nozzle and count bottles only after filling and removal',()=>{const saved={},v=view(32,'canisters',core.canisterControls,0,saved),b=button(v,'Oxygen bottle');try{b.onclick({});assert.equal(saved.canisters||0,0);for(let i=0;i<2;i++){drag(v,b,{x:320/628,y:365/296},{x:638/628,y:135/296});v.tick(2.6);assert.equal(saved.canisters||0,i);b.onclick({});assert.equal(saved.canisters,i+1);}assert.ok(v.finished);}finally{v.close();}});
test('Assemble Artifact exposes five real pieces rather than hidden controller highlight duplicates',()=>{const v=view(22,'assemble',core.sampleControls);try{assert.equal(v.buttons.length,5);for(const b of v.buttons){assert.ok(parseFloat(b.style.top)>=0);assert.ok(parseFloat(b.style.top)<100);}}finally{v.close();}});
test('record shelf stage exposes an empty book slot inside its actual rendered view',()=>{const root=new Element(),board=new Element(),canvas=new Element(),output=new Element();board.named={canvas};root.named={'.native-interaction-board':board,output};const v=new NativeTaskView(root,48,'records','records',()=>()=>{},()=>{},{});try{more.recordControls(v,{id:'records',type:'records',stage:1,recordShelf:true},{});v.paint();const b=button(v,'Empty bookshelf space');assert.ok(b);assert.ok(parseFloat(b.style.left)>=0&&parseFloat(b.style.left)<100);assert.ok(parseFloat(b.style.top)>=0&&parseFloat(b.style.top)<100);}finally{v.close();}});
test('watering the native plants completes without a timer error and preserves each watered plant',()=>{const saved={},v=view(29,'plants',core.plantControls,1,saved);try{for(let i=1;i<=4;i++){const b=button(v,'Water plant '+i);b.onpointerdown(event(v,{x:.5,y:.5}));v.tick(1);b.onpointerup({});}assert.equal(saved.watered.length,4);assert.ok(v.finished);}finally{v.close();}});
test('every native task controller constructs visible art controls and survives progress frames',()=>{const cases=[[25,'idcode',core.idControls],[26,'beverage',core.vendingControls],[24,'weather',core.timerControls],[27,'process',core.timerControls],[28,'diagnostics',core.diagnosticControls],[23,'sort',core.sampleControls],[47,'safe',more.safeControls],[44,'breakers',more.breakerControls],[55,'fans',more.fanControls],[56,'photos',more.photoControls],[43,'ruby',more.rubyControls],[51,'toilet',more.toiletControls],[52,'mannequin',more.mannequinControls],[48,'records',more.recordControls],[49,'pistols',more.armsControls],[58,'rifles',more.armsControls],[54,'tapes',more.tapeControls],[45,'decon',more.showerTaskControls],[50,'shower',more.showerFixControls],[53,'towels',more.towelControls],[46,'burger',more.burgerControls]];for(const [id,type,controller]of cases)for(const stage of [0,1]){const v=view(id,type,controller,stage);try{assert.ok(v.buttons.length>0||type==='decon',type+' has controls');for(let i=0;i<20;i++){v.tick(.1);v.paint();}}finally{v.close();}}});
