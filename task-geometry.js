export const CANISTER_LAYOUT={width:800,height:520,bottle:{w:260,h:260*186/470},idle:{x:320,y:365},socket:{x:511,y:145},neck:{x:-127,y:10}};
export function canisterDock(center){const l=CANISTER_LAYOUT;return {x:center.x+l.neck.x,y:center.y+l.neck.y};}
export function canisterTarget(){const l=CANISTER_LAYOUT;return {x:l.socket.x-l.neck.x,y:l.socket.y-l.neck.y};}
export function canisterFits(center){const p=canisterDock(center),s=CANISTER_LAYOUT.socket;return Math.abs(p.x-s.x)<66&&Math.abs(p.y-s.y)<62;}
export function wireDrop(start,end,target,color,targetColor){return color===targetColor&&Math.hypot(end.x-start.x,end.y-start.y)>.18&&Math.hypot(end.x-target.x,end.y-target.y)<.105;}
export function angleDelta(a,b){let d=a-b;while(d>Math.PI)d-=Math.PI*2;while(d< -Math.PI)d+=Math.PI*2;return d;}
