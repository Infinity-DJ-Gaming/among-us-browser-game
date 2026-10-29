export const SCAN_SECONDS=10;
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function scannerTarget(g,t){return g.nav.point(g.nav.nearest(t));}
export function beginScan(g,p,t){const target=scannerTarget(g,t);p.activeTask.scan={target,phase:'walking',at:null};p.path=g.nav.path(p,target);p.input={x:0,y:0};p.activeTask.time=g.s.time;}
export function tickScan(g,p){const a=p.activeTask;if(!a?.scan)return;const t=g.map.stations.find(t=>t.id===a.id);if(!t)return;const s=a.scan;
 if(s.phase==='walking'&&distance(p,s.target)<22){p.x=s.target.x;p.y=s.target.y;p.path=[];s.phase='waiting';}
 if(s.phase==='waiting'){const other=g.s.players.find(q=>q!==p&&q.activeTask?.scan?.phase==='scanning'&&distance(q.activeTask.scan.target,s.target)<60);if(other){s.waitingFor=other.id;return;}s.phase='scanning';s.at=g.s.time;s.waitingFor=null;a.time=g.s.time;p.moving=false;p.input={x:0,y:0};}
}
export function visualTask(g,p,own=false){if(!p.alive&&!own)return null;const a=p.activeTask,bot=p.bot&&p.goal==='task'&&p.taskTime>0,t=g.map.stations.find(t=>t.id===(a?.id||(bot?p.taskId:null)));if(!t?.visual||!g.settings.visual&&!own)return null;const current=g.stationFor?g.stationFor(p,t):t;if(a?.scan&&a.scan.phase!=='scanning')return null;const type=t.type,at=a?.scan?.at??a?.time??g.s.time-p.taskTime;return {id:t.id,type,at,duration:type==='scan'?SCAN_SECONDS:13,x:p.x,y:p.y,stage:p.progress?.[t.id]||0};}
export function addVisual(g,p,t,kind){if(!g.settings.visual||!p.alive)return;g.s.visualEffects??=[];g.s.visualEffects=g.s.visualEffects.filter(v=>v.until>g.s.time);g.s.visualEffects.push({player:p.id,kind,x:t.x,y:t.y,at:g.s.time,until:g.s.time+(kind==='shields'?4:kind==='garbage'?3:.6),color:p.color});if(kind==='shields')g.s.shieldsPowered=true;}
