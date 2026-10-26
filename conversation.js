// A local, evidence-based conversation system: turn-taking, references, questions,
// rebuttals and persistent claims. No API key or remote language service is used.
import {isImp} from './roles.js';
const colors=['red','blue','green','pink','orange','yellow','black','white','purple','brown'];
const norm=t=>String(t).toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9?@\s]/g,' ').replace(/\s+/g,' ').trim();
const last=(a,p)=>[...a].reverse().find(p);
export function beginConversation(g){g.s.conversation={queue:[],typing:null,lastSpeech:g.s.time-3,replied:{},opening:[],humanTurns:0};}
export function parseMessage(g,speaker,text){
 let low=norm(text),named=g.s.players.filter(p=>p.id!==speaker.id&&(new RegExp('(^|\\W)'+norm(p.name)+'(\\W|$)').test(low)||new RegExp('\\b'+colors[p.color]+'\\b').test(low)));
 let direct=named.find(p=>low.startsWith('@'+norm(p.name)+',')||low.startsWith('@'+norm(p.name)+' '));if(direct&&named.length>1)named=named.filter(p=>p!==direct);named.sort((a,b)=>low.indexOf(norm(a.name))-low.indexOf(norm(b.name)));
 let rooms=['Cafeteria','Weapons','O2','Navigation','Shields','Communications','Storage','Admin','Electrical','MedBay','Security','Reactor','Upper Engine','Lower Engine'];let room=rooms.find(r=>low.includes(norm(r)))||(/\belec\b/.test(low)?'Electrical':/\bmed\b/.test(low)?'MedBay':/\bnav\b/.test(low)?'Navigation':null);
 const intent=/\b(hi|hey|hello|yo|sup|gl|ready|start|gg|good luck)\b/.test(low)&&g.s.phase==='lobby'?'greeting':
  /\b(skip|no evidence|not enough|dont vote)\b/.test(low)?'skip':
  /\b(why|proof|evidence|sure|how do|how did|explain|counter|did you see|what did you see)\b/.test(low)?'evidence':
  /\b(innocent|safe|clear|scanned|scan|with me|with you)\b/.test(low)&&!/(fake|faking|clear asteroids|clean o2)/.test(low)?'clear':
  /\b(not me|wasnt me|was not me|im not|i didnt|never killed|framed|frame me)\b/.test(low)?'defend':
  /\b(sus|suspicious|impostor|imposter|killed|kill|murder|vented|vent|vote|lying|liar|saw)\b/.test(low)&&named.length?'accuse':
  /\b(why|proof|evidence|sure|how do|how did|explain|counter)\b/.test(low)?'evidence':
  /\b(where|location|route|were you|was everyone|alibi)\b/.test(low)?'where':
  /\b(who|anyone|think|suspect)\b/.test(low)?'suspects':
  /\b(task|doing|download|wires|card|asteroid|reactor|medbay|electrical)\b/.test(low)?'alibi':
  /\b(yes|agree|true|right|ok|okay|makes sense)\b/.test(low)?'agree':'other';
 return {intent,targets:named.map(p=>p.id),room,kill:/\b(killed|kill|murder)\b/.test(low),vent:/\b(vent|vented)\b/.test(low),question:low.includes('?')||['where','evidence','suspects'].includes(intent),low};
}
function queueReply(g,p,message,parsed,priority=0,delay=0){
 let c=g.s.conversation;if(!c||!p?.bot||!p.alive&&!message.dead||p.id===message.player)return;
 let root=message.root||message.id,key=root+':'+p.id;if(c.replied[key]||c.queue.some(q=>q.player===p.id&&q.root===root))return;
 if(message.depth>=2&&message.player?.startsWith('bot'))return;
 c.queue.push({player:p.id,allowDead:!!message.dead,replyTo:message.id,root,depth:(message.depth||0)+1,parsed,source:message,priority,due:g.s.time+delay});c.queue.sort((a,b)=>b.priority-a.priority||a.due-b.due);c.queue=c.queue.slice(0,14);
}
export function hearMessage(g,speaker,text,message=g.s.chat.at(-1)){
 if(!message||!['meeting','lobby'].includes(g.s.phase))return;
 if(!g.s.conversation)beginConversation(g);let c=g.s.conversation,parsed=parseMessage(g,speaker,text);message.intent=parsed.intent;message.subject=parsed.targets[0]||null;
 let bots=g.s.players.filter(p=>p.bot&&p.alive===speaker.alive&&p!==speaker),human=!speaker.bot;
 if(human){c.humanTurns++;c.queue=c.queue.filter(q=>q.priority>=4);if(c.typing&&c.typing.priority<4)c.typing=null;}
 for(const p of bots){
  p.suspicion??={};p.claims??=[];p.memory??=[];
  if(parsed.intent==='accuse')for(const id of parsed.targets){if(id===p.id)continue;let direct=p.memory.some(m=>['kill','shift'].includes(m.type)&&m.who===id),trust=(p.suspicion[speaker.id]||0)>5?.3:1;
   if(!direct&&!isImp(p)){const hearsay=p.claims.filter(q=>q.speaker===speaker.id&&q.target===id&&q.intent==='accuse');if(!hearsay.length)p.suspicion[id]=(p.suspicion[id]||0)+(parsed.kill?3:parsed.vent?1.5:1)*trust;}
   p.claims.push({speaker:speaker.id,target:id,intent:'accuse',room:parsed.room,time:g.s.time,kill:parsed.kill});
  }
  if(parsed.intent==='clear'&&!isImp(p))for(const id of parsed.targets){if(!p.memory.some(m=>m.type==='kill'&&m.who===id))p.suspicion[id]=(p.suspicion[id]||0)-1;}
 }
 if(g.s.phase==='lobby'){
  let targets=parsed.targets.map(id=>g.player(id)).filter(p=>p?.bot);if(!targets.length)targets=[g.pick(bots)];if(human)for(const p of targets.slice(0,2))queueReply(g,p,message,parsed,5,.7);return;
 }
 const addressed=parsed.targets.map(id=>g.player(id)).filter(p=>p?.bot&&p.alive===speaker.alive);
 if(parsed.intent==='accuse'){
  for(const target of addressed)queueReply(g,target,message,parsed,human?9:6,.4);
  const relevant=bots.filter(p=>!addressed.includes(p)&&p.memory.some(m=>parsed.targets.includes(m.who)&&['kill','clear','vent','shift'].includes(m.type)));
  if(relevant.length)queueReply(g,g.pick(relevant),message,parsed,human?7:4,1.4);
 }else if(['where','evidence','suspects','clear','defend','alibi','skip'].includes(parsed.intent)){
  let candidates=addressed.length?addressed:bots;
  if(parsed.intent==='evidence'){let claimant=last(g.s.chat,m=>m.player!==speaker.id&&m.intent==='accuse');let author=g.player(claimant?.player);if(author?.bot)candidates=[author,...candidates.filter(p=>p!==author)];}
  if(parsed.intent==='alibi'&&parsed.room){let witnesses=bots.filter(p=>p.memory.some(m=>m.type==='seen'&&m.who===speaker.id&&m.room===parsed.room));candidates=human?[...witnesses,...candidates]:witnesses;}
  for(const p of [...new Set(candidates)].slice(0,human?2:1))queueReply(g,p,message,parsed,human?8:3,.6);
 }else if(human){queueReply(g,g.pick(addressed.length?addressed:bots),message,parsed,6,.6);}
}
function facts(g,p){let mem=p.memory||[],alive=g.s.players.filter(q=>q.alive&&q!==p),witness=last(mem,m=>m.type==='kill'&&g.player(m.who)?.alive),clear=last(mem,m=>m.type==='clear'&&g.player(m.who)?.alive),vent=last(mem,m=>m.type==='vent'&&g.player(m.who)?.alive),shift=last(mem,m=>m.type==='shift'&&g.player(m.who)?.alive),seen=last(mem,m=>m.type==='seen'&&g.player(m.who)?.alive),ranking=alive.filter(q=>!isImp(p)||!isImp(q)).map(q=>({p:q,score:p.suspicion?.[q.id]||0})).sort((a,b)=>b.score-a.score);return {witness,clear,vent,shift,seen,best:ranking[0]};}
function alibi(g,p){
 let f=facts(g,p),a=p.meetingAlibi||{},room=p.alibiRoom||a.room||p.lastRoom||g.roomAt(p),task=a.task||'tasks';
 if(isImp(p)){p.alibiRoom??=p.lastRoom||g.roomAt(p);room=p.alibiRoom;}
 const seen=last(p.memory||[],m=>m.type==='seen'&&m.room===room&&g.player(m.who)?.alive);
 return `I was in ${room}${a.working?' doing '+task.toLowerCase():a.to?' on my way to '+a.to:p.done.length?` after finishing ${p.done.length} task${p.done.length===1?'':'s'}`:' when the report came in'}.${seen?` I passed ${g.player(seen.who).name} there.`:' I was on my own.'}`;
}
function evidence(g,p,target){let f=facts(g,p),id=target?.id;
 let m=last(p.memory||[],m=>(!id||m.who===id)&&['kill','shift','vent','clear'].includes(m.type));
 if(m){let q=g.player(m.who);if(m.type==='kill')return `I saw ${q.name} kill ${g.player(m.victim)?.name||'them'} in ${m.room}. I’m voting ${q.name}.`;
  if(m.type==='shift')return `I watched ${q.name} shapeshift into ${g.player(m.as)?.name||'another player'} in ${m.room}. That’s why I’m accusing them.`;
  if(m.type==='vent')return `I saw ${q.name} enter a vent in ${m.room}. That alone isn’t proof — Engineer exists.`;
  return `${q.name} did a visual task in ${m.room} in front of me. That’s why I’m clearing them.`;
 }
 if(isImp(p)&&p.accused){let q=g.player(p.accused);return `I didn’t see the kill. ${q?.name||'They'} came from ${g.s.meeting?.room||'that side'} right before the report. That’s my reason, not a hard clear.`;}
 const claim=last(p.claims||[],c=>(!id||c.target===id)&&c.intent==='accuse');if(claim)return `I didn’t see it myself. ${g.player(claim.speaker)?.name} accused ${g.player(claim.target)?.name}${claim.room?' in '+claim.room:''}. I want their evidence before we vote.`;
 return 'I haven’t seen a kill or a shift. I can give my route, but I don’t have proof on anyone.';
}
export function makeReply(g,p,entry){
 const source=entry.source,speaker=g.player(source.player),parsed=entry.parsed,f=facts(g,p),address=(!speaker?.bot||entry.depth<=1)&&speaker?'@'+speaker.name+', ':'',target=g.player(parsed.targets[0]);let text;
 if(g.s.phase==='lobby'){
  text=/how|move|control/.test(parsed.low)?'WASD or arrows to walk. E opens the wardrobe in this lobby. In a match, E uses consoles, R reports and Q kills if youre imp':/hat|color|cosmetic/.test(parsed.low)?'the laptop opens the wardrobe. pick whatever you like':/role|viper|shape|engineer/.test(parsed.low)?'roles are random unless you pick a practice role in settings':parsed.intent==='greeting'?g.pick(['hey! ready when you are','yep im ready, gl everyone','hi :) lets go','ready! just choosing a hat']):'got you. im ready to start whenever you are';
 }else if(parsed.intent==='accuse'&&parsed.targets.includes(p.id)){
  if(isImp(p)){p.alibiRoom??=p.lastRoom||g.roomAt(p);text=parsed.kill?`I didn’t kill them. ${alibi(g,p)} Did you see the kill itself, or just someone with my color? Shapeshifter is on.`:parsed.vent?`A vent doesn’t prove a kill. ${alibi(g,p)} Who actually saw the body?`:`What did I do that was suspicious? ${alibi(g,p)}`;}
  else if(parsed.vent&&p.role==='Engineer')text='I’m Engineer. Yes, I used that vent. I can demonstrate it, but tell me if you actually saw a kill.';
  else text=(parsed.kill?'That wasn’t me. If you saw my color, a Shapeshifter could have copied it. ':'I’m crew. ')+alibi(g,p)+(parsed.room&&parsed.room!==(p.lastRoom||g.roomAt(p))?` I wasn’t in ${parsed.room}.`:' What exactly did you see?');
 }else if(parsed.intent==='where'||parsed.intent==='alibi'){
  let saw=last(p.memory||[],m=>m.who===speaker?.id&&m.type==='seen'&&(!parsed.room||m.room===parsed.room));
  text=parsed.intent==='alibi'&&saw?`I can back part of that up — I passed you in ${saw.room}. I didn’t stay with you the whole time.`:alibi(g,p);
 }else if(parsed.intent==='evidence')text=evidence(g,p,target);
 else if(parsed.intent==='clear'){
  if(target?.id===p.id)text=`That matches my route. ${alibi(g,p)} Seeing me there helps, but it isn’t a visual-task clear.`;
  else if(f.witness&&(!target||f.witness.who===target.id))text=`I can’t clear ${g.player(f.witness.who).name}. ${evidence(g,p,g.player(f.witness.who))}`;
  else if(target&&f.clear?.who===target.id)text=`Agreed on ${target.name}. I saw the visual task too.`;
  else text=`${target?target.name+' may be safe':'That helps'}, but a route alibi isn’t the same as a visual clear. Did you see a scan or just stand together?`;
 }else if(parsed.intent==='defend'){
  if(f.witness?.who===speaker?.id)text=`I’m not accusing you for your route. I saw the kill in ${f.witness.room}. Your task alibi doesn’t explain that.`;
  else text=`Okay, ${speaker?.name||'then'}. ${parsed.room?'Can anyone confirm you were in '+parsed.room+'?':'Who can confirm your route?'} I’m listening before locking my vote.`;
 }else if(parsed.intent==='accuse'){
  if(f.witness&&f.witness.who===target?.id)text=`I can confirm the accusation. ${evidence(g,p,target)}`;
  else if(f.clear?.who===target?.id)text=`Hold on — ${target.name} did a visual task in front of me. Could the person you saw have been a Shapeshifter?`;
  else text=`${target?.name||'They'} should answer that. ${parsed.kill?'Did you actually see the kill happen?':'Being nearby isn’t enough by itself.'}`;
 }else if(parsed.intent==='skip')text=f.witness?`I disagree with skipping. ${evidence(g,p,g.player(f.witness.who))}`:f.best?.score>7?`I’d rather hear ${f.best.p.name} answer the accusation before we skip.`:'I’m okay with skip if nobody has direct evidence. We still have tasks left.';
 else if(parsed.intent==='suspects')text=f.witness?evidence(g,p,g.player(f.witness.who)):f.best?.score>3?`I’m leaning ${f.best.p.name}, but I want to hear their answer. ${evidence(g,p,f.best.p)}`:'No solid suspect from me yet. Who was nearest the body?';
 else if(/bot|respond|answer|talk|hello|hi|hey/.test(parsed.low))text=`I’m here. Ask me where I was, name someone you suspect, or tell me what you saw${g.s.meeting?.room?' in '+g.s.meeting.room:''}.`;
 else text=`I heard you. ${source.text.length<12?'What did you see?':`Are you saying ${target?target.name+' was involved':'you have a lead'}, or asking about my route?`}`;
 return address+text;
}
export function openingStatement(g,p){
 const m=g.s.meeting,f=facts(g,p);p.spoken=true;
 if(f.witness){p.accused=f.witness.who;return evidence(g,p,g.player(f.witness.who));}
 if(p.memory?.some(m=>m.type==='clone'))return 'Someone with my exact color killed in front of me. That was a Shapeshifter — I know it wasn’t me. Did anyone see a transformation?';
 if(f.shift){p.accused=f.shift.who;return evidence(g,p,g.player(f.shift.who));}
 if(p.id===m.reporter)return m.body?`Body was in ${m.room}. ${g.player(m.body)?.name} was already down when I found them. Who came through there?`:`I called this because ${f.best?.score>4?f.best.p.name+' has been acting suspicious':'I wanted to check our information'}.`;
 if(f.clear)return evidence(g,p,g.player(f.clear.who));
 if(isImp(p)){
  const target=f.best?.p;if(target){p.accused=target.id;return `${alibi(g,p)} ${target.name}, where were you before the report?`;}
 }
 if(f.best?.score>4){p.accused=f.best.p.id;return `${f.best.p.name} is my main question. ${evidence(g,p,f.best.p)}`;}
 return alibi(g,p);
}
export function tickConversation(g,dt){
 let c=g.s.conversation;if(!c)return;const m=g.s.meeting;
 if(g.s.phase==='meeting'&&m?.stage==='result'){c.queue=[];c.typing=null;return;}
 if(c.typing){
  if(g.s.time<c.typing.until)return;let t=c.typing,p=g.player(t.player);c.typing=null;if(!p||!p.alive&&!t.allowDead)return;
  if(t.root)c.replied[t.root+':'+p.id]=true;
  const msg=g.say(p,t.text,'all',{replyTo:t.replyTo||null,root:t.root||null,depth:t.depth||0});c.lastSpeech=g.s.time;p.lastSaid=t.text;
  if(t.opening||t.replyTo)p.spoken=true;hearMessage(g,p,t.text,msg);return;
 }
 if(g.s.time-c.lastSpeech<1.1)return;
 let index=c.queue.findIndex(q=>q.due<=g.s.time&&(g.player(q.player)?.alive||q.allowDead)),entry=index>=0?c.queue.splice(index,1)[0]:null,p=entry?g.player(entry.player):null,text;
 if(entry)text=makeReply(g,p,entry);
 else if(g.s.phase==='meeting'&&m&&m.timer>5){
  let unspoken=g.s.players.filter(p=>p.bot&&p.alive&&!p.spoken);if(!unspoken.length)return;p=unspoken.find(p=>p.id===m.reporter)||unspoken.find(p=>facts(g,p).witness)||g.pick(unspoken);text=openingStatement(g,p);entry={opening:true,priority:1};
 }else return;
 if(!p||!text||text===p.lastSaid)return;
 c.typing={...entry,player:p.id,text,until:g.s.time+Math.min(3.1,.45+text.length/(p.personality==='chatty'?75:60))};
}
