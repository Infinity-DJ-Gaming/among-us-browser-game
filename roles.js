import {recordShiftWitnesses,isShifting} from './perception.js?v=3.7.0';
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
 Tracker:{button:'TRACK',help:'Get close to a player, then follow their temporary location marker on your map.'},
 Noisemaker:{help:'Your death raises an alarm and marks your body for the crew.'},
 Detective:{button:'NOTES',help:'Interrogate suspects about where they were when the selected victim died.'},
 Judge:{button:'OVERRULE',help:'Finish two tasks to unlock one Overrule. A wrong accusation ejects you instead.'},
 'Guardian Angel':{button:'PROTECT',help:'Shield a living crewmate against one attack. Communications sabotage disables protection.'},
 Influencer:{button:'SEND',help:'Send up to three image cards to a living player. Finish your ghost tasks too.'},
};
export const ROLE_RANGE={Tracker:125,Detective:72,'Guardian Angel':240,Influencer:240};
export function roleTarget(g,p,role=p.role){return g.s.players.filter(q=>q!==p&&q.alive&&near(p,q)<(ROLE_RANGE[role]||125)&&(role==='Guardian Angel'||role==='Influencer'||g.sightLine(p,q))).sort((a,b)=>(role==='Influencer'?Number(isImp(a))-Number(isImp(b)):0)||near(p,a)-near(p,b))[0];}
export function caseFiles(g,p){return g.s.cases.filter(c=>c.known||g.s.bodies.some(b=>b.id===c.victim&&near(p,b)<g.sightRadius(p)&&g.sightLine(p,b))).map(c=>({victim:c.victim,room:c.room,time:c.time,type:c.type,suspects:g.settings.detectiveSuspects??3,notes:p.notes.filter(n=>n.victim===c.victim).map(({actual,...n})=>n)}));}
const near=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function initializeRoles(g,selected,preferred,me){
 const crew=selected.filter(p=>!isImp(p));
 if(g.settings.modernRoles!==false){g.shuffle(crew).slice(0,6).forEach((p,i)=>p.role=CREW_ROLES[i+1]);g.shuffle(selected.filter(isImp)).forEach((p,i)=>p.role=IMPOSTOR_ROLES[1+i%3]);}
 else{if(crew[0])crew[0].role='Engineer';if(crew[1])crew[1].role='Scientist';}
 if(preferred!=='Random'&&me){me.role=GHOST_ROLES.includes(preferred)?'Crewmate':preferred;me.team=IMPOSTOR_ROLES.includes(me.role)?'impostor':'crew';}
 for(const p of selected){p.team=isImp(p)?'impostor':'crew';p.originalRole=p.role;p.abilityCooldown=0;p.abilityTime=0;p.shifted=null;p.disguiseToken=0;p.phantom=0;p.shield=0;p.tracking=null;p.trackTime=0;p.battery=g.settings.scientistBattery??5;p.batteryMax=p.battery;p.roundAlive=selected.filter(q=>q.alive).map(q=>q.id);p.influenceDeck=g.shuffle(Array.from({length:18},(_,i)=>i)).slice(0,9);p.refreshCooldown=0;p.progress={};p.notes=[];p.interrogations=3;p.overrule=null;p.judgeUsed=false;p.sampleReady=0;p.messagesSent=0;}
 if(me&&GHOST_ROLES.includes(preferred)){me.alive=false;me.role=preferred;}
}
export function becomeGhost(g,p){
 if(isImp(p))return;
 const assigned=g.s.players.filter(q=>!q.alive&&q!==p).map(q=>q.role);
 if(g.settings.modernRoles!==false){if(assigned.filter(r=>r==='Guardian Angel').length<(g.settings.guardianCount??1)&&g.random()<(g.settings.guardianChance??100)/100)p.role='Guardian Angel';else if(assigned.filter(r=>r==='Influencer').length<(g.settings.influencerCount??1)&&g.random()<(g.settings.influencerChance??100)/100)p.role='Influencer';}
 p.abilityCooldown=0;
}
export function roleAction(g,p,action,data){
 const phase=g.s.phase;
 if(action==='vitals'){if(p.role!=='Scientist'||!p.alive||phase!=='playing')return false;p.vitalsOpen=!!data.open&&p.battery>0&&g.s.sabotage?.type!=='comms';return true;}
 if(action==='overrule'){
  let target=g.player(data.target);if(p.role!=='Judge'||!p.alive||p.judgeUsed||p.done.length<2||phase!=='meeting'||!['discuss','voting'].includes(g.s.meeting.stage)||!target?.alive||target===p)return false;
  if(g.s.meeting.overrule)return false;p.overrule=target.id;p.judgeUsed=true;g.s.meeting.overrule={judge:p.id,target:target.id};g.say(null,`${p.name} has called an Overrule. It resolves when voting ends.`);return true;
 }
 if(action==='influenceRefresh'){if(p.role!=='Influencer'||p.alive||p.refreshCooldown>0||phase!=='playing')return false;p.influenceDeck=g.shuffle(Array.from({length:18},(_,i)=>i)).slice(0,9);p.refreshCooldown=10;return true;}
 if(action==='interrogate'){
  const target=roleTarget(g,p,'Detective'),death=g.s.cases.find(c=>c.victim===data.victim),known=caseFiles(g,p).some(c=>c.victim===data.victim);if(p.role!=='Detective'||!p.alive||phase!=='playing'||p.abilityCooldown>0||g.s.sabotage?.type==='comms'||!target||data.target&&target.id!==data.target||!death||!known)return false;
  const used=p.notes.filter(n=>n.victim===death.victim);if(used.length>=(g.settings.detectiveSuspects??3)||used.some(n=>n.actual===target.id))return false;
  p.metrics.interrogated=(p.metrics.interrogated||0)+1;if(used.length+1===(g.settings.detectiveSuspects??3))p.metrics.notesFilled=(p.metrics.notesFilled||0)+1;p.abilityCooldown=1;const note={victim:death.victim,target:target.shifted?.id||target.id,actual:target.id,location:death.locations[target.id]||'Unknown',disguised:!!target.shifted};p.notes.push(note);if(p.bot)p.memory.push({type:'interrogate',who:note.target,victim:note.victim,room:note.location,time:g.s.time});g.event('notes',{player:p.id,target:note.target,location:note.location,victim:death.victim});return true;
 }
 if(isShifting(p,g.s.time))return action==='input'||action==='walk'?null:false;if(action!=='ability')return null;
 if(!['playing','meeting'].includes(phase)||p.abilityCooldown>0||g.s.sabotage?.type==='comms'&&['Guardian Angel','Scientist','Tracker','Phantom'].includes(p.role))return false;
 let target=g.player(data.target);if(['Tracker','Guardian Angel','Influencer'].includes(p.role)){const nearest=roleTarget(g,p);if(data.target&&nearest?.id!==data.target)return false;target=nearest;}
 if(p.role==='Shapeshifter'&&p.alive&&phase==='playing'&&p.vent<0){
  if(p.shifted){recordShiftWitnesses(g,p,p.shifted,true);p.shifted=null;p.moving=false;p.abilityTime=0;p.abilityCooldown=25;p.transformUntil=g.s.time+1.5;p.transformKind='Shapeshift';g.event('unshift',{player:p.id});return true;}
  if(!target||target===p||!p.roundAlive.includes(target.id))return false;
  p.disguiseToken=(p.disguiseToken||0)+1;recordShiftWitnesses(g,p,target);
  p.moving=false;p.shifted={id:target.id,name:target.name,color:target.color,cosmetics:{...target.cosmetics}};p.abilityTime=g.settings.shiftDuration??20;p.transformUntil=g.s.time+1.5;p.transformKind='Shapeshift';g.event('shift',{player:p.id,color:target.color});return true;
 }
 if(p.role==='Phantom'&&p.alive&&phase==='playing'&&p.vent<0){if(!p.phantom)for(const w of g.s.players.filter(w=>w.bot&&w.alive&&!isImp(w)&&g.canSee(w,p))){w.memory.push({type:'phantom',who:p.id,room:g.roomAt(p),time:g.s.time});w.suspicion[p.id]=Math.max(12,w.suspicion[p.id]||0);}p.transformOrigin={x:p.x,y:p.y};p.phantom=p.phantom>0?0:(g.settings.phantomDuration??10);p.transformUntil=g.s.time+1.5;p.transformKind=p.phantom?'Phantom_vanish_charge':'Phantom_vanish_poof';if(!p.phantom)p.abilityCooldown=25;g.event('phantom',{player:p.id,vanish:p.phantom>0});return true;}
 if(p.role==='Tracker'&&p.alive&&phase==='playing'&&p.tracking){p.tracking=null;p.trackTime=0;p.abilityCooldown=35;g.event('untrack',{player:p.id});return true;}
 if(p.role==='Tracker'&&p.alive&&phase==='playing'&&target?.alive&&target!==p){p.tracking=target.id;p.trackTime=g.settings.trackDuration??15;p.abilityCooldown=0;g.event('track',{player:p.id});return true;}
 if(p.role==='Guardian Angel'&&!p.alive&&phase==='playing'&&target?.alive&&!isImp(target)){target.shield=g.settings.protectDuration??10;p.abilityTime=target.shield;target.shieldedBy=p.id;p.abilityCooldown=25;g.event('protect',{player:p.id,target:target.id});return true;}
 if(p.role==='Influencer'&&!p.alive&&phase==='playing'&&target?.alive&&Array.isArray(data.cards)&&data.cards.length>0&&data.cards.length<=3&&data.cards.every(n=>Number.isInteger(n)&&p.influenceDeck.includes(n))){
  p.abilityCooldown=35;p.messagesSent++;p.metrics.messages=(p.metrics.messages||0)+1;g.event('influence',{player:p.id,target:target.id,cards:data.cards});return true;
 }
 return false;
}
export function tickRole(g,p,dt){
 p.refreshCooldown=Math.max(0,(p.refreshCooldown||0)-dt);if(p.role==='Guardian Angel')p.abilityTime=Math.max(0,(p.abilityTime||0)-dt);
 p.abilityCooldown=Math.max(0,(p.abilityCooldown||0)-dt);p.shield=Math.max(0,(p.shield||0)-dt);
 if(p.role==='Engineer'&&p.vent>=0&&g.s.sabotage?.type==='comms')g.action(p.id,'vent',{exit:true});if(p.role==='Scientist'&&p.battery<=0&&p.tasks.length&&p.done.length>=p.tasks.length){p.batteryRecharge=(p.batteryRecharge||0)+dt;if(p.batteryRecharge>=(g.settings.scientistCooldown??20)){p.battery=p.batteryMax;p.batteryRecharge=0;}}
 if(p.vitalsOpen){p.battery=Math.max(0,p.battery-dt);if(!p.battery||g.s.sabotage?.type==='comms')p.vitalsOpen=false;}
 if(p.shifted){p.abilityTime-=dt;if(p.abilityTime<=0){recordShiftWitnesses(g,p,p.shifted,true);p.shifted=null;p.moving=false;p.abilityCooldown=25;p.transformUntil=g.s.time+1.5;p.transformKind='Shapeshift';g.event('unshift',{player:p.id});}}
 if(p.phantom>0){p.phantom-=dt;if(p.phantom<=0){p.phantom=0;p.abilityCooldown=25;p.transformUntil=g.s.time+1.5;p.transformKind='Phantom_vanish_poof';g.event('phantom',{player:p.id,vanish:p.phantom>0});}}
 const wasTracking=!!p.tracking;p.trackTime=Math.max(0,(p.trackTime||0)-dt);if(!p.trackTime&&wasTracking){p.tracking=null;p.abilityCooldown=35;g.event('untrack',{player:p.id});}
 if(!p.bot||p.abilityCooldown>0||g.s.phase!=='playing')return;
 if(p.role==='Guardian Angel'&&!p.alive&&!g.s.sabotage){let target=roleTarget(g,p);if(target&&g.random()<dt*.12)roleAction(g,p,'ability',{target:target.id});}
 if(p.role==='Detective'&&p.alive&&g.random()<dt*.3){const target=roleTarget(g,p),file=caseFiles(g,p).find(c=>c.notes.length<c.suspects&&!c.notes.some(n=>n.target===target?.id));if(target&&file)roleAction(g,p,'interrogate',{victim:file.victim,target:target.id});}
 if(p.role==='Influencer'&&!p.alive&&g.random()<dt*.02){const target=roleTarget(g,p);if(target)roleAction(g,p,'ability',{target:target.id,cards:p.influenceDeck.slice(0,3)});}
 if(p.role==='Tracker'&&p.alive&&g.random()<dt*.025){let target=roleTarget(g,p);if(target)roleAction(g,p,'ability',{target:target.id});}
 if(p.role==='Shapeshifter'&&p.alive&&!p.shifted&&p.cooldown<12&&g.s.elapsed>12&&g.random()<dt*.1&&!g.s.players.some(q=>q!==p&&q.alive&&!isImp(q)&&g.canSee(q,p))){let target=g.pick(g.s.players.filter(q=>q.alive&&!isImp(q)));if(target)roleAction(g,p,'ability',{target:target.id});}
 if(p.role==='Phantom'&&p.alive&&p.cooldown>g.settings.killCooldown-5&&!p.phantom&&g.random()<dt*.8)roleAction(g,p,'ability',{});
 if(p.role==='Engineer'&&p.alive&&p.vent<0&&(p.ventCooldown||0)<=0&&g.random()<dt*.06)g.action(p.id,'vent');
}
