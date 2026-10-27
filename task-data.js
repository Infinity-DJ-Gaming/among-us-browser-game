// The complete Skeld task pool. Each step is a physical console, not a menu shortcut.
const step=(room,x,y,type,name)=>({room,x,y,...(type?{type}:{}),...(name?{name}:{})});
export const WIRE_PANELS=[{"room": "Electrical", "x": 2495, "y": 1735, "order": 0}, {"room": "Storage", "x": 3175, "y": 1852, "order": 1}, {"room": "Admin", "x": 3585, "y": 1588, "order": 2}, {"room": "Navigation", "x": 5155, "y": 1272, "order": 3}, {"room": "Cafeteria", "x": 2788, "y": 196, "order": 4}, {"room": "Security", "x": 1585, "y": 1405, "order": 5}];
export const STATIONS=[
 {id:'wires',name:'Fix Wiring',room:'Electrical',x:2450,y:1790,type:'wires',category:'Common',steps:WIRE_PANELS.slice(0,3)},
 {id:'card',name:'Swipe Card',room:'Admin',x:4130,y:1840,type:'card',category:'Common'},
 {id:'asteroids',name:'Clear Asteroids',room:'Weapons',x:4460,y:655,type:'asteroids',category:'Long',visual:true},
 {id:'reactor',name:'Start Reactor',room:'Reactor',x:925,y:1080,type:'sequence',category:'Long'},
 {id:'download',name:'Download Data',room:'Cafeteria',x:3090,y:500,type:'download',category:'Short',steps:[step('Cafeteria',3090,500),step('Admin',3720,1640,'upload','Upload Data')]},
 {id:'power',name:'Divert Power',room:'Electrical',x:2280,y:1770,type:'power',category:'Short',steps:[step('Electrical',2280,1770),step('Navigation',5390,1200,'accept','Accept Diverted Power')]},
 {id:'scan',name:'Submit Scan',room:'MedBay',x:2550,y:1420,type:'scan',category:'Long',visual:true},
 {id:'steering',name:'Stabilize Steering',room:'Navigation',x:5500,y:1430,type:'steering',category:'Short'},
 {id:'garbage',name:'Empty Garbage',room:'Cafeteria',x:3490,y:230,type:'garbage',category:'Long',visual:true,steps:[step('Cafeteria',3490,230),step('Storage',3420,2810)]},
 {id:'chute',name:'Empty Chute',room:'O2',x:4000,y:1430,type:'garbage',category:'Long',visual:true,steps:[step('O2',4000,1430),step('Storage',3420,2810)]},
 {id:'shields',name:'Prime Shields',room:'Shields',x:4480,y:2430,type:'shields',category:'Short',visual:true},
 {id:'manifolds',name:'Unlock Manifolds',room:'Reactor',x:960,y:1760,type:'numbers',category:'Short'},
 {id:'fuel',name:'Fuel Engines',room:'Storage',x:2930,y:2150,type:'fuel',category:'Long',steps:[step('Storage',2930,2150,'fuel','Refuel Station'),step('Upper Engine',1570,900,'fuel','Fuel Engines'),step('Storage',2930,2150,'fuel','Refuel Station'),step('Lower Engine',1570,2360,'fuel','Fuel Engines')]},
 {id:'align',name:'Align Engine Output',room:'Upper Engine',x:1580,y:870,type:'align',category:'Long',steps:[step('Upper Engine',1580,870),step('Lower Engine',1580,2350)]},
 {id:'distributor',name:'Calibrate Distributor',room:'Electrical',x:2570,y:1740,type:'distributor',category:'Short'},
 {id:'course',name:'Chart Course',room:'Navigation',x:5430,y:1200,type:'course',category:'Short'},
 {id:'filter',name:'Clean O2 Filter',room:'O2',x:4110,y:1220,type:'filter',category:'Short'},
 {id:'ventclean',name:'Clean Vent',room:'Cafeteria',x:3900,y:880,type:'ventclean',category:'Short'},
 {id:'sample',name:'Inspect Sample',room:'MedBay',x:2610,y:1250,type:'sample',category:'Long',steps:[step('MedBay',2610,1250,'sample','Inspect Sample'),step('MedBay',2610,1250,'sample-result','Inspect Sample')]},
];
const taskMaps={};
export function registerTaskMap(id,stations){taskMaps[id]=stations;}
export const stationsFor=p=>taskMaps[p?.mapId]||STATIONS;
export function stationFor(p,task){const t=typeof task==='string'?stationsFor(p).find(t=>t.id===task):task;if(!t)return null;const variant=p?.taskVariants?.[t.id];const rawSteps=variant?.steps||t.steps;const steps=t.id==='wires'&&p?.wireRoute?.length===3?p.wireRoute:rawSteps;let stage=p?.progress?.[t.id]||0;const stepIndex=t.unordered?steps.map((_,i)=>i).filter(i=>!p?.waterDone?.includes(i)).sort((a,b)=>Math.hypot(p.x-steps[a].x,p.y-steps[a].y)-Math.hypot(p.x-steps[b].x,p.y-steps[b].y))[0]??0:Math.min(stage,(steps?.length||1)-1);return {...t,...steps?.[stepIndex],id:t.id,stepIndex,steps,stage,stages:steps?.length||1,readyAt:t.id==='sample'&&stage===1?p?.sampleReady||0:t.id==='wifi'&&stage===1?p?.wifiReady||0:0};}
export const tasksFor=p=>stationsFor(p).filter(t=>p?.tasks?.includes(t.id)&&!p.done.includes(t.id)).map(t=>stationFor(p,t));
export const TASK_MIN={wires:1.2,card:.5,asteroids:2,sequence:4,download:8,upload:8,power:.5,accept:.2,scan:9,steering:.4,garbage:2,shields:.5,numbers:1,fuel:2.5,align:.5,distributor:1,course:1,filter:.5,ventclean:.5,sample:.5,'sample-result':.3};
