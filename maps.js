import {STATIONS,WIRE_PANELS,TASK_MIN,registerTaskMap} from './task-data.js?v=3.2.0';
import {POLUS} from './polus.js?v=3.2.0';
const rooms=[
 {name:'Cafeteria',x:3320,y:850,box:[2660,120,1370,1210]},
 {name:'Weapons',x:4520,y:740,box:[4250,270,590,680]},
 {name:'O2',x:4190,y:1300,box:[3880,1080,480,450]},
 {name:'Navigation',x:5460,y:1410,box:[5250,1080,510,600]},
 {name:'Shields',x:4490,y:2290,box:[4220,2060,650,560]},
 {name:'Communications',x:3890,y:2650,box:[3590,2440,620,510]},
 {name:'Storage',x:3160,y:2600,box:[2770,1840,770,1090]},
 {name:'Admin',x:3880,y:1700,box:[3650,1530,660,560]},
 {name:'Electrical',x:2430,y:2150,box:[2150,1650,670,760]},
 {name:'MedBay',x:2370,y:1250,box:[2070,850,710,690]},
 {name:'Security',x:1830,y:1430,box:[1670,1050,360,650]},
 {name:'Reactor',x:960,y:1530,box:[640,1000,510,970]},
 {name:'Upper Engine',x:1450,y:920,box:[1100,400,570,630]},
 {name:'Lower Engine',x:1450,y:2410,box:[1100,1900,570,650]},
];
const systems={lights:{label:'Fix Lights',room:'Electrical',x:2490,y:1775},reactor:{label:'Reactor Meltdown',room:'Reactor',x:950,y:1070},oxygen:{label:'Oxygen Depleted',room:'O2',x:4250,y:1260},comms:{label:'Comms Sabotaged',room:'Communications',x:3900,y:2600}};

export const SKELD={id:'skeld',name:'The Skeld',image:'assets-skeld.png',navFile:'assets-map.json',width:5792,height:3168,rooms,systems,stations:STATIONS,wirePanels:WIRE_PANELS,spawn:{x:3315,y:860},meetingSpawn:{x:3315,y:860},emergency:{x:3315,y:800},security:{x:1830,y:1180},admin:{x:3990,y:1740},oxygenSecondary:{x:4110,y:1650},ventLinks:[[0,1],[2,3],[4,8],[5,11],[6,10],[7,9],[12,13]],doors:[{id:'cafeteria',x:3240,y:1494,w:210,h:32}],cameras:[{x:3320,y:1500,name:'CAFETERIA HALL'},{x:1480,y:1390,name:'WEST HALL'},{x:4890,y:1390,name:'NAVIGATION HALL'},{x:3800,y:2250,name:'SOUTH HALL'}]};
export const MAPS={skeld:SKELD,polus:POLUS};
registerTaskMap('polus',POLUS.stations);Object.assign(TASK_MIN,POLUS.taskMin);
export const mapById=id=>MAPS[id]||SKELD;
export function mapRoomAt(map,p){return map.rooms.find(r=>p.x>=r.box[0]&&p.y>=r.box[1]&&p.x<=r.box[0]+r.box[2]&&p.y<=r.box[1]+r.box[3])?.name||(map.id==='polus'?'Outside':'Hallway');}
