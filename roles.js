import {recordShiftWitnesses,isShifting} from './perception.js?v=3.6.0';
export const IMPOSTOR_ROLES=['Impostor','Shapeshifter','Phantom','Viper'];
export const CREW_ROLES=['Crewmate','Engineer','Scientist','Tracker','Noisemaker','Detective','Judge'];
export const GHOST_ROLES=['Guardian Angel','Influencer'];
export const ALL_ROLES=[...CREW_ROLES,...IMPOSTOR_ROLES,...GHOST_ROLES];
export const isImp=p=>!!p&&(p.team==='impostor'||IMPOSTOR_ROLES.includes(p.role));
export const ROLE_INFO={
 Crewmate:{help:'Complete tasks and identify the Impostors.'},Impostor:{help:'Blend in, sabotage and eliminate the crew.'},
 Engineer:{help:'Travel through vents. Your time inside is limited.'},Scientist:{button:'VITALS',help:'Check vitals from anywhere. Completing tasks recharges your battery.'},
 Shapeshifter:{button:'SHIFT',help:'Copy another living player’s name, color and cosmetics. Witnesses can see you transform.'},
 Viper:{help:'Your acid kills dissolve corpses in three stages, making them unreportable when they disappear.'},
 Phantom:{button:'VANISH',help:'Become invisible to escape, then reappear before attacking.'},
 Tracker:{button:'TRACK',help:'Choose a living player and follow their temporary location marker on your map.'},
 Noisemaker:{help:'Your death raises an alarm and marks your body for the crew.'},
 Detective:{button:'NOTES',help:'Interrogate suspects about where they were when the selected victim died.'},
 Judge:{button:'OVERRULE',help:'Finish two tasks to unlock one Overrule. A wrong accusation ejects you instead.'},
 'Guardian Angel':{button:'PROTECT',help:'Shield a living crewmate against one attack. Communications sabotage disables protection.'},
 Influencer:{button:'SEND',help:'Send up to three image cards to a living player. Finish your ghost tasks too.'},
};
const near=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function initializeRoles(g,selected,preferred,me){
 const crew=selected.filter(p=>!isImp(p));
 if(g.settings.modernRoles!==false){g.shuffle(crew).slice(0,6).forEach((p,i)=>p.role=CREW_ROLES[i+1]);g.shuffle(selected.filter(isImp)).forEach((p,i)=>p.role=IMPOSTOR_ROLES[1+i%3]);}
 else{if(crew[0])crew[0].role='Engineer';if(crew[1])crew[1].role='Scientist';}
 if(preferred!=='Random'&&me){me.role=GHOST_ROLES.includes(preferred)?'Crewmate':preferred;me.team=IMPOSTOR_ROLES.includes(me.role)?'impostor':'crew';}
 for(const p of selected){p.team=isImp(p)?'impostor':'crew';p.originalRole=p.role;p.abilityCooldown=0;p.abilityTime=0;p.shifted=null;p.disguiseToken=0;p.phantom=0;p.shield=0;p.tracking=null;p.trackTime=0;p.battery=12;p.progress={};p.notes=[];p.interrogations=3;p.overrule=null;p.judgeUsed=false;p.sampleReady=0;p.messagesSent=0;}
 if(me&&GHOST_ROLES.includes(preferred)){me.alive=false;me.role=preferred;}
}
export function becomeGhost(g,p){
 if(isImp(p))return;
 const assigned=g.s.players.filter(q=>!q.alive&&q!==p).map(q=>q.role);
 if(g.settings.modernRoles!==false){if(!assigned.includes('Guardian Angel'))p.role='Guardian Angel';else if(!assigned.includes('Influencer'))p.role='Influencer';}
 p.abilityCooldown=0;
}
export function roleAction(g,p,action,data){
 const phase=g.s.phase;
 if(action==='vitals'){if(p.role!=='Scientist'||!p.alive||phase!=='playing')return false;p.vitalsOpen=!!data.open&&p.battery>0&&g.s.sabotage?.type!=='comms';return true;}
 if(action==='overrule'){
  let target=g.player(data.target);if(p.role!=='Judge'||!p.alive||p.judgeUsed||p.done.length<2||phase!=='meeting'||g.s.meeting.stage==='result'||!target?.alive||target===p)return false;
  if(g.s.meeting.overrule)return false;p.overrule=target.id;p.judgeUsed=true;g.s.meeting.overrule={judge:p.id,target:target.id};g.say(null,`${p.name} has called an Overrule. It resolves when voting ends.`);return true;
 }
 if(action==='interrogate'){
  let target=g.player(data.target),m=g.s.meeting;if(p.role!=='Detective'||!p.alive||phase!=='meeting'||!m?.body||p.interrogations<=0||p.abilityCooldown>0||!target)return false;
  const death=g.s.cases.find(c=>c.victim===m.body),location=death?.locations[target.id]||'Unknown';p.interrogations--;p.metrics.interrogated=(p.metrics.interrogated||0)+1;if(p.interrogations===0)p.metrics.notesFilled=(p.metrics.notesFilled||0)+1;p.abilityCooldown=4;p.notes.push({victim:m.body,target:target.id,location});g.event('notes',{player:p.id,target:target.id,location,victim:m.body});return true;
 }
 if(isShifting(p,g.s.time))return action==='input'||action==='walk'?null:false;if(action!=='ability')return null;
 if(!['playing','meeting'].includes(phase)||p.abilityCooldown>0||g.s.sabotage?.type==='comms'&&['Guardian Angel','Scientist','Tracker'].includes(p.role))return false;
 let target=g.player(data.target);
 if(p.role==='Shapeshifter'&&p.alive&&phase==='playing'&&p.vent<0){
  if(p.shifted){recordShiftWitnesses(g,p,p.shifted,true);p.shifted=null;p.moving=false;p.abilityTime=0;p.abilityCooldown=25;p.transformUntil=g.s.time+1.5;p.transformKind='Shapeshift';g.event('unshift',{player:p.id});return true;}
  if(!target?.alive||target===p||isImp(target))return false;
  p.disguiseToken=(p.disguiseToken||0)+1;recordShiftWitnesses(g,p,target);
  p.moving=false;p.shifted={id:target.id,name:target.name,color:target.color,cosmetics:{...target.cosmetics}};p.abilityTime=20;p.transformUntil=g.s.time+1.5;p.transformKind='Shapeshift';g.event('shift',{player:p.id,color:target.color});return true;
 }
 if(p.role==='Phantom'&&p.alive&&phase==='playing'&&p.vent<0){p.phantom=p.phantom>0?0:10;p.transformUntil=g.s.time+1.5;p.transformKind=p.phantom?'Phantom_vanish_charge':'Phantom_vanish_poof';if(!p.phantom)p.abilityCooldown=25;g.event('phantom',{player:p.id,vanish:p.phantom>0});return true;}
 if(p.role==='Tracker'&&p.alive&&phase==='playing'&&target?.alive&&target!==p){p.tracking=target.id;p.trackTime=15;p.abilityCooldown=35;g.event('track',{player:p.id});return true;}
 if(p.role==='Guardian Angel'&&!p.alive&&phase==='playing'&&target?.alive&&!isImp(target)){target.shield=10;target.shieldedBy=p.id;p.abilityCooldown=25;g.event('protect',{player:p.id,target:target.id});return true;}
 if(p.role==='Influencer'&&!p.alive&&phase==='playing'&&target?.alive&&Array.isArray(data.cards)&&data.cards.length>0&&data.cards.length<=3&&data.cards.every(n=>Number.isInteger(n)&&n>=0&&n<18)){
  p.abilityCooldown=35;p.messagesSent++;p.metrics.messages=(p.metrics.messages||0)+1;g.event('influence',{player:p.id,target:target.id,cards:data.cards});return true;
 }
 return false;
}
export function tickRole(g,p,dt){
 p.abilityCooldown=Math.max(0,(p.abilityCooldown||0)-dt);p.shield=Math.max(0,(p.shield||0)-dt);
 if(p.vitalsOpen){p.battery=Math.max(0,p.battery-dt);if(!p.battery||g.s.sabotage?.type==='comms')p.vitalsOpen=false;}
 if(p.shifted){p.abilityTime-=dt;if(p.abilityTime<=0){recordShiftWitnesses(g,p,p.shifted,true);p.shifted=null;p.moving=false;p.abilityCooldown=25;p.transformUntil=g.s.time+1.5;p.transformKind='Shapeshift';g.event('unshift',{player:p.id});}}
 if(p.phantom>0){p.phantom-=dt;if(p.phantom<=0){p.phantom=0;p.abilityCooldown=25;p.transformUntil=g.s.time+1.5;p.transformKind='Phantom_vanish_poof';g.event('phantom',{player:p.id,vanish:p.phantom>0});}}
 p.trackTime=Math.max(0,(p.trackTime||0)-dt);if(!p.trackTime)p.tracking=null;
 if(!p.bot||p.abilityCooldown>0||g.s.phase!=='playing')return;
 if(p.role==='Guardian Angel'&&!p.alive&&!g.s.sabotage){let target=g.s.players.filter(q=>q.alive&&!isImp(q)).sort((a,b)=>Number(b.id==='you')-Number(a.id==='you'))[0];if(target&&g.random()<dt*.12)roleAction(g,p,'ability',{target:target.id});}
 if(p.role==='Tracker'&&p.alive&&g.random()<dt*.025){let target=g.pick(g.s.players.filter(q=>q.alive&&q!==p));if(target)roleAction(g,p,'ability',{target:target.id});}
 if(p.role==='Shapeshifter'&&p.alive&&!p.shifted&&p.cooldown<12&&g.s.elapsed>12&&g.random()<dt*.1&&!g.s.players.some(q=>q!==p&&q.alive&&!isImp(q)&&g.canSee(q,p))){let target=g.pick(g.s.players.filter(q=>q.alive&&!isImp(q)));if(target)roleAction(g,p,'ability',{target:target.id});}
 if(p.role==='Phantom'&&p.alive&&p.cooldown>g.settings.killCooldown-5&&!p.phantom&&g.random()<dt*.8)roleAction(g,p,'ability',{});
 if(p.role==='Engineer'&&p.alive&&p.vent<0&&(p.ventCooldown||0)<=0&&g.random()<dt*.06)g.action(p.id,'vent');
}
