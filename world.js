import {lobbySpawn,lobbyLanding,lobbyMove,lobbyRoute,lobbyPointAllowed,LOBBY_TIMEOUT_SECONDS,LOBBY_QUICK_CHAT,MEETING_QUICK_CHAT} from './lobby.js?v=3.2.0';
import {SKELD,mapById,mapRoomAt} from './maps.js?v=3.2.0';
import {STATIONS,stationFor,tasksFor,TASK_MIN,WIRE_PANELS} from './task-data.js?v=3.2.0';
export {STATIONS,stationFor,tasksFor};
import {isImp,IMPOSTOR_ROLES,ALL_ROLES,initializeRoles,becomeGhost,roleAction,tickRole} from './roles.js?v=3.2.0';
export {isImp};
import {beginConversation,hearMessage,tickConversation,openingStatement} from './conversation.js?v=3.2.0';
// Original browser implementation. Among Us artwork and audio belong to Innersloth.
export const COLORS=['red','blue','green','pink','orange','yellow','black','white','purple','brown','cyan','lime','maroon','rose','banana','gray','tan','coral'];
export const HEX=['#c51111','#132ed1','#127f2d','#ed54ba','#ef7d0d','#f5f557','#3f474e','#d6e0f0','#6b2fbb','#71491e','#44fff7','#5bfe4b','#6c2b3d','#ffd6ec','#ffffbe','#8397a7','#9f9989','#ec7578'];
export const NAMES=['Bean','Luna','Toast','Nova','Pickle','Mochi','Echo','Goose','Orbit','Pixel','Waffles','Comet','Nimbus','Jelly'];
export const ROOMS=[
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
export const SYSTEMS={lights:{label:'Fix Lights',room:'Electrical',x:2490,y:1775},reactor:{label:'Reactor Meltdown',room:'Reactor',x:950,y:1070},oxygen:{label:'Oxygen Depleted',room:'O2',x:4250,y:1260},comms:{label:'Comms Sabotaged',room:'Communications',x:3900,y:2600}};
export const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export const roomAt=p=>ROOMS.find(r=>p.x>=r.box[0]&&p.y>=r.box[1]&&p.x<=r.box[0]+r.box[2]&&p.y<=r.box[1]+r.box[3])?.name||'Hallway';
export const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export class Navigation {
 constructor(data){Object.assign(this,data);this.open=[];for(let i=0;i<this.grid.length;i++)if(this.grid[i]==='1')this.open.push(i);}
 index(x,y){return Math.floor(y/this.cell)*this.cols+Math.floor(x/this.cell);}
 walkable(x,y){return x>=0&&y>=0&&x<this.width&&y<this.height&&this.grid[this.index(x,y)]==='1';}
 point(i){return {x:(i%this.cols+.5)*this.cell,y:(Math.floor(i/this.cols)+.5)*this.cell};}
 nearest(p){let i=this.index(p.x,p.y);if(this.grid[i]==='1')return i;let best=this.open[0],d=Infinity;for(const j of this.open){let q=this.point(j),n=(q.x-p.x)**2+(q.y-p.y)**2;if(n<d){d=n;best=j;}}return best;}
 line(a,b){if(!this.walkable(a.x,a.y)||!this.walkable(b.x,b.y))return false;const dx=b.x-a.x,dy=b.y-a.y,sx=Math.sign(dx),sy=Math.sign(dy);let x=Math.floor(a.x/this.cell),y=Math.floor(a.y/this.cell),ex=Math.floor(b.x/this.cell),ey=Math.floor(b.y/this.cell),tx=dx?(((sx>0?x+1:x)*this.cell-a.x)/dx):Infinity,ty=dy?(((sy>0?y+1:y)*this.cell-a.y)/dy):Infinity,tdx=dx?this.cell/Math.abs(dx):Infinity,tdy=dy?this.cell/Math.abs(dy):Infinity;const open=(x,y)=>x>=0&&y>=0&&x<this.cols&&y<this.rows&&this.grid[y*this.cols+x]==='1';for(let n=0;n<this.cols+this.rows+4;n++){if(x===ex&&y===ey)return true;if(Math.abs(tx-ty)<1e-9){if(!open(x+sx,y)||!open(x,y+sy))return false;x+=sx;y+=sy;tx+=tdx;ty+=tdy;}else if(tx<ty){x+=sx;tx+=tdx;}else{y+=sy;ty+=tdy;}if(!open(x,y))return false;}return false;}
 path(a,b){
  let start=this.nearest(a),end=this.nearest(b);if(start===end)return [this.point(end)];
  let parents=new Int32Array(this.cols*this.rows).fill(-1),q=[start];parents[start]=start;
  for(let h=0;h<q.length;h++){let i=q[h];if(i===end)break;let x=i%this.cols,y=Math.floor(i/this.cols);
   for(const j of [x>0?i-1:-1,x<this.cols-1?i+1:-1,y>0?i-this.cols:-1,y<this.rows-1?i+this.cols:-1])if(j>=0&&this.grid[j]==='1'&&parents[j]===-1){parents[j]=i;q.push(j);}}
  if(parents[end]===-1)return [];
  let out=[],i=end;while(i!==start){out.push(this.point(i));i=parents[i];}out.reverse();
  // Smooth along collision-safe lines; no diagonal wall cutting.
  let result=[],anchor=a;for(let j=0;j<out.length;){let k=j;while(k+1<out.length&&k<j+20&&this.line(anchor,out[k+1]))k++;result.push(out[k]);anchor=out[k];j=k+1;}return result;
 }
}
export const DEFAULTS={players:10,impostors:2,tasks:5,speed:1,killCooldown:25,discussion:20,voting:35,vision:1,confirm:true,difficulty:'Normal',preferred:'Random',visual:true,modernRoles:true,acidDissolve:15,map:'skeld',practice:false,commonTasks:1,anonymousVotes:false,taskBar:'Always',emergencyCooldown:15,emergencyMeetings:1};
export class Game {
 constructor(nav,random=Math.random){this.nav=nav;this.random=random;this.settings={...DEFAULTS};this.serial=0;this.map=mapById(nav.mapId);this.roomAt=p=>mapRoomAt(this.map,p);this.taskName=id=>this.map.stations.find(t=>t.id===id)?.name;this.reset();}
 setMap(id,nav){if(!['menu','lobby'].includes(this.s.phase))return false;this.map=mapById(id);this.nav=nav;this.settings.map=this.map.id;this.s.mapId=this.map.id;for(const p of this.s.players)p.mapId=this.map.id;return true;}
 lightFactor(){return this.s.sabotage?.type==='lights'?1-.8*Math.min(1,Math.max(0,(this.s.time-this.s.sabotage.started)/2)):1;}
 sightRadius(p){return 760*this.settings.vision*(isImp(p)||!p.alive?1:this.lightFactor());}
 canRender(a,b){if(b.vent>=0||b.phantom>0&&b.transformUntil<this.s.time)return false;const r=this.sightRadius(a)+20;if(dist(a,b)>r+180)return false;for(const x of [-42,0,42])for(const y of [-106,-55,0]){const pt={x:b.x+x,y:b.y+y};if(dist(a,pt)<r&&this.nav.line(a,pt))return true;}return false;}
 repairTarget(p){const s=this.s.sabotage,sys=this.map.systems[s?.type];if(!sys)return null;if(s.type==='seismic'){const panels=sys.panels||[sys];if(s.holds?.[p.id]?.until>this.s.time)return panels[s.holds[p.id].panel];const occupied=new Set(Object.values(s.holds||{}).filter(v=>v.until>this.s.time).map(v=>v.panel));return panels.find((v,i)=>!occupied.has(i))||panels[Math.abs(this.s.players.indexOf(p))%panels.length];}return s.type==='oxygen'&&s.panels.includes('o2')?this.map.oxygenSecondary:sys;}
 rand(a=0,b=1){return a+this.random()*(b-a);}
 pick(a){return a[Math.floor(this.random()*a.length)];}
 shuffle(a){let out=[...a];for(let i=out.length-1;i>0;i--){let j=Math.floor(this.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
 reset(){this.lobbyCache=new Map();this.s={mapId:this.map?.id||'skeld',matchId:null,phase:'menu',time:0,round:0,players:[],bodies:[],chat:[],events:[],sabotage:null,meeting:null,winner:null,doors:0,closedDoors:{},doorCooldowns:{},decontamination:{},taskDone:0,taskShown:0,taskTotal:1,elapsed:0,emergencyReady:0,cases:[],conversation:null};}
 event(type,data={}){const p=data.player?this.player(data.player):null;this.s.events.push({id:++this.serial,type,...(p?{x:p.x,y:p.y}:{}),...data});if(this.s.events.length>20)this.s.events.shift();}
 player(id){return this.s.players.find(p=>p.id===id);}
 uniqueName(name,id){const base=String(name).trim().slice(0,14)||'Player';let value=base,n=1;while(this.s.players.some(p=>p.id!==id&&!p.bot&&p.name===value))value=base.slice(0,10)+' ('+(n++)+')';return value;}
 addHuman(id,name='Player',color=0,cosmetics={hat:-1,visor:-1,pet:-1}){
  const used=this.s.players.filter(p=>!p.bot).map(p=>p.color);if(used.includes(color))color=COLORS.findIndex((_,i)=>!used.includes(i));
  const p={id,mapId:this.map.id,cosmetics:{hat:-1,visor:-1,pet:-1,...cosmetics},name:this.uniqueName(name,id),color:Math.max(0,color),bot:false,role:'Crewmate',alive:true,x:3300,y:880,face:1,moving:false,tasks:[],done:[],input:{x:0,y:0},path:[],cooldown:10,emergency:1,vent:-1};
  this.s.players=this.s.players.filter(p=>p.id!==id);this.s.players.push(p);this.fillBots();return p;
 }
 fillBots(){
  const humans=this.s.players.filter(p=>!p.bot);let used=new Set(humans.map(p=>p.color));this.s.players=[...humans];
  for(let i=humans.length;i<this.settings.players;i++){let color=COLORS.findIndex((_,c)=>!used.has(c));if(color<0)break;used.add(color);
   this.s.players.push({id:'bot'+i,mapId:this.map.id,cosmetics:{hat:this.random()<.7?Math.floor(this.rand(0,10)):-1,visor:this.random()<.28?Math.floor(this.rand(0,6)):-1,nameplate:Math.floor(this.rand(0,8)),pet:this.random()<.22?0:-1},name:NAMES[(i-1+NAMES.length)%NAMES.length],color,bot:true,role:'Crewmate',alive:true,x:3300,y:880,face:1,moving:false,tasks:[],done:[],path:[],input:{x:0,y:0},cooldown:10,emergency:1,vent:-1,personality:this.pick(['careful','chatty','bold','quiet']),memory:[],suspicion:{},wait:0,think:0,target:null,goal:null,taskTime:0,accused:null});if(this.cosmeticPool){const p=this.s.players.at(-1);for(const [type,chance]of [['hat',.8],['skin',.55],['visor',.35],['pet',.2],['nameplate',1]]){const items=this.cosmeticPool.filter(i=>i.type===type);if(items.length&&this.random()<chance)p.cosmetics[type]=this.pick(items).id;}}
  }
 }
 lobby(){
  const returning=this.s.phase==='lobby',old=returning?this.lobbyCache:new Map();this.s.phase='lobby';this.s.countdown=0;this.s.sabotage=null;this.s.bodies=[];this.s.chat=[];this.s.winner=null;this.s.cases=[];
  if(!returning){this.s.lobbyExpiresAt=this.s.time+LOBBY_TIMEOUT_SECONDS;this.s.lobbyTimeoutWarned=false;}
  const used=new Set(this.s.players.filter(p=>old.has(p.id)).map(p=>old.get(p.id).lobbySeat));let next=0;
  for(let i=0;i<this.s.players.length;i++){const p=this.s.players[i],prior=old.get(p.id);p.alive=true;p.role='Crewmate';p.originalRole='Crewmate';p.team='crew';p.shifted=null;p.phantom=0;p.transformUntil=0;p.abilityTime=0;p.shield=0;p.tracking=null;p.trackTime=0;p.path=[];p.input={x:0,y:0};p.vent=-1;p.lastSaid='';p.claims=[];
   if(prior){p.x=prior.x;p.y=prior.y;p.lobbySeat=prior.lobbySeat;p.lobbySpawn=prior.lobbySpawn;p.spawnSounded=prior.spawnSounded;p.lobbyTarget=prior.lobbyTarget;p.lobbyRoute=prior.lobbyRoute;p.lobbyWait=prior.lobbyWait;}
   else{while(used.has(next))next++;p.lobbySeat=next;used.add(next);p.lobbySpawn=lobbySpawn(next,this.s.time,p.bot?i*.12:0);Object.assign(p,lobbyLanding(p.lobbySpawn));p.spawnSounded=false;p.lobbyTarget=null;p.lobbyRoute=[];p.lobbyWait=this.rand(1,6);}
  }
  this.lobbyCache=new Map(this.s.players.map(p=>[p.id,p]));beginConversation(this);this.say(null,'Walk around with WASD / arrows. Use the laptop to edit settings or Wardrobe to customize.');
 }
 say(p,text,channel='all',meta={}){let msg={id:++this.serial,player:p?.id||null,name:p?.name||'Ship',color:p?.color??-1,cosmetics:p?{...p.cosmetics}:null,text:String(text).slice(0,360),time:this.s.time,dead:p?!p.alive:false,channel,...meta};this.s.chat.push(msg);if(this.s.chat.length>90)this.s.chat.shift();return msg;}
 moveLobby(p,dx,dy,dt){const before={x:p.x,y:p.y},point=lobbyMove(p,dx,dy,210*this.settings.speed*dt);Object.assign(p,point);p.moving=Math.hypot(point.x-before.x,point.y-before.y)>.1;if(Math.abs(dx)>.05)p.face=dx<0?-1:1;}
 start(){
  if(this.s.players.length<4)return false;this.s.round++;this.s.matchId=globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+this.rand().toString(36);this.s.phase='intro';this.s.intro=9;this.s.elapsed=0;this.s.winner=null;this.s.bodies=[];this.s.sabotage=null;this.s.meeting=null;this.s.chat=[];this.s.doors=0;this.s.closedDoors={};this.s.decontamination={};this.s.taskDone=0;this.s.taskShown=0;this.s.emergencyReady=this.s.time+this.settings.emergencyCooldown;this.s.cases=[];beginConversation(this);
  let selected=this.shuffle(this.s.players),preferred=this.settings.preferred,me=this.s.players.find(p=>!p.bot);
  if(preferred!=='Random'&&me){selected=selected.filter(p=>p!==me);if(IMPOSTOR_ROLES.includes(preferred))selected.unshift(me);else selected.push(me);}
  let imps=Math.min(this.settings.impostors,Math.floor((this.s.players.length-1)/3));
  const common=this.shuffle(this.map.stations.filter(t=>t.category==='Common')).slice(0,Math.min(this.map.stations.filter(t=>t.category==='Common').length,this.settings.commonTasks??1)),other=this.map.stations.filter(t=>t.category!=='Common');
  this.s.players.forEach((p,i)=>{p.keySlot=i;p.wifiReady=0;p.waterDone=[];p.taskVariants={};p.deconUntil=0;p.deconRoom=null;if(this.map.id==='polus'){const weather=this.pick(this.map.weatherNodes),download=this.pick(this.map.downloadVariants);p.taskVariants.weather={steps:[{room:weather.room,x:weather.x,y:weather.y,node:weather.id,type:'maze'},{...this.map.stations.find(t=>t.id==='weather').steps[1],node:weather.id}]};p.taskVariants.download={steps:[{...download,type:'download'},this.map.stations.find(t=>t.id==='download').steps[1]]};}p.mapId=this.map.id;p.metrics={tasks:0,reports:0,emergencies:0,repairs:0,kills:0,murdered:0,ejected:0,vents:0,correctVotes:0,shiftedKills:0,protected:0,charges:0};p.taskElapsed={};p.wireRoute=this.shuffle(this.map.wirePanels).slice(0,3).sort((a,b)=>a.order-b.order);p.alive=true;p.role=selected.slice(0,imps).includes(p)?'Impostor':'Crewmate';p.team=p.role==='Impostor'?'impostor':'crew';p.done=[];p.tasks=[...common,...this.shuffle(other).slice(0,Math.max(0,this.settings.tasks-common.length))].map(t=>t.id);p.cooldown=12;p.sabCooldown=0;p.ventCooldown=0;p.emergency=this.settings.emergencyMeetings??1;p.vent=-1;p.path=[];p.input={x:0,y:0};p.memory=[];p.suspicion={};p.wait=0;p.target=null;p.taskTime=0;p.goal=null;p.think=this.rand(1,4);p.accused=null;p.claims=[];p.lastSaid='';p.alibiRoom=null;
   let pos=this.nav.point(this.nav.nearest({x:this.map.spawn.x+Math.cos(i*6.28/this.s.players.length)*220,y:this.map.spawn.y+Math.sin(i*6.28/this.s.players.length)*190}));p.x=pos.x;p.y=pos.y;
  });
  initializeRoles(this,selected,preferred,me);
  this.s.taskTotal=this.s.players.filter(p=>!isImp(p)).reduce((n,p)=>n+p.tasks.length,0);this.event('start');return true;
 }
 canSee(a,b){return a.vent<0&&b.vent<0&&!(b.phantom>0&&b.transformUntil<this.s.time)&&dist(a,b)<this.sightRadius(a)&&this.nav.line(a,b);}
 visible(a,b){return !a.alive?true:(!b.alive?false:this.canSee(a,b));}
 nearestBody(p){return this.s.bodies.filter(b=>dist(p,b)<230&&this.nav.line(p,b)).sort((a,b)=>dist(a,p)-dist(b,p))[0];}
 nearestVictim(p){return this.s.players.filter(q=>q!==p&&q.alive&&!isImp(q)&&q.vent<0&&dist(q,p)<170&&this.nav.line(p,q)).sort((a,b)=>dist(a,p)-dist(b,p))[0];}
 nearestStation(p){return tasksFor(p).filter(t=>dist(p,t)<190).sort((a,b)=>dist(a,p)-dist(b,p))[0];}
 closedDoorNear(p,r=190){return this.map.doors?.find(d=>this.s.closedDoors?.[d.id]&&dist(p,d)<r);}
 blockedDoor(x,y){return this.map.id==='polus'&&this.map.doors.some(d=>this.s.closedDoors?.[d.id]&&Math.abs(x-d.x)<d.w/2+5&&Math.abs(y-d.y)<d.h/2+5);}
 move(p,dx,dy,dt){
  if(p.alive&&p.deconUntil>this.s.time){p.moving=false;return;}
  if(!dx&&!dy){p.moving=false;return;}let l=Math.hypot(dx,dy);dx=dx/l*340*this.settings.speed*dt;dy=dy/l*340*this.settings.speed*dt;
  if(this.s.doors>0&&p.alive&&this.map.id==='skeld'){const cross=(p.y<1510&&p.y+dy>=1510)||(p.y>=1510&&p.y+dy<1510);if(cross&&p.x>3240&&p.x<3450)dy=0;}
  let ox=p.x,oy=p.y;
  if(!p.alive){p.x=Math.max(16,Math.min(this.nav.width-16,p.x+dx));p.y=Math.max(16,Math.min(this.nav.height-16,p.y+dy));}
  else {if(this.nav.walkable(p.x+dx,p.y)&&!this.blockedDoor(p.x+dx,p.y))p.x+=dx;if(this.nav.walkable(p.x,p.y+dy)&&!this.blockedDoor(p.x,p.y+dy))p.y+=dy;}
  p.moving=Math.hypot(p.x-ox,p.y-oy)>0.1;if(Math.abs(dx)>.1)p.face=dx<0?-1:1;
 }
 follow(p,dt){if(!p.path?.length){p.moving=false;return true;}let next=p.path[0];if(dist(p,next)<Math.max(1,340*this.settings.speed*dt)){p.x=next.x;p.y=next.y;p.path.shift();if(!p.path.length){p.moving=false;return true;}next=p.path[0];}const before={x:p.x,y:p.y};this.move(p,next.x-p.x,next.y-p.y,dt);p.stuck=dist(p,before)<.05?(p.stuck||0)+dt:0;if(p.stuck>.7){const center=this.nav.point(this.nav.nearest(p)),target=p.target||p.path.at(-1);p.path=[center,...this.nav.path(center,target)];p.stuck=0;}return false;}
 route(p,target){p.path=this.nav.path(p,target);p.target={x:target.x,y:target.y};}
 action(id,action,data={}){
  let p=this.player(id);if(!p)return false;
  if(action==='chat'){let text=String(data.text||'').trim().slice(0,this.s.phase==='lobby'?100:180);if(this.settings.chatType==='Quick Chat'&&!p.bot&&!(this.s.phase==='lobby'?LOBBY_QUICK_CHAT:MEETING_QUICK_CHAT).includes(text))return false;if(!text||this.s.time-(p.lastChat??-5)<.7||!['lobby','meeting'].includes(this.s.phase))return false;p.lastChat=this.s.time;this.say(p,text);this.hear(p,text);return true;}
  if(action==='customize'&&this.s.phase==='lobby'){
   if(typeof data.name==='string')p.name=this.uniqueName(data.name||p.name,p.id);
   if(Number.isInteger(data.color)&&data.color>=0&&data.color<COLORS.length){let holder=this.s.players.find(q=>q!==p&&q.color===data.color);if(!holder||holder.bot){if(holder)holder.color=p.color;p.color=data.color;}}
   const cosmetic=(key,max,fallback=-1)=>typeof data[key]==='string'?data[key].slice(0,96):Number.isInteger(data[key])?Math.max(-1,Math.min(max,data[key])):fallback;p.cosmetics={hat:cosmetic('hat',9),skin:cosmetic('skin',-1),visor:cosmetic('visor',5),pet:cosmetic('pet',0),nameplate:cosmetic('nameplate',7,0)};return true;
  }
  if(this.s.phase==='lobby'){
   if(action==='input'){p.input={x:Math.max(-1,Math.min(1,Number(data.x)||0)),y:Math.max(-1,Math.min(1,Number(data.y)||0))};if(p.input.x||p.input.y){p.lobbyTarget=null;p.lobbyRoute=[];}return true;}
   if(action==='walk'&&Number.isFinite(data.x)&&Number.isFinite(data.y)){p.lobbyRoute=lobbyRoute(p,data);p.lobbyTarget=p.lobbyRoute.at(-1)||null;return true;}
  }
  if(this.s.phase==='meeting'&&action==='vote')return this.vote(p,data.target);
  const ability=roleAction(this,p,action,data);if(ability!==null)return ability;
  if(this.s.phase!=='playing'||p.vent>=0&&action!=='vent')return false;
  if(action==='walk'&&Number.isFinite(data.x)&&Number.isFinite(data.y)){this.route(p,data);return true;}
  if(action==='input'){p.input={x:Math.max(-1,Math.min(1,Number(data.x)||0)),y:Math.max(-1,Math.min(1,Number(data.y)||0))};if(p.input.x||p.input.y)p.path=[];return true;}
  if(action==='kill'&&p.alive&&isImp(p)&&p.cooldown<=0&&!p.phantom&&!(p.transformUntil>this.s.time)){let q=this.nearestVictim(p);if(q){this.kill(p,q);return true;}}
  if(action==='report'&&p.alive){let b=this.nearestBody(p);if(b){this.meeting(p,b);return true;}}
  if(action==='emergency'&&p.alive&&p.emergency>0&&this.s.time>=(this.s.emergencyReady||0)&&!this.s.sabotage&&dist(p,this.map.emergency)<260){p.emergency--;p.metrics.emergencies++;this.meeting(p);return true;}
  if(action==='taskFail'&&data.id==='sample'&&p.activeTask?.id==='sample'&&p.progress.sample===1){p.progress.sample=0;p.sampleReady=0;this.cancelTask(p);return true;}
  if(action==='task'){let t=stationFor(p,data.id);if(!t||dist(p,t)>220||!p.tasks.includes(t.id)||p.done.includes(t.id)||isImp(p))return false;
   // Task timing is checked by the host; task puzzles are rendered in the client.
   const min=TASK_MIN[t.type]||1;
   if(!p.activeTask||p.activeTask.id!==t.id||p.activeTask.stage!==t.stage||this.s.time-p.activeTask.time<min||t.readyAt>this.s.time)return false;
   this.complete(p,t);p.taskElapsed??={};delete p.taskElapsed[t.id+':'+t.stage];p.activeTask=null;return true;
  }
  if(action==='cancelTask'){this.cancelTask(p);return true;}
  if(action==='beginTask'){let t=this.nearestStation(p);if(t&&t.id===data.id&&!isImp(p)){this.cancelTask(p);p.activeTask={id:t.id,stage:t.stage,time:this.s.time-(p.taskElapsed?.[t.id+':'+t.stage]||0)};p.path=[];p.input={x:0,y:0};if(t.id==='ventclean'){const vent=this.nav.vents.findIndex(v=>dist(v,t)<160);for(const q of this.s.players.filter(q=>q.vent===vent)){this.action(q.id,'vent',{exit:true});}}return true;}}
  if(action==='doorSwitch'&&p.alive&&this.map.id==='polus'){const door=this.map.doors.find(d=>d.id===data.door),state=this.s.closedDoors?.[data.door];if(!door||!state||dist(p,door)>200||!Number.isInteger(data.index)||data.index<0||data.index>=8||state.switches[data.index])return false;state.switches[data.index]=true;this.event('doorSwitch',{player:p.id});if(state.switches.every(Boolean)){delete this.s.closedDoors[door.id];this.event('doorOpen',{x:door.x,y:door.y});}return true;}
  if(action==='sabotage'&&data.type==='doors'&&isImp(p)&&this.map.id==='polus'&&this.s.elapsed>15){const door=this.map.doors.find(d=>d.id===data.door)||this.map.doors[0];if((this.s.doorCooldowns[door.room]||0)>this.s.time)return false;this.s.doorCooldowns[door.room]=this.s.time+30;for(const d of this.map.doors.filter(d=>d.room===door.room)){const switches=Array(8).fill(true);for(const i of this.shuffle([0,1,2,3,4,5,6,7]).slice(0,4))switches[i]=false;this.s.closedDoors[d.id]={switches};}this.event('doors',{x:door.x,y:door.y});return true;}
  if(action==='sabotage'&&isImp(p)&&!this.s.sabotage&&this.s.elapsed>15&&(p.sabCooldown||0)<=0){
   if(data.type==='doors'){this.s.doors=10;p.sabCooldown=25;this.event('doors');return true;}
   if(this.map.systems[data.type]){this.s.sabotage={type:data.type,time:data.type==='seismic'?60:['reactor','oxygen'].includes(data.type)?45:999999,fix:0,panels:[],holds:{},switches:data.type==='lights'?Array.from({length:5},()=>this.random()<.5):undefined,started:this.s.time};if(data.type==='lights'&&this.s.sabotage.switches.every(Boolean))this.s.sabotage.switches[Math.floor(this.rand(0,5))]=false;p.sabCooldown=35;this.event('sabotage',{system:data.type});return true;}}
  if(action==='lightSwitch'&&p.alive&&this.s.sabotage?.type==='lights'&&dist(p,this.map.systems.lights)<230&&Number.isInteger(data.index)&&data.index>=0&&data.index<5){const s=this.s.sabotage;s.switches[data.index]=!s.switches[data.index];this.event('lightSwitch',{player:p.id,x:p.x,y:p.y,index:data.index});if(s.switches.every(Boolean)){p.metrics.repairs++;this.s.sabotage=null;this.event('repaired',{player:p.id});}return true;}
  if(action==='holdScanner'&&p.alive&&this.s.sabotage?.type==='seismic'){const s=this.s.sabotage,panels=this.map.systems.seismic.panels||[];if(!data.active){delete s.holds[p.id];return true;}const panel=panels.findIndex(v=>dist(p,v)<230);if(panel<0)return false;s.holds[p.id]={panel,until:this.s.time+.7};return true;}
  if(action==='repair'&&p.alive&&this.s.sabotage){let s=this.s.sabotage,sys=this.map.systems[s.type];if(['lights','seismic'].includes(s.type))return false;if(dist(p,sys)<230||(s.type==='oxygen'&&dist(p,this.map.oxygenSecondary)<230)){s.fix++;if(s.type==='oxygen'){let panel=dist(p,sys)<230?'o2':'admin';if(!s.panels.includes(panel))s.panels.push(panel);if(s.panels.length<2)return true;}p.metrics.repairs++;this.s.sabotage=null;this.event('repaired',{player:p.id});return true;}}
  if(action==='vent'&&p.alive&&(isImp(p)||p.role==='Engineer')){
   if(p.vent>=0){let from=this.nav.vents[p.vent],index=data.exit? p.vent : Number.isInteger(data.index)?data.index:-1;
    if(index>=0&&index<this.nav.vents.length&&(data.exit||this.ventLinks(p.vent).includes(index)&&!this.ventBlocked(index,p))){let v=this.nav.vents[index],q=this.nav.point(this.nav.nearest(v));p.x=q.x;p.y=q.y;p.vent=data.exit?-1:index;p.path=[];this.event('vent',{player:id});if(data.exit)p.ventCooldown=p.role==='Engineer'?20:0;return true;}}
   else if((p.ventCooldown||0)<=0){let i=this.nav.vents.findIndex(v=>dist(p,v)<160);if(i>=0&&!this.ventBlocked(i,p)){for(const q of this.s.players.filter(q=>q.bot&&q.alive&&!isImp(q)&&q!==p&&this.canSee(q,p))){q.memory.push({type:'vent',who:p.id,time:this.s.time,room:this.roomAt(p)});q.suspicion[p.id]=(q.suspicion[p.id]||0)+3.5;}p.vent=i;if(p.role==='Engineer')p.metrics.vents++;p.ventTime=10;p.path=[];this.event('vent',{player:id});return true;}}
  }
  return false;
 }
 cancelTask(p){if(!p.activeTask)return;p.taskElapsed??={};p.taskElapsed[p.activeTask.id+':'+p.activeTask.stage]=this.s.time-p.activeTask.time;p.activeTask=null;}
 ventBlocked(index,p){const v=this.nav.vents[index];if(!v)return true;return this.s.players.some(q=>q.activeTask?.id==='ventclean'&&dist(stationFor(q,'ventclean'),v)<160)||p.role==='Engineer'&&p.tasks.includes('ventclean')&&!p.done.includes('ventclean')&&dist(stationFor(p,'ventclean'),v)<160;}
 ventLinks(index){if(this.map.id==='polus')return this.map.ventLinks[index]||[];const groups=this.map.ventLinks||SKELD.ventLinks;return groups.find(g=>g.includes(index))?.filter(i=>i!==index)||[];}
 complete(p,t){
  if(p.done.includes(t.id))return;const current=stationFor(p,t);p.progress??={};if(t.unordered){p.waterDone??=[];if(p.waterDone.includes(current.stepIndex))return;p.waterDone.push(current.stepIndex);p.progress[t.id]=p.waterDone.length;}else p.progress[t.id]=(p.progress[t.id]||0)+1;
  if(t.id==='sample'&&current.stage===0)p.sampleReady=this.s.time+60;if(t.id==='wifi'&&current.stage===0)p.wifiReady=this.s.time+60;
  const final=p.progress[t.id]>=current.stages;
  if(final){p.metrics.tasks++;if(p.role==='Scientist')p.metrics.charges++;p.done.push(t.id);this.s.taskDone++;p.battery=Math.min(12,(p.battery||0)+5);}
  if(t.id==='ventclean'){let vent=this.nav.vents.findIndex(v=>dist(v,current)<160);for(const q of this.s.players.filter(q=>q.vent===vent)){this.action(q.id,'vent',{exit:true});}}
  this.event('task',{player:p.id,task:t.id,final,stage:p.progress[t.id]});
  if(t.visual&&final&&this.settings.visual)for(const q of this.s.players.filter(q=>q.bot&&q.alive&&!isImp(q)&&q!==p&&this.canSee(q,p))){q.suspicion[p.id]=-8;q.memory.push({type:'clear',who:p.id,time:this.s.time,room:current.room});}
  this.checkWin();
 }
 kill(p,q){
  if(!p.alive||!q.alive||isImp(q)||p.phantom)return;
  if(q.shield>0&&this.s.sabotage?.type!=='comms'){q.shield=0;const angel=this.player(q.shieldedBy);if(angel?.metrics)angel.metrics.protected++;p.cooldown=this.settings.killCooldown;this.event('blocked',{player:p.id,target:q.id});return;}
  const seen=p.shifted||p,locations=Object.fromEntries(this.s.players.filter(w=>w.alive).map(w=>[w.id,this.roomAt(w)]));
  this.s.cases.push({victim:q.id,time:this.s.time,room:this.roomAt(q),locations});this.s.cases=this.s.cases.slice(-15);
  for(const w of this.s.players.filter(w=>w!==p&&w!==q&&w.bot&&w.alive&&!isImp(w)&&this.canSee(w,p)&&this.canSee(w,q))){let recognized=w.memory.some(m=>m.type==='shift'&&m.who===p.id&&m.as===seen.id&&m.time>this.s.time-25),identity=recognized?p.id:seen.id;if(identity!==w.id)w.suspicion[identity]=20;w.memory.push({type:identity===w.id?'clone':'kill',who:identity,victim:q.id,room:this.roomAt(q),time:this.s.time});w.wait=this.rand(.7,2);w.goal='report';}
  p.metrics.kills++;if(p.shifted)p.metrics.shiftedKills++;q.metrics.murdered++;let noisy=q.originalRole==='Noisemaker'||q.role==='Noisemaker';q.alive=false;q.vent=-1;q.activeTask=null;q.path=[];becomeGhost(this,q);
  this.s.bodies.push({id:q.id,x:q.x,y:q.y,color:q.color,time:this.s.time,killer:p.id,acid:p.role==='Viper',dissolveAt:p.role==='Viper'?this.s.time+this.settings.acidDissolve:null,noisy});p.cooldown=this.settings.killCooldown;p.x=q.x;p.y=q.y;p.path=[];
  this.event('kill',{player:q.id,killer:p.id,killerColor:seen.color,victimColor:q.color,killerHat:seen.cosmetics?.hat??-1,victimHat:q.cosmetics?.hat??-1,style:p.role==='Viper'?'acid':this.pick(['gun','neck','alien'])});
  if(noisy){this.event('noise',{player:q.id,x:q.x,y:q.y});for(const w of this.s.players.filter(w=>w.bot&&w.alive&&!isImp(w))){w.goal='investigate';this.route(w,q);}}this.checkWin();
 }
 meeting(reporter,body=null){
  if(body)reporter.metrics.reports++;this.s.taskShown=this.s.taskDone;this.s.phase='meeting';if(['reactor','oxygen','seismic'].includes(this.s.sabotage?.type))this.s.sabotage=null;this.s.doors=0;this.s.chat=[];this.s.meeting={started:this.s.time,reporter:reporter.id,body:body?.id||null,room:body?this.roomAt(body):this.roomAt(this.map.emergency),timer:this.settings.discussion+this.settings.voting,discussion:this.settings.discussion,votes:{},talk:this.rand(1,2),stage:'discuss',turns:0,result:null};
  for(const p of this.s.players){let job=stationFor(p,p.taskId||p.activeTask?.id);p.meetingAlibi={room:this.roomAt(p),task:job?.name,working:p.goal==='task'&&p.taskTime>0,to:p.path?.length?job?.room:null};p.path=[];p.input={x:0,y:0};this.cancelTask(p);p.moving=false;p.vent=-1;p.spoken=false;p.accused=null;p.claims=[];p.alibiRoom=null;p.shifted=null;p.phantom=0;p.abilityTime=0;p.abilityCooldown=p.role==='Detective'?8:0;
   if(p.bot&&p.alive&&body&&!isImp(p)){
    const recent=p.memory.filter(m=>m.type==='seen'&&m.room===this.roomAt(body)&&m.time>body.time-12&&m.time<body.time+6);
    for(const m of recent)if(m.who!==body.id)p.suspicion[m.who]=(p.suspicion[m.who]||0)+1.4;
   }
  }
  beginConversation(this);this.say(null,body?`${reporter.name} reported ${this.player(body.id).name} in ${this.roomAt(body)}.`:`${reporter.name} called an emergency meeting.`);this.event('meeting',{body:!!body,color:body?.color??reporter.color});
 }
 hear(speaker,text){hearMessage(this,speaker,text);}
 botSpeak(p){const text=openingStatement(this,p);const message=this.say(p,text);hearMessage(this,p,text,message);}
 vote(p,target){if(!p.alive||!this.s.meeting||!['discuss','voting'].includes(this.s.meeting.stage)||this.s.meeting.timer>this.settings.voting||Object.hasOwn(this.s.meeting.votes,p.id))return false;
  if(target!=='skip'&&!this.player(target)?.alive)return false;this.s.meeting.votes[p.id]=target;this.event('vote',{player:p.id});return true;
 }
 resolveVote(){
  let m=this.s.meeting,counts={skip:0};for(const p of this.s.players.filter(p=>p.alive&&Object.hasOwn(m.votes,p.id))){let vote=m.votes[p.id];counts[vote]=(counts[vote]||0)+1;}
  let order=Object.entries(counts).sort((a,b)=>b[1]-a[1]);let eject=order[0]?.[0],tie=Object.keys(m.votes).length===0||order.length>1&&order[0][1]===order[1][1];if(tie||eject==='skip')eject=null;
  let overrule=m.overrule,judge=this.player(overrule?.judge),chosen=this.player(overrule?.target);if(judge?.alive&&chosen?.alive){const key=isImp(chosen)?'judgeCorrect':'judgeWrong';judge.metrics[key]=(judge.metrics[key]||0)+1;eject=isImp(chosen)?chosen.id:judge.id;tie=false;}let ejected=this.player(eject),ejectedRole=ejected?.role;
  if(eject&&isImp(ejected))for(const q of this.s.players)if(m.votes[q.id]===eject)q.metrics.correctVotes++;m.result={eject,tie,counts,role:ejectedRole,impostor:isImp(ejected),overrule:!!overrule};m.stage='result';m.timer=10;this.s.bodies=[];
 }
 beginEjection(){let m=this.s.meeting;if(!m||m.stage!=='result')return;m.stage='eject';let p=this.player(m.result.eject);if(p?.alive){p.metrics.ejected++;p.alive=false;becomeGhost(this,p);}this.event('eject',{player:m.result.eject});}
 checkWin(){if(this.settings.practice)return;if(!['playing','intro'].includes(this.s.phase))return;let living=this.s.players.filter(p=>p.alive),imps=living.filter(isImp).length,crew=living.length-imps;
  if(imps===0)this.finish('Crewmates','All Impostors were ejected.');else if(imps>=crew)this.finish('Impostors','The Impostors took over the ship.');else if(this.s.taskDone>=this.s.taskTotal)this.finish('Crewmates','All tasks completed.');
 }
 finish(winner,reason){this.s.winner={team:winner,reason};this.s.phase='ended';this.s.sabotage=null;this.event('end',{winner});}
 botTick(p,dt){
  const door=p.alive?this.closedDoorNear(p,180):null;if(door){p.doorWait=(p.doorWait||0)-dt;if(p.doorWait<=0){const index=this.s.closedDoors[door.id].switches.findIndex(v=>!v);if(index>=0)this.action(p.id,'doorSwitch',{door:door.id,index});p.doorWait=.5;}p.moving=false;return;}
  if(p.vent>=0){p.ventTime-=dt;if(p.ventTime<6&&this.random()<dt*.7){let links=this.ventLinks(p.vent);if(links.length)this.action(p.id,'vent',{index:this.pick(links)});}if(p.ventTime<=0)this.action(p.id,'vent',{exit:true});return;}
  p.think-=dt;p.wait-=dt;
  if(p.think<=0){p.think=this.rand(.7,1.6);p.lastRoom=this.roomAt(p);
   if(p.alive&&!isImp(p)){
    for(const q of this.s.players.filter(q=>q!==p&&q.alive&&this.canSee(p,q))){p.memory.push({type:'seen',who:q.shifted?.id||q.id,room:this.roomAt(q),time:this.s.time});}
    p.memory=p.memory.filter(m=>m.time>this.s.time-150).slice(-70);
    let body=this.nearestBody(p);if(body){if(p.goal!=='report'){p.goal='report';p.wait=this.rand(.7,2);}else if(p.wait<=0){this.meeting(p,body);return;}}
   }
   if(isImp(p)&&p.alive){
    let victim=this.nearestVictim(p),witnesses=this.s.players.filter(q=>q!==p&&q!==victim&&q.alive&&!isImp(q)&&this.canSee(q,p));
    let bold=(this.settings.difficulty==='Hard'?.06:this.settings.difficulty==='Easy'?.3:.14)*(p.personality==='careful'?.3:p.personality==='bold'?1.8:1);
    if(victim&&p.cooldown<=0&&(!witnesses.length||this.random()<bold)){this.kill(p,victim);p.wait=0;p.goal='escape';this.route(p,this.pick(this.map.rooms));return;}
    if(p.cooldown<=0&&(!p.path.length||this.random()<.25)){let target=this.pick(this.s.players.filter(q=>q.alive&&!isImp(q)&&q.vent<0));if(target){p.goal='hunt';this.route(p,target);}}
    if(!this.s.sabotage&&this.s.elapsed>22&&this.random()<.05){this.action(p.id,'sabotage',{type:this.pick(Object.keys(this.map.systems))});}
    if(p.cooldown>4&&this.random()<.08){this.action(p.id,'vent');}
   }
   if(p.goal==='repair'&&!this.s.sabotage){p.goal=null;p.path=[];}
  }
  if(this.s.phase!=='playing')return;
  if(p.goal==='report'){p.moving=false;return;}
  if(this.s.sabotage&&p.alive&&!isImp(p)){
   let target=this.repairTarget(p);
   if(p.goal!=='repair'||!p.target||dist(p.target,target)>100){p.goal='repair';p.repairWait=this.rand(2,5);this.route(p,target);}
   if(dist(p,target)<230){p.moving=false;p.repairWait-=dt;if(this.s.sabotage.type==='seismic')this.action(p.id,'holdScanner',{active:true});else if(p.repairWait<=0){if(this.s.sabotage.type==='lights'){const index=this.s.sabotage.switches.findIndex(v=>!v);if(index>=0)this.action(p.id,'lightSwitch',{index});p.repairWait=.6;}else this.action(p.id,'repair');}}
   else this.follow(p,dt);
   return;
  }
  if(p.wait>0&&!p.path.length){p.moving=false;return;}
  const arrived=this.follow(p,dt);
  if(arrived){
   if(p.goal==='task'&&p.taskId){let task=stationFor(p,p.taskId);if(task.readyAt>this.s.time){p.goal=null;p.taskTime=0;p.wait=2;return;}p.taskTime+=dt;if(p.taskTime>(isImp(p)?this.rand(5,9):this.settings.difficulty==='Hard'?9:13)){
     if(!isImp(p)&&!p.done.includes(task.id))this.complete(p,task);p.goal=null;p.taskTime=0;p.wait=this.rand(.6,2.5);
    }return;}
   if(p.goal==='hunt'){p.goal=null;return;}if(p.goal==='escape'){p.goal=null;p.wait=2;return;}
   const remaining=tasksFor(p).filter(t=>t.readyAt<=this.s.time);
   if(remaining.length){let t=p.personality==='careful'?[...remaining].sort((a,b)=>dist(a,p)-dist(b,p))[0]:this.pick(remaining);p.taskId=t.id;p.goal='task';p.taskTime=0;this.route(p,t);}
   else {p.goal='wander';this.route(p,this.pick(this.map.rooms));p.wait=this.rand(1,4);}
  }
 }
 tick(dt){
  dt=Math.min(dt,.1);this.s.time+=dt;
  if(this.s.phase==='lobby'){
   if(this.s.countdown>0){this.s.countdown-=dt;if(this.s.countdown<=0){this.start();return;}}
   if(this.s.time>=this.s.lobbyExpiresAt){this.event('lobbyClosed');this.s.phase='menu';return;}if(!this.s.lobbyTimeoutWarned&&this.s.lobbyExpiresAt-this.s.time<=60){this.s.lobbyTimeoutWarned=true;this.event('lobbyTimeout');}
   for(const p of this.s.players){if(!p.spawnSounded&&this.s.time>=p.lobbySpawn?.at){p.spawnSounded=true;this.event('lobbySpawn',{player:p.id,x:p.x,y:p.y});}if(p.lobbySpawn&&this.s.time<p.lobbySpawn.until){p.moving=false;continue;}
    if(p.bot){p.lobbyWait-=dt;if(!p.lobbyTarget&&p.lobbyWait<=0){let target;for(let i=0;i<30;i++){target={x:this.rand(380,850),y:this.rand(360,870)};if(lobbyPointAllowed(target.x,target.y))break;}p.lobbyRoute=lobbyRoute(p,target);p.lobbyTarget=p.lobbyRoute.at(-1);p.lobbyWait=this.rand(3,9);}}
    if(p.input?.x||p.input?.y)this.moveLobby(p,p.input.x,p.input.y,dt);else if(p.lobbyTarget){const target=p.lobbyRoute?.[0]||p.lobbyTarget,d=dist(p,target);if(d<8){p.lobbyRoute?.shift();if(!p.lobbyRoute?.length)p.lobbyTarget=null;p.moving=false;}else this.moveLobby(p,target.x-p.x,target.y-p.y,Math.min(dt,d/(210*this.settings.speed)));}else p.moving=false;}

   tickConversation(this,dt);return;
  }
  if(this.s.phase==='intro'){this.s.intro-=dt;if(this.s.intro<=0)this.s.phase='playing';return;}
  if(this.s.phase==='meeting'){
   let m=this.s.meeting;m.timer-=dt;m.talk-=dt;for(const p of this.s.players)p.abilityCooldown=Math.max(0,(p.abilityCooldown||0)-dt);
   if(['result','eject'].includes(m.stage)){if(m.stage==='result'&&m.timer<=5)this.beginEjection();if(m.timer<=0){this.s.emergencyReady=this.s.time+this.settings.emergencyCooldown;this.s.phase='playing';for(let i=0;i<this.s.players.length;i++){let p=this.s.players[i];let pos=this.nav.point(this.nav.nearest({x:this.map.meetingSpawn.x+Math.cos(i*6.28/this.s.players.length)*220,y:this.map.meetingSpawn.y+Math.sin(i*6.28/this.s.players.length)*190}));p.x=pos.x;p.y=pos.y;p.cooldown=this.settings.killCooldown;p.path=[];p.goal=null;p.wait=this.rand(1,4);}this.s.meeting=null;this.checkWin();}return;}
   m.stage=m.timer>this.settings.voting?'discuss':'voting';
   tickConversation(this,dt);
   if(m.stage==='voting')for(const p of this.s.players.filter(p=>p.alive&&p.bot&&!Object.hasOwn(m.votes,p.id))){if(m.timer<this.settings.voting-this.rand(3,14)){
    let targets=this.s.players.filter(q=>q.alive&&q!==p&&(!isImp(p)||!isImp(q))),ranking=targets.map(q=>({p:q,s:p.suspicion[q.id]||0})).sort((a,b)=>b.s-a.s);
    let target=ranking[0]?.s>3?ranking[0].p.id:'skip';
    if(isImp(p)){let counts={};for(const claim of p.claims||[])if(claim.intent==='accuse'&&this.player(claim.target)?.alive&&!isImp(this.player(claim.target)))counts[claim.target]=(counts[claim.target]||0)+1;target=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0]||p.accused||'skip';}
    if(p.role==='Judge'&&p.done.length>=2&&!p.judgeUsed&&ranking[0]?.s>12)this.action(p.id,'overrule',{target:ranking[0].p.id});
    this.vote(p,target);
   }}
   if(m.timer<=0||(m.stage==='voting'&&Object.keys(m.votes).length===this.s.players.filter(p=>p.alive).length))this.resolveVote();return;
  }
  if(this.s.phase!=='playing')return;
  if(this.settings.practice){for(const p of this.s.players.filter(p=>p.bot))p.moving=false;}
  if(this.s.sabotage?.type==='seismic'){const s=this.s.sabotage;for(const [id,hold]of Object.entries(s.holds))if(hold.until<this.s.time||!this.player(id)?.alive||dist(this.player(id),this.map.systems.seismic.panels[hold.panel])>230)delete s.holds[id];if(new Set(Object.values(s.holds).map(h=>h.panel)).size>=2){for(const id of Object.keys(s.holds))this.player(id).metrics.repairs++;this.s.sabotage=null;this.event('repaired');}}
  for(const b of this.s.bodies)if(b.acid&&b.dissolveAt<=this.s.time){const p=this.player(b.killer);if(p?.metrics)p.metrics.dissolved=(p.metrics.dissolved||0)+1;}this.s.bodies=this.s.bodies.filter(b=>!b.dissolveAt||b.dissolveAt>this.s.time);this.s.elapsed+=dt;this.s.doors=Math.max(0,this.s.doors-dt);
  if(this.s.sabotage){this.s.sabotage.time-=dt;if(this.s.sabotage.time<=0){this.finish('Impostors',this.s.sabotage.type==='oxygen'?'Oxygen was depleted.':this.s.sabotage.type==='seismic'?'Seismic stabilizers failed.':'The reactor melted down.');return;}}
  for(const p of this.s.players){if(p.activeTask&&(dist(p,stationFor(p,p.activeTask.id))>220||!p.alive&&p.activeTask.id==='ventclean'))this.cancelTask(p);if(!p.bot||!this.settings.practice)tickRole(this,p,dt);p.cooldown=Math.max(0,p.cooldown-dt);p.sabCooldown=Math.max(0,(p.sabCooldown||0)-dt);p.ventCooldown=Math.max(0,(p.ventCooldown||0)-dt);
   if(p.bot){if(!this.settings.practice)this.botTick(p,dt);}else if(p.vent<0){if(p.input.x||p.input.y)this.move(p,p.input.x,p.input.y,dt);else this.follow(p,dt);}
   else if(p.role==='Engineer'){p.ventTime-=dt;if(p.ventTime<=0)this.action(p.id,'vent',{exit:true});}
   if(p.alive&&this.map.id==='polus'){const chamber=this.map.decontamination.find(d=>p.x>=d.box[0]&&p.y>=d.box[1]&&p.x<=d.box[0]+d.box[2]&&p.y<=d.box[1]+d.box[3]);if(chamber&&p.deconRoom!==chamber.id){p.deconRoom=chamber.id;const active=this.s.decontamination[chamber.id];const until=active?.until>this.s.time?active.until:this.s.time+chamber.seconds;p.deconUntil=until;this.s.decontamination[chamber.id]={until};this.event('decontam',{player:p.id,x:chamber.x,y:chamber.y});}else if(!chamber)p.deconRoom=null;}
   if(this.s.phase!=='playing')break;
  }
 }
 snapshot(id){
  let viewer=this.player(id),s=this.s,own=p=>p.id===id;const typing=s.conversation?.typing;
  const tally=['result','eject'].includes(s.meeting?.stage),meeting=s.meeting?{...s.meeting,votes:Object.fromEntries(Object.entries(s.meeting.votes).map(([who,target])=>[who,who===id||tally&&!this.settings.anonymousVotes?target:'cast'])),ballots:tally?Object.entries(s.meeting.votes).map(([who,target])=>({target,color:this.settings.anonymousVotes?-1:this.player(who)?.color??-1})).sort((a,b)=>this.settings.anonymousVotes?a.target.localeCompare(b.target):0):[],result:s.meeting.result?{...s.meeting.result,...(!this.settings.confirm?{role:undefined,impostor:undefined}:{})}:null}:null;
  return {...s,meeting,taskDone:s.phase==='ended'?s.taskDone:s.sabotage?.type==='comms'?null:this.settings.taskBar==='Never'?0:this.settings.taskBar==='Meetings'?s.taskShown:s.taskDone,cases:undefined,conversation:{typing:typing&&(this.player(typing.player)?.alive||!viewer?.alive)?{player:typing.player}:null},settings:this.settings,players:s.players.map(p=>{
   const reveal=own(p)||s.phase==='ended'||isImp(viewer)&&isImp(p),appearance=s.phase==='playing'&&p.shifted?p.shifted:p;
   return {id:p.id,mapId:this.map.id,lobbySeat:p.lobbySeat,lobbySpawn:p.lobbySpawn,originalRole:reveal?p.originalRole:undefined,metrics:own(p)?{...p.metrics}:undefined,name:p.name,color:p.color,displayName:appearance.name,displayColor:appearance.color,cosmetics:appearance.cosmetics||{hat:-1,visor:-1,pet:-1},bot:p.bot,role:reveal?p.role:'Crewmate',team:reveal?p.team:'crew',alive:p.alive,x:p.x,y:p.y,face:p.face,moving:p.moving,invisible:p.phantom>0&&p.transformUntil<s.time,effect:p.transformUntil>s.time?{kind:p.transformKind,until:p.transformUntil}:null,inVent:p.vent>=0,vent:own(p)?p.vent:-1,phantom:own(p)?p.phantom:0,transforming:p.transformUntil>s.time,shifted:own(p)?!!p.shifted:false,abilityCooldown:own(p)?p.abilityCooldown:0,abilityTime:own(p)?p.abilityTime:0,battery:own(p)?p.battery:0,tracking:own(p)&&p.trackTime>0?this.player(p.tracking)?{id:p.tracking,x:this.player(p.tracking).x,y:this.player(p.tracking).y}:null:null,notes:own(p)?p.notes||[]:[],interrogations:own(p)?p.interrogations:0,judgeUsed:own(p)?p.judgeUsed:false,shield:own(p)||viewer?.role==='Guardian Angel'?p.shield:0,hidden:!viewer?false:!own(p)&&s.phase==='playing'&&(p.vent>=0||!p.alive&&viewer.alive||viewer.alive&&!this.canRender(viewer,p)),deconUntil:p.deconUntil||0,waterDone:own(p)?p.waterDone:undefined,taskVariants:own(p)?p.taskVariants:undefined,keySlot:own(p)?p.keySlot:undefined,wifiReady:own(p)?p.wifiReady:undefined,wireRoute:own(p)?p.wireRoute:undefined,tasks:own(p)?p.tasks:[],done:own(p)?p.done:[],progress:own(p)?p.progress||{}:{},sampleReady:own(p)?p.sampleReady:0,cooldown:own(p)?p.cooldown:0,emergency:own(p)?p.emergency:0,sabCooldown:own(p)?p.sabCooldown:0,ventCooldown:own(p)?p.ventCooldown:0};
  }),adminCounts:viewer&&dist(viewer,this.map.admin)<180?Object.fromEntries(this.map.rooms.map(r=>[r.name,s.players.filter(p=>p.alive&&p.vent<0&&this.roomAt(p)===r.name).length+s.bodies.filter(b=>this.roomAt(b)===r.name).length])):null,bodies:s.bodies.filter(b=>!viewer||!viewer.alive||dist(viewer,b)<850*this.settings.vision&&this.nav.line(viewer,b)).map(({killer,...b})=>b),chat:s.chat.filter(c=>!c.dead||!viewer?.alive),events:s.events.filter(e=>e.type==='kill'?e.player===id||e.killer===id:e.type==='notes'?e.player===id:e.type==='influence'?e.player===id||e.target===id:true).map(e=>e.type==='kill'?{id:e.id,type:e.type,player:e.player,killer:e.killer===id?id:null,killerColor:e.killerColor,victimColor:e.victimColor,killerHat:e.killerHat,victimHat:e.victimHat,style:e.style}:e)};
 }

}


