import {isImp} from './roles.js?v=3.4.0';
export const appearanceOf=p=>p?.shifted||p;
export const isShifting=(p,time)=>!!p?.alive&&p.transformUntil>time&&p.transformKind==='Shapeshift';
export function perceivedIdentity(observer,actor,time){
 const seen=appearanceOf(actor);if(!actor?.shifted)return seen;
 const recognized=(observer.memory||[]).some(m=>m.type==='shift'&&m.who===actor.id&&m.as===seen.id&&m.shiftToken===actor.disguiseToken&&m.time<=time);
 return recognized?actor:seen;
}
export function recordShiftWitnesses(g,actor,disguise,reverting=false){
 for(const w of g.s.players.filter(w=>w.bot&&w.alive&&w!==actor&&!isImp(w)&&g.canSee(w,actor))){
  w.memory??=[];w.suspicion??={};w.memory.push({type:'shift',who:actor.id,as:disguise.id,shiftToken:actor.disguiseToken,reverting,room:g.roomAt(actor),time:g.s.time});w.suspicion[actor.id]=Math.max(12,w.suspicion[actor.id]||0);
 }
}
export function observePlayers(g,observer){
 observer.memory??=[];observer.routeHistory??=[];const room=g.roomAt(observer);
 if(observer.routeHistory.at(-1)?.room!==room)observer.routeHistory.push({room,time:g.s.time});observer.routeHistory=observer.routeHistory.filter(m=>m.time>g.s.time-150).slice(-10);
 for(const actor of g.s.players.filter(q=>q!==observer&&q.alive&&g.canSee(observer,q))){
  const seen=perceivedIdentity(observer,actor,g.s.time);observer.memory.push({type:'seen',who:seen.id,room:g.roomAt(actor),x:actor.x,y:actor.y,time:g.s.time});
  const original=actor.shifted&&g.player(actor.shifted.id);
  if(original?.alive&&original!==observer&&g.canSee(observer,original)&&!observer.memory.some(m=>m.type==='duplicate'&&m.who===original.id&&m.time>g.s.time-12))observer.memory.push({type:'duplicate',who:original.id,room:g.roomAt(actor),time:g.s.time});
 }
 // Preserve discrete evidence even in a crowded room full of recurring sightings.
 const recent=observer.memory.filter(m=>m.time>g.s.time-150);
 observer.memory=[...recent.filter(m=>m.type!=='seen').slice(-40),...recent.filter(m=>m.type==='seen').slice(-110)].sort((a,b)=>a.time-b.time);
}
