export const EJECTION_SECONDS=10;
export function ejectionText(state){const m=state.meeting,q=state.players.find(p=>p.id===m?.result?.eject);if(!m?.result)return ['', ''];const first=q?q.name+(state.settings.confirm?(m.result.impostor?' was An Impostor.':' was not An Impostor.'):' was ejected.'):'No one was ejected. ('+(m.result.tie?'Tie':'Skipped')+')';const n=m.result.remaining;return [first,state.settings.confirm&&Number.isInteger(n)?n+' Impostor'+(n===1?' remains.':'s remain.'):''];}
export function polusHand(confirm,impostor){return confirm&&impostor?'Ejecthands0002':'Ejecthands0001';}
export function typedEjection(lines,age){const first=Math.max(0,Math.floor((age-3.3)/.065)),nextAt=3.3+lines[0].length*.065+.65,second=Math.max(0,Math.floor((age-nextAt)/.065));return [lines[0].slice(0,first),lines[1].slice(0,second)];}
export class Ejection{
 constructor(visuals,drawCrew,sound){this.visuals=visuals;this.drawCrew=drawCrew;this.sound=sound;this.key='';this.lastLetters=0;this.splashed=false;}
 render(canvas,state,map){const m=state.meeting;if(m?.stage!=='eject')return;const key=state.round+':'+m.started;if(key!==this.key){this.key=key;this.lastLetters=0;this.splashed=false;}const age=Math.max(0,state.time-m.ejectAt),ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height,fx=this.visuals.fx,q=state.players.find(p=>p.id===m.result.eject),lines=ejectionText(state),typed=typedEjection(lines,age);ctx.clearRect(0,0,w,h);ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);
 if(map.id==='polus'){
  const lava=h*.69,g=ctx.createLinearGradient(0,lava-30,0,h);g.addColorStop(0,'#ffb74b');g.addColorStop(.12,'#f75b1c');g.addColorStop(1,'#b41b07');ctx.fillStyle=g;ctx.fillRect(0,lava-25,w,h-lava+25);
  fx.fit(ctx,'PBEjectwall',0,0,w*.22,lava+25);ctx.fillStyle='#2f213a';ctx.fillRect(0,0,w*.22,h*.18);
  for(let i=0;i<12;i++){ctx.globalAlpha=.16;ctx.fillStyle='#ffdb60';ctx.beginPath();ctx.ellipse((w*(i*.191+age*.013))%w,lava+30+(i%4)*h*.075,w*.13,4,0,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
  if(q){const scale=Math.min(w/1280,h/720),fall=Math.max(0,Math.min(1,(age-.3)/1.4)),x=w*.16+w*.39*fall,y=h*.25+h*.49*fall*fall;if(age<1.85){ctx.save();ctx.translate(x,y);ctx.rotate(fall*2.5);this.drawCrew(ctx,{...q,alive:true,face:1,moving:false},0,0,1.6*scale,false,0);ctx.restore();}
   if(age>=1.65&&!this.splashed){this.splashed=true;this.sound('polusEject',.65);}
   if(age>=1.65&&age<2.8)fx.clip(ctx,'LavaSplash',(age-1.65)/1.15,w*.55,lava,2.6*scale);
   if(age>=2.3&&age<5.2){const rise=Math.min(1,(age-2.3)/.5),sink=Math.max(0,(age-3.5)/1.7),hand=polusHand(state.settings.confirm,m.result.impostor);ctx.save();ctx.beginPath();ctx.rect(0,0,w,lava+5);ctx.clip();fx.draw(ctx,hand,w*.55,lava+90*scale-125*scale*rise+170*scale*sink,1.45*scale,q.color);ctx.restore();}
  }
  for(let i=0;i<4;i++)fx.clip(ctx,'LavaBubble',((age*.35+i*.27)%1),w*(.3+i*.19),lava+h*(.06+i%2*.13),.55*Math.min(w/1280,h/720));
 }else if(map.id==='mira'||map.id==='airship'){
  const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,map.id==='mira'?'#308dc4':'#8ac5df');g.addColorStop(1,'#d5f1fa');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);for(let i=0;i<11;i++){ctx.fillStyle='#fff8';ctx.beginPath();ctx.ellipse((i*.317*w)%w,((i*.213*h-age*100)%h+h)%h,w*(.12+i%3*.035),h*.07,0,0,Math.PI*2);ctx.fill();}if(q&&age<3){const t=Math.max(0,(age-.3)/2.4);ctx.save();ctx.translate(w*.52,h*(-.1+t*1.4));ctx.rotate(t*3.2);this.drawCrew(ctx,{...q,alive:true,moving:false},0,0,Math.min(w/600,h/380),false,0);ctx.restore();}
 }else{
  for(let i=0;i<105;i++){const x=((i*127.31+age*(18+i%5))%w),y=(i*93.71)%h;ctx.fillStyle=i%4?'#ffffffb8':'#a9c9ff';ctx.fillRect(x,y,i%3+1,i%3+1);}if(q&&age<4.2){const t=Math.max(0,(age-.3)/3.6);ctx.save();ctx.translate(-w*.15+w*1.45*t,h*.48+Math.sin(t*4)*h*.05);ctx.rotate(t*6);this.drawCrew(ctx,{...q,alive:true,moving:false},0,0,Math.min(w/650,h/410),false,0);ctx.restore();}
 }
 const letters=typed.join('').replace(/\s/g,'').length;if(letters>this.lastLetters&&age<9.6){this.sound('ejectText',.28);this.lastLetters=letters;}ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold '+Math.max(18,Math.min(w*.028,h*.052))+'px Arial';ctx.lineWidth=5;ctx.strokeStyle='#000';ctx.fillStyle='#fff';const y=map.id==='polus'?h*.37:h*.46;for(const [i,text]of typed.entries()){if(this.drawText)this.drawText(ctx,text,w/2,y+i*h*.095,Math.max(18,Math.min(w*.028,h*.052)),'#fff',w*.9);else{ctx.strokeText(text,w/2,y+i*h*.095);ctx.fillText(text,w/2,y+i*h*.095);}}if(age<.4||age>9.4){ctx.fillStyle='rgba(0,0,0,'+(age<.4?1-age/.4:(age-9.4)/.6)+')';ctx.fillRect(0,0,w,h);}canvas.setAttribute('aria-label',typed.filter(Boolean).join(' '));
 }
}
