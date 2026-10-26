// Original browser implementation. Among Us artwork and audio belong to Innersloth.
export const COLORS=['red','blue','green','pink','orange','yellow','black','white','purple','brown'];
export const HEX=['#c51111','#132ed1','#127f2d','#ed54ba','#ef7d0d','#f5f557','#3f474e','#d6e0f0','#6b2fbb','#71491e'];
export const NAMES=['Bean','Luna','Toast','Nova','Pickle','Mochi','Echo','Goose','Orbit','Pixel','Waffles','Comet'];
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
export const STATIONS=[
 {id:'wires',name:'Fix Wiring',room:'Electrical',x:2450,y:1790,type:'wires'},
 {id:'card',name:'Swipe Card',room:'Admin',x:4130,y:1840,type:'card'},
 {id:'asteroids',name:'Clear Asteroids',room:'Weapons',x:4460,y:655,type:'asteroids'},
 {id:'reactor',name:'Start Reactor',room:'Reactor',x:925,y:1080,type:'sequence'},
 {id:'download',name:'Download Data',room:'Cafeteria',x:3090,y:500,type:'download'},
 {id:'power',name:'Divert Power',room:'Electrical',x:2280,y:1770,type:'power'},
 {id:'scan',name:'Submit Scan',room:'MedBay',x:2550,y:1420,type:'scan',visual:true},
 {id:'steering',name:'Stabilize Steering',room:'Navigation',x:5500,y:1430,type:'steering'},
 {id:'garbage',name:'Empty Garbage',room:'Storage',x:3420,y:2810,type:'garbage',visual:true},
 {id:'shields',name:'Prime Shields',room:'Shields',x:4480,y:2430,type:'shields',visual:true},
 {id:'manifolds',name:'Unlock Manifolds',room:'Reactor',x:960,y:1760,type:'numbers'},
 {id:'fuel',name:'Fuel Engines',room:'Lower Engine',x:1570,y:2360,type:'fuel'},
];
export const SYSTEMS={lights:{label:'Fix Lights',room:'Electrical',x:2490,y:1775},reactor:{label:'Reactor Meltdown',room:'Reactor',x:950,y:1070},oxygen:{label:'Oxygen Depleted',room:'O2',x:4250,y:1260},comms:{label:'Comms Sabotaged',room:'Communications',x:3900,y:2600}};
export const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export const roomAt=p=>ROOMS.find(r=>p.x>=r.box[0]&&p.y>=r.box[1]&&p.x<=r.box[0]+r.box[2]&&p.y<=r.box[1]+r.box[3])?.name||'Hallway';
export const isImp=p=>p?.role==='Impostor';
export const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export class Navigation {
 constructor(data){Object.assign(this,data);this.open=[];for(let i=0;i<this.grid.length;i++)if(this.grid[i]==='1')this.open.push(i);}
 index(x,y){return Math.floor(y/this.cell)*this.cols+Math.floor(x/this.cell);}
 walkable(x,y){return x>=0&&y>=0&&x<this.width&&y<this.height&&this.grid[this.index(x,y)]==='1';}
 point(i){return {x:(i%this.cols+.5)*this.cell,y:(Math.floor(i/this.cols)+.5)*this.cell};}
 nearest(p){let i=this.index(p.x,p.y);if(this.grid[i]==='1')return i;let best=this.open[0],d=Infinity;for(const j of this.open){let q=this.point(j),n=(q.x-p.x)**2+(q.y-p.y)**2;if(n<d){d=n;best=j;}}return best;}
 line(a,b){let n=Math.ceil(dist(a,b)/18);for(let i=1;i<n;i++)if(!this.walkable(a.x+(b.x-a.x)*i/n,a.y+(b.y-a.y)*i/n))return false;return true;}
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
export const DEFAULTS={players:10,impostors:2,tasks:5,speed:1,killCooldown:25,discussion:20,voting:35,vision:1,confirm:true,difficulty:'Normal',preferred:'Random',visual:true};
export class Game {
 constructor(nav,random=Math.random){this.nav=nav;this.random=random;this.settings={...DEFAULTS};this.serial=0;this.reset();}
 rand(a=0,b=1){return a+this.random()*(b-a);}
 pick(a){return a[Math.floor(this.random()*a.length)];}
 shuffle(a){let out=[...a];for(let i=out.length-1;i>0;i--){let j=Math.floor(this.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
 reset(){this.s={phase:'menu',time:0,round:0,players:[],bodies:[],chat:[],events:[],sabotage:null,meeting:null,winner:null,doors:0,taskDone:0,taskTotal:1,elapsed:0};}
 event(type,data={}){this.s.events.push({id:++this.serial,type,...data});if(this.s.events.length>20)this.s.events.shift();}
 player(id){return this.s.players.find(p=>p.id===id);}
 addHuman(id,name='Player',color=0){
  const used=this.s.players.filter(p=>!p.bot).map(p=>p.color);if(used.includes(color))color=COLORS.findIndex((_,i)=>!used.includes(i));
  const p={id,name:String(name).trim().slice(0,14)||'Player',color:Math.max(0,color),bot:false,role:'Crewmate',alive:true,x:3300,y:880,face:1,moving:false,tasks:[],done:[],input:{x:0,y:0},path:[],cooldown:10,emergency:1,vent:-1};
  this.s.players=this.s.players.filter(p=>p.id!==id);this.s.players.push(p);this.fillBots();return p;
 }
 fillBots(){
  const humans=this.s.players.filter(p=>!p.bot);let used=new Set(humans.map(p=>p.color));this.s.players=[...humans];
  for(let i=humans.length;i<this.settings.players;i++){let color=COLORS.findIndex((_,c)=>!used.has(c));if(color<0)break;used.add(color);
   this.s.players.push({id:'bot'+i,name:NAMES[(i-1+NAMES.length)%NAMES.length],color,bot:true,role:'Crewmate',alive:true,x:3300,y:880,face:1,moving:false,tasks:[],done:[],path:[],input:{x:0,y:0},cooldown:10,emergency:1,vent:-1,personality:this.pick(['careful','chatty','bold','quiet']),memory:[],suspicion:{},wait:0,think:0,target:null,goal:null,taskTime:0,accused:null});
  }
 }
 lobby(){this.s.phase='lobby';this.s.sabotage=null;this.s.bodies=[];this.s.chat=[];this.s.winner=null;for(let i=0;i<this.s.players.length;i++){let p=this.s.players[i];p.alive=true;p.role='Crewmate';p.x=360+(i%5)*125;p.y=430+Math.floor(i/5)*170;p.path=[];p.vent=-1;}this.say(null,'Welcome aboard. Customize the match, then start when you’re ready.');}
 say(p,text,channel='all'){this.s.chat.push({id:++this.serial,player:p?.id||null,name:p?.name||'Ship',color:p?.color??-1,text:String(text).slice(0,180),time:this.s.time,dead:p?!p.alive:false,channel});if(this.s.chat.length>90)this.s.chat.shift();}
 start(){
  if(this.s.players.length<4)return false;this.s.round++;this.s.phase='intro';this.s.intro=5;this.s.elapsed=0;this.s.winner=null;this.s.bodies=[];this.s.sabotage=null;this.s.meeting=null;this.s.chat=[];this.s.doors=0;this.s.taskDone=0;
  let selected=this.shuffle(this.s.players),preferred=this.settings.preferred,me=this.s.players.find(p=>!p.bot);
  if(preferred!=='Random'&&me){selected=selected.filter(p=>p!==me);if(preferred==='Impostor')selected.unshift(me);else selected.push(me);}
  let imps=Math.min(this.settings.impostors,Math.floor((this.s.players.length-1)/3));
  this.s.players.forEach((p,i)=>{p.alive=true;p.role=selected.slice(0,imps).includes(p)?'Impostor':'Crewmate';p.done=[];p.tasks=this.shuffle(STATIONS).slice(0,this.settings.tasks).map(t=>t.id);p.cooldown=12;p.sabCooldown=0;p.ventCooldown=0;p.emergency=1;p.vent=-1;p.path=[];p.input={x:0,y:0};p.memory=[];p.suspicion={};p.wait=0;p.target=null;p.taskTime=0;p.goal=null;p.think=this.rand(1,4);p.accused=null;
   let pos=this.nav.point(this.nav.nearest({x:3315+Math.cos(i*6.28/this.s.players.length)*220,y:860+Math.sin(i*6.28/this.s.players.length)*190}));p.x=pos.x;p.y=pos.y;
  });
  let crew=selected.filter(p=>!isImp(p));if(crew.length>1){crew[0].role='Engineer';crew[1].role='Scientist';}
  if(preferred!=='Random'&&preferred!=='Impostor'&&me)me.role=preferred;
  this.s.taskTotal=this.s.players.filter(p=>!isImp(p)).reduce((n,p)=>n+p.tasks.length,0);this.event('start');return true;
 }
 canSee(a,b){return a.vent<0&&b.vent<0&&dist(a,b)<(this.s.sabotage?.type==='lights'&&!isImp(a)?210:760)*this.settings.vision&&this.nav.line(a,b);}
 visible(a,b){return !a.alive?true:(!b.alive?false:this.canSee(a,b));}
 nearestBody(p){return this.s.bodies.filter(b=>dist(p,b)<230&&this.nav.line(p,b)).sort((a,b)=>dist(a,p)-dist(b,p))[0];}
 nearestVictim(p){return this.s.players.filter(q=>q!==p&&q.alive&&!isImp(q)&&q.vent<0&&dist(q,p)<170&&this.nav.line(p,q)).sort((a,b)=>dist(a,p)-dist(b,p))[0];}
 nearestStation(p){return STATIONS.filter(t=>p.tasks.includes(t.id)&&!p.done.includes(t.id)&&dist(p,t)<190).sort((a,b)=>dist(a,p)-dist(b,p))[0];}
 move(p,dx,dy,dt){
  if(!dx&&!dy){p.moving=false;return;}let l=Math.hypot(dx,dy);dx=dx/l*340*this.settings.speed*dt;dy=dy/l*340*this.settings.speed*dt;
  if(this.s.doors>0&&p.alive){const cross=(p.y<1510&&p.y+dy>=1510)||(p.y>=1510&&p.y+dy<1510);if(cross&&p.x>3240&&p.x<3450)dy=0;}
  let ox=p.x,oy=p.y;
  if(!p.alive){p.x=Math.max(16,Math.min(this.nav.width-16,p.x+dx));p.y=Math.max(16,Math.min(this.nav.height-16,p.y+dy));}
  else {if(this.nav.walkable(p.x+dx,p.y))p.x+=dx;if(this.nav.walkable(p.x,p.y+dy))p.y+=dy;}
  p.moving=Math.hypot(p.x-ox,p.y-oy)>0.1;if(Math.abs(dx)>.1)p.face=dx<0?-1:1;
 }
 follow(p,dt){if(!p.path?.length){p.moving=false;return true;}let next=p.path[0];if(dist(p,next)<Math.max(10,340*this.settings.speed*dt)){p.x=next.x;p.y=next.y;p.path.shift();if(!p.path.length){p.moving=false;return true;}next=p.path[0];}this.move(p,next.x-p.x,next.y-p.y,dt);return false;}
 route(p,target){p.path=this.nav.path(p,target);p.target={x:target.x,y:target.y};}
 action(id,action,data={}){
  let p=this.player(id);if(!p)return false;
  if(action==='chat'){let text=String(data.text||'').trim().slice(0,180);if(!text||this.s.time-(p.lastChat??-5)<.7||!['lobby','meeting'].includes(this.s.phase))return false;p.lastChat=this.s.time;this.say(p,text);if(this.s.phase==='meeting'&&p.alive)this.hear(p,text);return true;}
  if(this.s.phase==='meeting'&&action==='vote')return this.vote(p,data.target);
  if(this.s.phase!=='playing'||p.vent>=0&&action!=='vent')return false;
  if(action==='walk'&&Number.isFinite(data.x)&&Number.isFinite(data.y)){this.route(p,data);return true;}
  if(action==='input'){p.input={x:Math.max(-1,Math.min(1,Number(data.x)||0)),y:Math.max(-1,Math.min(1,Number(data.y)||0))};if(p.input.x||p.input.y)p.path=[];return true;}
  if(action==='kill'&&p.alive&&isImp(p)&&p.cooldown<=0){let q=this.nearestVictim(p);if(q){this.kill(p,q);return true;}}
  if(action==='report'&&p.alive){let b=this.nearestBody(p);if(b){this.meeting(p,b);return true;}}
  if(action==='emergency'&&p.alive&&p.emergency>0&&!this.s.sabotage&&dist(p,{x:3315,y:800})<260){p.emergency--;this.meeting(p);return true;}
  if(action==='task'){let t=STATIONS.find(t=>t.id===data.id);if(!t||dist(p,t)>220||!p.tasks.includes(t.id)||p.done.includes(t.id)||isImp(p))return false;
   // Task timing is checked by the host; task puzzles are rendered in the client.
   const min={wires:1.2,card:.5,asteroids:1,sequence:2,download:5,power:1,scan:6,steering:.5,garbage:2,shields:.5,numbers:1,fuel:3}[t.type]||1;
   if(!p.activeTask||p.activeTask.id!==t.id||this.s.time-p.activeTask.time<min)return false;
   this.complete(p,t);p.activeTask=null;return true;
  }
  if(action==='beginTask'){let t=this.nearestStation(p);if(t&&t.id===data.id&&!isImp(p)){p.activeTask={id:t.id,time:this.s.time};return true;}}
  if(action==='sabotage'&&p.alive&&isImp(p)&&!this.s.sabotage&&this.s.elapsed>15&&(p.sabCooldown||0)<=0){
   if(data.type==='doors'){this.s.doors=10;p.sabCooldown=25;this.event('doors');return true;}
   if(SYSTEMS[data.type]){this.s.sabotage={type:data.type,time:['reactor','oxygen'].includes(data.type)?45:999,fix:0,panels:[],started:this.s.time};p.sabCooldown=35;this.event('sabotage',{system:data.type});return true;}}
  if(action==='repair'&&p.alive&&this.s.sabotage){let s=this.s.sabotage,sys=SYSTEMS[s.type];if(dist(p,sys)<230||(s.type==='oxygen'&&dist(p,{x:4110,y:1650})<230)){s.fix++;if(s.type==='oxygen'){let panel=dist(p,sys)<230?'o2':'admin';if(!s.panels.includes(panel))s.panels.push(panel);if(s.panels.length<2)return true;}this.s.sabotage=null;this.event('repaired');return true;}}
  if(action==='vent'&&p.alive&&(isImp(p)||p.role==='Engineer')){
   if(p.vent>=0){let from=this.nav.vents[p.vent],index=data.exit? p.vent : Number.isInteger(data.index)?data.index:-1;
    if(index>=0&&index<this.nav.vents.length&&(data.exit||this.ventLinks(p.vent).includes(index))){let v=this.nav.vents[index],q=this.nav.point(this.nav.nearest(v));p.x=q.x;p.y=q.y;p.vent=data.exit?-1:index;p.path=[];this.event('vent',{player:id});if(data.exit)p.ventCooldown=p.role==='Engineer'?20:0;return true;}}
   else if((p.ventCooldown||0)<=0){let i=this.nav.vents.findIndex(v=>dist(p,v)<160);if(i>=0){for(const q of this.s.players.filter(q=>q.bot&&q.alive&&!isImp(q)&&q!==p&&this.canSee(q,p))){q.memory.push({type:'vent',who:p.id,time:this.s.time,room:roomAt(p)});q.suspicion[p.id]=(q.suspicion[p.id]||0)+3.5;}p.vent=i;p.ventTime=10;p.path=[];this.event('vent',{player:id});return true;}}
  }
  return false;
 }
 ventLinks(index){const groups=[[0,1],[2,3],[4,8],[5,11],[6,10],[7,9],[12,13]];return groups.find(g=>g.includes(index))?.filter(i=>i!==index)||[];}
 complete(p,t){if(p.done.includes(t.id))return;p.done.push(t.id);this.s.taskDone++;this.event('task',{player:p.id,task:t.id});
  if(t.visual&&this.settings.visual)for(const q of this.s.players.filter(q=>q.bot&&q.alive&&!isImp(q)&&q!==p&&this.canSee(q,p))){q.suspicion[p.id]=-8;q.memory.push({type:'clear',who:p.id,time:this.s.time,room:t.room});}
  this.checkWin();
 }
 kill(p,q){if(!p.alive||!q.alive||isImp(q))return;
  for(const w of this.s.players.filter(w=>w!==p&&w!==q&&w.bot&&w.alive&&!isImp(w)&&this.canSee(w,p)&&this.canSee(w,q))){w.suspicion[p.id]=20;w.memory.push({type:'kill',who:p.id,victim:q.id,room:roomAt(q),time:this.s.time});w.wait=this.rand(.7,2);w.goal='report';}
  q.alive=false;q.vent=-1;q.activeTask=null;q.path=[];this.s.bodies.push({id:q.id,x:q.x,y:q.y,color:q.color,time:this.s.time,killer:p.id});p.cooldown=this.settings.killCooldown;p.x=q.x;p.y=q.y;p.path=[];this.event('kill',{player:q.id,killer:p.id});this.checkWin();
 }
 meeting(reporter,body=null){
  this.s.phase='meeting';this.s.sabotage=null;this.s.doors=0;this.s.chat=[];this.s.meeting={reporter:reporter.id,body:body?.id||null,room:body?roomAt(body):'Cafeteria',timer:this.settings.discussion+this.settings.voting,discussion:this.settings.discussion,votes:{},talk:this.rand(1,2),stage:'discuss',turns:0,result:null};
  for(const p of this.s.players){p.path=[];p.input={x:0,y:0};p.activeTask=null;p.moving=false;p.vent=-1;p.spoken=false;p.accused=null;
   if(p.bot&&p.alive&&body&&!isImp(p)){
    const recent=p.memory.filter(m=>m.type==='seen'&&m.room===roomAt(body)&&m.time>body.time-12&&m.time<body.time+6);
    for(const m of recent)if(m.who!==body.id)p.suspicion[m.who]=(p.suspicion[m.who]||0)+1.4;
   }
  }
  this.say(null,body?`${reporter.name} reported ${this.player(body.id).name} in ${roomAt(body)}.`:`${reporter.name} called an emergency meeting.`);this.event('meeting',{body:!!body});
 }
 hear(speaker,text){
  const low=text.toLowerCase();let mentioned=this.s.players.filter(q=>q!==speaker&&(low.includes(q.name.toLowerCase())||new RegExp('\\b'+COLORS[q.color]+'\\b').test(low)));
  let accuse=/sus|kill|vent|vote|impost|saw|murder|liar|lying/.test(low),clear=/safe|clear|with me|innocent|scan/.test(low);
  for(const listener of this.s.players.filter(p=>p.bot&&p.alive&&p!==speaker&&!isImp(p))){
   let trust=(listener.suspicion[speaker.id]||0)>4?.3:1;
   for(const target of mentioned)if(target!==listener){let witnessed=listener.memory.some(m=>m.type==='kill'&&m.who===target.id);if(!witnessed)listener.suspicion[target.id]=(listener.suspicion[target.id]||0)+(clear?-1.6:accuse?2.4:0)*trust;}
  }
  if(this.s.phase==='meeting'&&/where|who|why|anyone|proof|evidence|what/.test(low))this.s.meeting.talk=Math.min(this.s.meeting.talk,.7);
 }
 botSpeak(p){
  const m=this.s.meeting;if(!m)return;const alive=this.s.players.filter(q=>q.alive&&q!==p),mem=p.memory||[];
  const witness=mem.findLast?.(x=>x.type==='kill')||mem.filter(x=>x.type==='kill').at(-1);
  let ranking=alive.map(q=>({p:q,s:p.suspicion[q.id]||0})).sort((a,b)=>b.s-a.s),sus=ranking[0];
  let text;
  if(isImp(p)){
   let target=alive.filter(q=>!isImp(q)).sort((a,b)=>(p.suspicion[b.id]||0)-(p.suspicion[a.id]||0))[0];
   const accused=this.s.chat.some(c=>c.text.toLowerCase().includes(p.name.toLowerCase())&&/sus|kill|vent|vote/i.test(c.text));
   if(accused)text=this.pick([`I was doing ${this.pick(['wires','download','card swipe'])}. ${target.name} is trying to frame me.`,`Wait what? I just came from ${p.lastRoom||'Storage'}. I didn’t see a body.`,`It’s not me. Why are we trusting ${target.name} so quickly?`]);
   else text=this.pick([`I saw ${target.name} near ${m.room} earlier. Not saying it’s them, but...`,`Where was everyone? I was in ${p.lastRoom||'Electrical'}.`,`I don’t have proof. We could skip here.`,`I think ${target.name} is sus. They doubled back when I came in.`]);
   p.accused=target.id;
  }else if(witness&&this.player(witness.who)?.alive){let killer=this.player(witness.who);text=this.pick([`I SAW ${killer.name} kill ${this.player(witness.victim).name} in ${witness.room}. Vote ${COLORS[killer.color]}.`,`${killer.name} did it. I was right there when they killed.`,`It is ${killer.name}. I literally watched the kill in ${witness.room}.`]);p.accused=killer.id;
  }else if(p.id===m.reporter&&!p.spoken){let body=this.player(m.body);text=body?`Body was in ${m.room}. ${body.name} was already dead when I got there.`:`I called this because ${sus&&sus.s>3?sus.p.name+' has been acting really strange':'we haven’t checked in for a while'}.`;
  }else if(sus&&sus.s>3){p.accused=sus.p.id;let vent=mem.find(x=>x.type==='vent'&&x.who===sus.p.id);text=vent?`I saw ${sus.p.name} use a vent in ${vent.room}. Could be engineer, but I’m suspicious.`:this.pick([`I’m leaning ${sus.p.name}. I saw them near ${m.room}.`,`Can ${sus.p.name} explain their route? Something feels off.`,`${sus.p.name} is the only lead I have. I’m voting them.`]);
  }else{
   const clear=mem.filter(x=>x.type==='clear'&&this.player(x.who)?.alive).at(-1),seen=mem.filter(x=>x.type==='seen'&&this.player(x.who)?.alive&&x.time>this.s.time-45).at(-1);
   if(clear)text=`${this.player(clear.who).name} is clear. I watched them ${clear.room==='MedBay'?'scan':'do a visual task'}.`;
   else if(seen&&this.random()<.5)text=`I passed ${this.player(seen.who).name} in ${seen.room}. Didn’t see anything else.`;
   else text=this.pick([`I was in ${p.lastRoom||roomAt(p)} doing tasks. Didn’t see a kill.`,`Any actual evidence? I don’t want to vote someone out for nothing.`,`Where exactly in ${m.room}?`,`I’ve got ${Math.max(0,p.tasks.length-p.done.length)} tasks left. We can still win on tasks.`,`I’m skipping unless someone saw something.`,`Who was with ${this.player(m.body)?.name||'the reporter'} last?`]);
  }
  p.spoken=true;this.say(p,text);this.hear(p,text);
 }
 vote(p,target){if(!p.alive||!this.s.meeting||this.s.meeting.stage==='result'||this.s.meeting.timer>this.settings.voting||Object.hasOwn(this.s.meeting.votes,p.id))return false;
  if(target!=='skip'&&!this.player(target)?.alive)return false;this.s.meeting.votes[p.id]=target;this.event('vote',{player:p.id});return true;
 }
 resolveVote(){
  let m=this.s.meeting,counts={skip:0};for(const p of this.s.players.filter(p=>p.alive)){let vote=m.votes[p.id]||'skip';counts[vote]=(counts[vote]||0)+1;}
  let order=Object.entries(counts).sort((a,b)=>b[1]-a[1]);let eject=order[0]?.[0],tie=order.length>1&&order[0][1]===order[1][1];if(tie||eject==='skip')eject=null;
  let ejected=this.player(eject);if(ejected)ejected.alive=false;
  m.result={eject,tie,counts,role:ejected?.role};m.stage='result';m.timer=7;this.s.bodies=[];this.event('eject',{player:eject});
 }
 checkWin(){if(!['playing','intro'].includes(this.s.phase))return;let living=this.s.players.filter(p=>p.alive),imps=living.filter(isImp).length,crew=living.length-imps;
  if(imps===0)this.finish('Crewmates','All Impostors were ejected.');else if(imps>=crew)this.finish('Impostors','The Impostors took over the ship.');else if(this.s.taskDone>=this.s.taskTotal)this.finish('Crewmates','All tasks completed.');
 }
 finish(winner,reason){this.s.winner={team:winner,reason};this.s.phase='ended';this.s.sabotage=null;this.event('end',{winner});}
 botTick(p,dt){
  if(p.vent>=0){p.ventTime-=dt;if(p.ventTime<6&&this.random()<dt*.7){let links=this.ventLinks(p.vent);if(links.length)this.action(p.id,'vent',{index:this.pick(links)});}if(p.ventTime<=0)this.action(p.id,'vent',{exit:true});return;}
  p.think-=dt;p.wait-=dt;
  if(p.think<=0){p.think=this.rand(.7,1.6);p.lastRoom=roomAt(p);
   if(p.alive&&!isImp(p)){
    for(const q of this.s.players.filter(q=>q!==p&&q.alive&&this.canSee(p,q))){p.memory.push({type:'seen',who:q.id,room:roomAt(q),time:this.s.time});}
    p.memory=p.memory.filter(m=>m.time>this.s.time-150).slice(-70);
    let body=this.nearestBody(p);if(body){if(p.goal!=='report'){p.goal='report';p.wait=this.rand(.7,2);}else if(p.wait<=0){this.meeting(p,body);return;}}
   }
   if(isImp(p)&&p.alive){
    let victim=this.nearestVictim(p),witnesses=this.s.players.filter(q=>q!==p&&q!==victim&&q.alive&&!isImp(q)&&this.canSee(q,p));
    let bold=(this.settings.difficulty==='Hard'?.06:this.settings.difficulty==='Easy'?.3:.14)*(p.personality==='careful'?.3:p.personality==='bold'?1.8:1);
    if(victim&&p.cooldown<=0&&(!witnesses.length||this.random()<bold)){this.kill(p,victim);p.wait=0;p.goal='escape';this.route(p,this.pick(ROOMS));return;}
    if(p.cooldown<=0&&(!p.path.length||this.random()<.25)){let target=this.pick(this.s.players.filter(q=>q.alive&&!isImp(q)&&q.vent<0));if(target){p.goal='hunt';this.route(p,target);}}
    if(!this.s.sabotage&&this.s.elapsed>22&&this.random()<.05){this.action(p.id,'sabotage',{type:this.pick(['lights','reactor','oxygen','comms'])});}
    if(p.cooldown>4&&this.random()<.08){this.action(p.id,'vent');}
   }
   if(p.goal==='repair'&&!this.s.sabotage){p.goal=null;p.path=[];}
  }
  if(this.s.phase!=='playing')return;
  if(p.goal==='report'){p.moving=false;return;}
  if(this.s.sabotage&&p.alive&&!isImp(p)){
   let target=SYSTEMS[this.s.sabotage.type];
   if(this.s.sabotage.type==='oxygen'&&this.s.sabotage.panels.includes('o2'))target={x:4110,y:1650};
   if(p.goal!=='repair'||!p.target||dist(p.target,target)>100){p.goal='repair';p.repairWait=this.rand(2,5);this.route(p,target);}
   if(dist(p,target)<230){p.moving=false;p.repairWait-=dt;if(p.repairWait<=0)this.action(p.id,'repair');}
   else this.follow(p,dt);
   return;
  }
  if(p.wait>0&&!p.path.length){p.moving=false;return;}
  const arrived=this.follow(p,dt);
  if(arrived){
   if(p.goal==='task'&&p.taskId){let task=STATIONS.find(t=>t.id===p.taskId);p.taskTime+=dt;if(p.taskTime>(isImp(p)?this.rand(5,9):this.settings.difficulty==='Hard'?9:13)){
     if(!isImp(p)&&!p.done.includes(task.id))this.complete(p,task);p.goal=null;p.taskTime=0;p.wait=this.rand(.6,2.5);
    }return;}
   if(p.goal==='hunt'){p.goal=null;return;}if(p.goal==='escape'){p.goal=null;p.wait=2;return;}
   const remaining=STATIONS.filter(t=>p.tasks.includes(t.id)&&!p.done.includes(t.id));
   if(remaining.length){let t=p.personality==='careful'?[...remaining].sort((a,b)=>dist(a,p)-dist(b,p))[0]:this.pick(remaining);p.taskId=t.id;p.goal='task';p.taskTime=0;this.route(p,t);}
   else {p.goal='wander';this.route(p,this.pick(ROOMS));p.wait=this.rand(1,4);}
  }
 }
 tick(dt){
  dt=Math.min(dt,.1);this.s.time+=dt;
  if(this.s.phase==='lobby'){if(this.random()<dt*.09){let p=this.pick(this.s.players.filter(p=>p.bot));if(p)this.say(p,this.pick(['gl hf','red is always sus lol','ready when you are','any engineers?','please don’t follow me into electrical','card swipe first try this time','where are we dropping','lets gooo']));}return;}
  if(this.s.phase==='intro'){this.s.intro-=dt;if(this.s.intro<=0)this.s.phase='playing';return;}
  if(this.s.phase==='meeting'){
   let m=this.s.meeting;m.timer-=dt;m.talk-=dt;
   if(m.stage==='result'){if(m.timer<=0){this.s.phase='playing';for(let i=0;i<this.s.players.length;i++){let p=this.s.players[i];let pos=this.nav.point(this.nav.nearest({x:3315+Math.cos(i*6.28/this.s.players.length)*220,y:860+Math.sin(i*6.28/this.s.players.length)*190}));p.x=pos.x;p.y=pos.y;p.cooldown=this.settings.killCooldown;p.path=[];p.goal=null;p.wait=this.rand(1,4);}this.s.meeting=null;this.checkWin();}return;}
   m.stage=m.timer>this.settings.voting?'discuss':'voting';
   if(m.talk<=0&&m.turns<Math.max(8,this.s.players.length+3)){let bots=this.s.players.filter(p=>p.bot&&p.alive),unspoken=bots.filter(p=>!p.spoken);let p=this.pick(unspoken.length?unspoken:bots);if(p)this.botSpeak(p);m.talk=this.rand(2,4.5);m.turns++;}
   if(m.stage==='voting')for(const p of this.s.players.filter(p=>p.alive&&p.bot&&!Object.hasOwn(m.votes,p.id))){if(m.timer<this.settings.voting-this.rand(3,14)){
    let targets=this.s.players.filter(q=>q.alive&&q!==p&&(!isImp(p)||!isImp(q))),ranking=targets.map(q=>({p:q,s:p.suspicion[q.id]||0})).sort((a,b)=>b.s-a.s);
    let target=ranking[0]?.s>3?ranking[0].p.id:'skip';
    if(isImp(p)){let counts={};for(const v of Object.values(m.votes))if(v!=='skip'&&!isImp(this.player(v)))counts[v]=(counts[v]||0)+1;target=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0]||p.accused||'skip';}
    this.vote(p,target);
   }}
   if(m.timer<=0||(m.stage==='voting'&&Object.keys(m.votes).length===this.s.players.filter(p=>p.alive).length))this.resolveVote();return;
  }
  if(this.s.phase!=='playing')return;
  this.s.elapsed+=dt;this.s.doors=Math.max(0,this.s.doors-dt);
  if(this.s.sabotage){this.s.sabotage.time-=dt;if(this.s.sabotage.time<=0){this.finish('Impostors',this.s.sabotage.type==='oxygen'?'Oxygen was depleted.':'The reactor melted down.');return;}}
  for(const p of this.s.players){p.cooldown=Math.max(0,p.cooldown-dt);p.sabCooldown=Math.max(0,(p.sabCooldown||0)-dt);p.ventCooldown=Math.max(0,(p.ventCooldown||0)-dt);
   if(p.bot)this.botTick(p,dt);else if(p.vent<0){if(p.input.x||p.input.y)this.move(p,p.input.x,p.input.y,dt);else this.follow(p,dt);}
   else if(p.role==='Engineer'){p.ventTime-=dt;if(p.ventTime<=0)this.action(p.id,'vent',{exit:true});}
   if(this.s.phase!=='playing')break;
  }
 }
 snapshot(id){let viewer=this.player(id),s=this.s;
  return {...s,settings:this.settings,players:s.players.map(p=>{
   const reveal=p.id===id||s.phase==='ended'||isImp(viewer)&&isImp(p);
   return {id:p.id,name:p.name,color:p.color,bot:p.bot,role:reveal?p.role:'Crewmate',alive:p.alive,x:p.x,y:p.y,face:p.face,moving:p.moving,inVent:p.vent>=0,vent:p.id===id?p.vent:-1,hidden:!viewer?false:p.id!==id&&s.phase==='playing'&&((p.vent>=0)||(!p.alive&&viewer.alive)||viewer.alive&&!this.canSee(viewer,p)),tasks:p.id===id?p.tasks:[],done:p.id===id?p.done:[],cooldown:p.id===id?p.cooldown:0,emergency:p.id===id?p.emergency:0,sabCooldown:p.id===id?p.sabCooldown:0,ventCooldown:p.id===id?p.ventCooldown:0};
  }),adminCounts:viewer&&dist(viewer,{x:3990,y:1740})<180?Object.fromEntries(ROOMS.map(r=>[r.name,s.players.filter(p=>p.alive&&p.vent<0&&roomAt(p)===r.name).length+s.bodies.filter(b=>roomAt(b)===r.name).length])):null,bodies:s.bodies.filter(b=>!viewer||!viewer.alive||dist(viewer,b)<850*this.settings.vision&&this.nav.line(viewer,b)).map(({killer,...b})=>b),chat:s.chat.filter(c=>!c.dead||!viewer?.alive),events:s.events.filter(e=>e.type!=='kill'||e.player===id||s.phase==='ended').map(e=>e.type==='kill'?{id:e.id,type:e.type,player:e.player}:e)};
 }
}
