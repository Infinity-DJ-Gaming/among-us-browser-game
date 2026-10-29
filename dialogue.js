import {isImp} from './roles.js?v=3.6.0';
import {parseMessage,normalize} from './chat-language.js?v=3.6.0';
const COLORS=['red','blue','green','pink','orange','yellow','black','white','purple','brown','cyan','lime','maroon','rose','banana','gray','tan','coral'];
const latest=(a,p)=>[...(a||[])].reverse().find(p);
const shortRooms={Electrical:'elec',MedBay:'medbay',Navigation:'nav',Cafeteria:'caf',Communications:'comms',Laboratory:'lab','Specimen Room':'specimen','Upper Engine':'upper engine','Lower Engine':'lower engine'};
const roomName=(p,room)=>p.personality==='careful'?room:(shortRooms[room]||String(room||'outside').toLowerCase());
const ownAlibi=(g,p)=>p.alibiRoom||p.meetingAlibi?.room||p.lastRoom||g.roomAt(p);
function label(g,p,id,entry){const q=g.player(id);if(!q)return 'someone';const mention=entry?.parsed?.mentions?.find(m=>m.id===id);return mention?.kind==='name'?q.name:mention?.kind==='color'?COLORS[q.color]:g.random()<.7?COLORS[q.color]:q.name;}
function facts(g,p){const relevant=m=>(!isImp(p)||!isImp(g.player(m.who)))&&g.player(m.who)?.alive;
 const memory=p.memory||[],witness=latest(memory,m=>['kill','death'].includes(m.type)&&relevant(m)),shift=latest(memory,m=>m.type==='shift'&&relevant(m)),clear=latest(memory,m=>m.type==='clear'&&relevant(m)),vent=latest(memory,m=>m.type==='vent'&&relevant(m)),clone=latest(memory,m=>['clone','duplicate'].includes(m.type));
 const ranking=g.s.players.filter(q=>q.alive&&q!==p&&(!isImp(p)||!isImp(q))).map(q=>({p:q,score:p.suspicion?.[q.id]||0})).sort((a,b)=>b.score-a.score);return {witness,shift,clear,vent,clone,best:ranking[0],ranking};
}
export function beginConversation(g){
 for(const p of g.s.players){p.evidenceTold={};p.denials=0;}
 const previous=g.s.lastVerdict;g.s.conversation={queue:[],typing:null,lastSpeech:g.s.time-2,nextSpeech:g.s.time,replied:{},totals:{},focus:null,alibis:{},humanTurns:0,bodyQuestionAsked:false,whoAsked:false,proofAsked:false,publicBodyRoom:null,volunteers:0,reviewed:false,lobbyBanter:0};
 if(g.s.phase==='meeting'&&previous){const ghost=g.player(previous.target);if(ghost?.bot&&!ghost.alive&&ghost.reviewedVerdict!==previous.id){ghost.reviewedVerdict=previous.id;g.s.conversation.queue.push({player:ghost.id,allowDead:true,scriptedText:g.pick(['why did yall vote me 😭','bro i told you it wasnt me','😭']),priority:0,due:g.s.time+3,opening:true});}}
}
function queueReply(g,p,message,parsed,priority=0,delay=.3){
 const c=g.s.conversation;if(!c||!p?.bot||p.alive===!!message.dead||p.id===message.player)return;
 const root=message.root||message.id,key=root+':'+p.id;if((c.replied[key]||0)>=3||(c.totals[root]||0)>=8||c.queue.some(q=>q.player===p.id&&q.root===root)||c.typing?.player===p.id&&c.typing.root===root)return;
 if((message.depth||0)>=5)return;
 c.queue.push({player:p.id,allowDead:!!message.dead,replyTo:message.id,root,depth:(message.depth||0)+1,parsed,source:message,priority,due:g.s.time+delay});c.queue.sort((a,b)=>b.priority-a.priority||a.due-b.due);c.queue=c.queue.slice(0,16);
}
function rememberClaim(g,p,speaker,parsed,message){
 p.suspicion??={};p.claims??=[];p.memory??=[];
 if(parsed.intent==='accuse'&&parsed.actor&&parsed.actor!==p.id){
  const id=parsed.actor,direct=p.memory.some(m=>['kill','shift'].includes(m.type)&&m.who===id),hardClear=p.memory.some(m=>m.type==='clear'&&m.who===id),existing=p.claims.some(c=>c.speaker===speaker.id&&c.target===id&&c.intent==='accuse');
  const relay=(parsed.reportedSpeech||message.replyTo&&!parsed.witnessClaim)&&p.claims.some(c=>c.target===id&&c.root===(message.root||message.id));if(!isImp(p)&&!direct&&!hardClear&&!existing&&!relay){const trust=(p.suspicion[speaker.id]||0)>6?.25:1,weight=parsed.reportedSpeech?.35:parsed.kill?(parsed.witnessClaim?3:1.6):parsed.vent?1.2:parsed.fake?1.5:parsed.selfReport?.6:.7;p.suspicion[id]=(p.suspicion[id]||0)+weight*trust;}
  if(!existing)p.claims.push({speaker:speaker.id,target:id,victim:parsed.victim,intent:'accuse',room:parsed.room,time:g.s.time,kill:parsed.kill,vent:parsed.vent,firsthand:parsed.witnessClaim,source:message.id,root:message.root||message.id});
 }
 if(parsed.intent==='alibi'&&parsed.room)p.claims.push({speaker:speaker.id,target:speaker.id,intent:'alibi',room:parsed.room,time:g.s.time});
 if(parsed.intent==='clear')for(const id of parsed.targets){if(!isImp(p)&&!p.memory.some(m=>['kill','shift'].includes(m.type)&&m.who===id)&&!p.claims.some(c=>c.intent==='clear'&&c.speaker===speaker.id&&c.target===id)){p.suspicion[id]=(p.suspicion[id]||0)-.6;p.claims.push({speaker:speaker.id,target:id,intent:'clear',time:g.s.time});}}
 if(parsed.roleClaim)p.claims.push({speaker:speaker.id,target:parsed.actor||speaker.id,intent:'role',role:parsed.roleClaim,time:g.s.time});
}
export function hearMessage(g,speaker,text,message=g.s.chat.at(-1)){
 if(!message||!['meeting','lobby'].includes(g.s.phase))return;if(!g.s.conversation)beginConversation(g);
 const c=g.s.conversation,parsed=parseMessage(g,speaker,text),human=!speaker.bot,bots=g.s.players.filter(p=>p.bot&&p.alive===speaker.alive&&p!==speaker);
 message.intent=parsed.intent;message.subject=parsed.actor||parsed.targets[0]||null;message.victim=parsed.victim||null;
 if(speaker.bot&&parsed.intent==='accuse'&&parsed.actor&&speaker.memory?.some(m=>m.type==='kill'&&m.who===parsed.actor)){speaker.evidenceTold??={};speaker.evidenceTold[parsed.actor]=(speaker.evidenceTold[parsed.actor]||0)+1;}
 if(parsed.intent==='accuse'||parsed.intent==='call'){const subject=parsed.actor||parsed.targets[0];if(subject)c.focus={suspect:subject,claimant:speaker.id,message:message.id,victim:parsed.victim,room:parsed.room||c.publicBodyRoom,kill:parsed.kill};}
 if(parsed.intent==='where'||parsed.intent==='body-where')c.lastQuestion={kind:parsed.intent,target:parsed.targets[0]||null,source:speaker.id,time:g.s.time};
 if(parsed.intent==='body-where')c.bodyQuestionAsked=true;
 if(parsed.intent==='alibi'){c.lastAlibi={player:speaker.id,room:parsed.room,time:g.s.time};if(parsed.room)c.alibis[speaker.id]={room:parsed.room,time:g.s.time};}
 if(parsed.room&&(parsed.intent==='body-location'||parsed.kill&&(speaker.id===g.s.meeting?.reporter||parsed.victim===g.s.meeting?.body)||/\bbody\b/.test(parsed.low)))c.publicBodyRoom=parsed.room;
 if(parsed.intent==='suspects')c.whoAsked=true;if(parsed.intent==='evidence')c.proofAsked=true;
 for(const p of bots)rememberClaim(g,p,speaker,parsed,message);
 if(human){c.humanTurns++;c.queue=c.queue.filter(q=>q.priority>=8);if(c.typing?.priority<7)c.typing=null;}
 if(g.s.phase==='lobby'){const addressed=(parsed.addressee?[g.player(parsed.addressee)]:(parsed.targets.length?parsed.targets:parsed.mentions.map(m=>m.id)).map(id=>g.player(id))).filter(p=>p?.bot&&p.alive===speaker.alive);if(human)queueReply(g,addressed[0]||g.pick(bots),message,parsed,9);return;}
 const addressed=parsed.targets.map(id=>g.player(id)).filter(p=>p?.bot&&p.alive===speaker.alive&&p!==speaker),relevant=bots.filter(p=>p.memory?.some(m=>m.who===(parsed.actor||parsed.targets[0])&&['kill','shift','clear','vent'].includes(m.type)));
 if(parsed.intent==='accuse'){
  for(const p of addressed.slice(0,1))queueReply(g,p,message,parsed,9);
  const witness=relevant.find(p=>!addressed.includes(p));if(witness)queueReply(g,witness,message,parsed,8,.7);else if(!addressed.length&&(human||(message.depth||0)<2))queueReply(g,g.pick(bots),message,parsed,6,.8);
 }else if(parsed.intent==='body-where'){
  const reporter=g.player(g.s.meeting?.reporter);if(reporter?.bot&&bots.includes(reporter))queueReply(g,reporter,message,parsed,10);
  else{const witness=bots.find(p=>p.memory?.some(m=>m.type==='body'&&m.who===g.s.meeting?.body));if(witness)queueReply(g,witness,message,parsed,8);}
 }else if(parsed.intent==='body-location'){
  const reporter=g.player(g.s.meeting?.reporter);if(speaker!==reporter&&reporter?.bot)queueReply(g,reporter,message,parsed,9);
  else{const nearby=bots.find(p=>p.memory?.some(m=>['kill','seen'].includes(m.type)&&m.room===parsed.room));if(nearby)queueReply(g,nearby,message,parsed,6);else if(human)queueReply(g,g.pick(bots),message,parsed,6);}
 }else if(parsed.intent==='evidence'){
  const claimant=g.player(c.focus?.claimant),witness=relevant.find(p=>p.memory?.some(m=>['kill','shift'].includes(m.type)&&m.who===(parsed.actor||parsed.targets[0])));
  queueReply(g,claimant?.bot&&bots.includes(claimant)?claimant:witness||g.pick(bots),message,parsed,9);
 }else if(parsed.intent==='defend'){
  const witness=bots.find(p=>p.memory?.some(m=>m.type==='kill'&&m.who===speaker.id));if(witness)queueReply(g,witness,message,parsed,9);else if(human)queueReply(g,g.pick(bots),message,parsed,6);
 }else if(parsed.intent==='alibi'){
  const witness=bots.find(p=>p.memory?.some(m=>m.type==='seen'&&m.who===speaker.id&&m.time>g.s.meeting.started-15));if(witness)queueReply(g,witness,message,parsed,human?9:5);else if(human)queueReply(g,g.pick(bots),message,parsed,6);
 }else if(['where','call','confirm'].includes(parsed.intent)){
  const candidates=addressed.length?addressed:bots;for(const p of candidates.slice(0,addressed.length?1:human?2:1))queueReply(g,p,message,parsed,human?9:5);
 }else if(['skip','clear','suspects','role-claim','sabotage','agree'].includes(parsed.intent)){
  const candidates=[...new Set([...relevant,...addressed,...bots.filter(p=>facts(g,p).witness),...bots])];if(human||relevant.length||parsed.intent==='skip')queueReply(g,candidates[0],message,parsed,human?9:5);
 }else if(human)queueReply(g,addressed[0]||g.pick(bots),message,parsed,7);
}
function alibi(g,p,entry){
 const a=p.meetingAlibi||{};if(isImp(p))p.alibiRoom??=p.routeHistory?.slice(0,-1).at(-1)?.room||p.lastRoom||a.room||g.roomAt(p);
 const room=roomName(p,ownAlibi(g,p)),seen=latest(p.memory,m=>m.type==='seen'&&m.room===ownAlibi(g,p)&&m.time>g.s.meeting.started-10&&g.player(m.who)?.alive);
 if(a.working)return g.pick(['i was doing '+(a.task||'tasks').toLowerCase()+' in '+room,'i was in '+room+' doing tasks']);
 if(entry?.parsed?.route&&p.routeHistory?.length>1)return 'i came from '+roomName(p,p.routeHistory.at(-2).room)+' then '+room;
 return 'i was in '+room+(seen?' saw '+label(g,p,seen.who,entry)+' there':'');
}
function evidence(g,p,target,entry){
 const id=target?.id,m=latest(p.memory,m=>(!id||m.who===id)&&['kill','death','shift','vent','clear'].includes(m.type)&&(!isImp(p)||!isImp(g.player(m.who))));
 if(m){const who=label(g,p,m.who,entry),room=roomName(p,m.room);
  if(m.type==='kill'||m.type==='death'){
   const told=p.evidenceTold?.[m.who]||0;
   if(entry?.parsed?.intent==='evidence')return 'i watched '+who+' kill '+label(g,p,m.victim,entry)+' in '+room+(m.uncertain?'. could be a shift tho':'');
   if(!m.uncertain&&told>=2)return 'vote '+who+'. if not '+who+' vote me';
   if(!m.uncertain&&told===1)return who+' killed '+label(g,p,m.victim,entry)+' in '+room+'. i was right there';
   return 'i saw '+who+' kill '+label(g,p,m.victim,entry)+' in '+room+(m.uncertain?'. could be a shift tho':'');
  }
  if(m.type==='shift')return who+' shifted '+(m.reverting?'back from ':'into ')+label(g,p,m.as,entry)+' in '+room+'. i saw the egg';
  if(m.type==='vent')return 'i saw '+who+' vent in '+room+'. could be engineer tho';
  return 'i saw '+who+' do '+(m.task||'a visual task').toLowerCase()+' in '+room;
 }
 const claim=latest(p.claims,c=>(!id||c.target===id)&&c.intent==='accuse');return claim?'i didnt see it. '+label(g,p,claim.speaker,entry)+' said '+label(g,p,claim.target,entry):'no proof from me, just asking';
}
function style(g,p,text){if(!text)return text;if(['bold','chatty'].includes(p.personality)&&g.random()<.12&&!/[😭💀]/u.test(text))text+=' '+g.pick(['😭','💀']);return text;}
export function makeReply(g,p,entry){
 const parsed=entry.parsed||{},low=parsed.low||'',speaker=g.player(entry.source?.player),f=facts(g,p),target=g.player(parsed.actor||parsed.targets?.[0]),m=g.s.meeting;let text;
 if(g.s.phase==='lobby'){
  text=/how|move|control/.test(low)?'WASD or arrows to walk. Laptop for settings; Wardrobe for cosmetics.':/hat|color|cosmetic/.test(low)?'wardrobe button, or the little crate with a hat':/role|viper|shape|engineer/.test(low)?'pick a practice role in settings, online is random':/map/.test(low)?g.map.name:/start/.test(low)?'ready when host is':/gg|threw|throw/.test(low)?g.pick(['gg','ggs 😭','one more?']):g.pick(['yo','ready','gl everyone','one sec choosing a hat']);
  return (speaker&&!speaker.bot?'@'+speaker.name+', ':'')+text;
 }
 if(parsed.intent==='call')return g.pick(['what','yeah?','??']);
 if(parsed.intent==='accuse'&&parsed.targets?.includes(p.id)){
  if(parsed.selfReport&&m?.reporter===p.id)text='i found '+label(g,p,m.body,entry)+' in '+roomName(p,m.room)+'. why would i self report';
  else if(parsed.vent&&p.role==='Engineer')text='im engineer, yes i vented. doesnt mean i killed';
  else if(parsed.kill)text=g.pick(["i didnt kill "+label(g,p,parsed.victim||m?.body,entry)+'. '+alibi(g,p,entry),"wasn't me. "+alibi(g,p,entry),'ITS NOT ME. '+alibi(g,p,entry)]);
  else if(parsed.fake)text='what task did i fake? '+alibi(g,p,entry);
  else text=g.pick(['how am i sus? '+alibi(g,p,entry),'bro what. '+alibi(g,p,entry),'what proof do u have on me']);
  if(p.denials>0&&parsed.kill)text=g.pick(['bro ur lying. '+alibi(g,p,entry),'u got the wrong person','why are u tunneling me']);
  if(isImp(p)&&parsed.kill&&speaker?.id===m.reporter&&g.random()<.35)text='wasnt me. '+alibi(g,p,entry)+'. '+label(g,p,speaker.id,entry)+' self report';
  if(f.clone)text="someone copied me. "+alibi(g,p,entry);
  p.denials=(p.denials||0)+1;
 }else if(parsed.intent==='body-where'){
  if(p.id===m?.reporter)text=roomName(p,m.room)+(m.body?' found '+label(g,p,m.body,entry):' emergency button');
  else{const seen=latest(p.memory,x=>x.type==='body'&&x.who===m?.body);text=seen?roomName(p,seen.room):'reporter, where?';}
 }else if(parsed.intent==='body-location'){
  if(p.id===m?.reporter&&parsed.room!==m.room)text='no, body was in '+roomName(p,m.room);
  else if(f.witness&&f.witness.room===parsed.room)text=evidence(g,p,g.player(f.witness.who),entry);
  else text='who was near '+roomName(p,parsed.room)+'?';
 }else if(parsed.intent==='confirm'){
  const seen=latest(p.memory,x=>x.type==='seen'&&x.who===parsed.confirmWho&&x.time>m.started-12),who=label(g,p,parsed.confirmWho,entry);
  text=seen?'yeah i saw '+who+' in '+roomName(p,seen.room)+', not the whole time tho':'cant vouch, i didnt see '+who;
 }else if(parsed.intent==='where')text=alibi(g,p,entry);
 else if(parsed.intent==='evidence')text=evidence(g,p,target,entry);
 else if(parsed.intent==='alibi'){
  const seen=latest(p.memory,x=>x.type==='seen'&&x.who===speaker?.id&&x.time>m.started-12);
  if(f.witness?.who===speaker?.id)text='that doesnt explain the kill. '+evidence(g,p,speaker,entry);
  else if(parsed.contradiction)text='u said '+roomName(p,parsed.contradiction)+' before, now '+roomName(p,parsed.room)+'? where at report';
  else if(seen&&parsed.room&&seen.room!==parsed.room&&seen.time>m.started-4)text='i just saw u in '+roomName(p,seen.room)+' before report tho';
  else if(seen&&(!parsed.room||seen.room===parsed.room))text='yeah i saw u in '+roomName(p,seen.room)+', not the whole time tho';
  else if(parsed.visual){const clear=latest(p.memory,x=>x.type==='clear'&&x.who===speaker?.id);text=clear?'yeah i saw the scan':'did anyone see the scan?';}
  else text=parsed.withPlayers?.length?label(g,p,parsed.withPlayers[0],entry)+' can u confirm?':'anyone see u there?';
 }else if(parsed.intent==='defend'){
  if(f.witness?.who===speaker?.id)text='yes i did. '+evidence(g,p,speaker,entry);
  else if(f.shift?.who===speaker?.id)text=evidence(g,p,speaker,entry);
  else text='ok, who can vouch for u?';
 }else if(parsed.intent==='accuse'){
  if(f.witness?.who===target?.id)text='yeah '+evidence(g,p,target,entry);
  else if(f.clear?.who===target?.id)text='nah i saw '+label(g,p,target.id,entry)+' do a visual. could be a shift';
  else if(f.witness?.who===speaker?.id)text='ur deflecting. '+evidence(g,p,speaker,entry);
  else if(parsed.bargain)text='ill remember that but whats the proof?';
  else text=parsed.kill?'did u see the kill or just them near body?':parsed.fake?'which task did they fake?':parsed.vent?'vent alone isnt proof, engineer exists':g.pick(['any proof?','why '+label(g,p,target?.id,entry)+'?','sus how?']);
 }else if(parsed.intent==='clear'){
  if(target?.id===p.id)text='yeah '+alibi(g,p,entry);
  else if(f.witness?.who===target?.id)text=(f.witness.uncertain?'could be a shift. ':'cant clear them. ')+evidence(g,p,target,entry);
  else if(f.clear?.who===target?.id)text='yeah '+evidence(g,p,target,entry);
  else text='hard clear or just with them?';
 }else if(parsed.intent==='skip')text=f.witness&&!f.witness.uncertain?'no skip. '+evidence(g,p,g.player(f.witness.who),entry):f.shift?evidence(g,p,g.player(f.shift.who),entry):g.s.players.filter(p=>p.alive).length===7?'yeah skip on 7, no hard proof':f.best?.score>5?'wait '+label(g,p,f.best.p.id,entry)+' still needs to answer':'skip, not enough proof';
 else if(parsed.intent==='suspects')text=f.witness?evidence(g,p,g.player(f.witness.who),entry):f.shift?evidence(g,p,g.player(f.shift.who),entry):f.best?.score>2?'maybe '+label(g,p,f.best.p.id,entry)+', want proof first':'idk, did anyone actually see it?';
 else if(parsed.intent==='role-claim')text=f.witness?.who===speaker?.id?'role doesnt explain this. '+evidence(g,p,speaker,entry):'ok venting alone isnt enough then';
 else if(parsed.intent==='sabotage')text='cant tell who pressed sabotage. where was everyone?';
 else if(parsed.intent==='agree')text=f.witness?evidence(g,p,g.player(f.witness.who),entry):'need more than trust me bro';
 else if(/throw|dumb|idiot|stupid/.test(low))text='bro chill, just give us the info';
 else text=g.pick(['what','who are u talking about?','what did u see?']);
 const address=speaker&&!speaker.bot&&['where','body-where'].includes(parsed.intent)?'@'+speaker.name+', ':'';return style(g,p,address+text);
}
export function openingStatement(g,p){
 const c=g.s.conversation,m=g.s.meeting,f=facts(g,p);p.spoken=true;
 if(p.id===m.reporter)return m.body?(f.witness?evidence(g,p,g.player(f.witness.who)):'body in '+roomName(p,m.room)+', '+label(g,p,m.body)+' dead'):'called button. '+(f.best?.score>4?label(g,p,f.best.p.id)+' sus':'any info?');
 if(f.witness){p.accused=f.witness.who;return evidence(g,p,g.player(f.witness.who));}
 if(f.clone)return 'someone copied '+label(g,p,f.clone.who)+'. could be a shapeshifter';
 if(f.shift){p.accused=f.shift.who;return evidence(g,p,g.player(f.shift.who));}
 if(m.body&&!c.publicBodyRoom&&!c.bodyQuestionAsked){c.bodyQuestionAsked=true;return g.pick(['where','where body','where?']);}
 if(f.clear&&!c.clearShared){c.clearShared=true;return evidence(g,p,g.player(f.clear.who));}
 if(c.focus&&!c.proofAsked){c.proofAsked=true;return 'any proof?';}
 if(!c.whoAsked){c.whoAsked=true;return g.pick(['who','any sus?']);}
 if(f.best?.score>3){p.accused=f.best.p.id;return label(g,p,f.best.p.id)+' sus. '+(g.player(c.focus?.claimant)?.name||'anyone')+' what did u see?';}
 if(!c.reviewed&&g.s.lastVerdict){c.reviewed=true;const v=g.s.lastVerdict;if(v.impostor===true)return v.accusers?.includes(p.id)?'told yall 💀':'nice we got '+label(g,p,v.target);if(v.impostor===false)return (v.accusers?.includes(p.id)?'my bad, we threw on ':'yall threw on ')+label(g,p,v.target)+' 😭';}
 if(c.volunteers<2&&['chatty','bold'].includes(p.personality)){c.volunteers++;return alibi(g,p);}
 return null;
}
export function chooseBotVote(g,p){
 const f=facts(g,p);if(isImp(p)){const counts={};for(const claim of p.claims||[])if(claim.intent==='accuse'&&g.player(claim.target)?.alive&&!isImp(g.player(claim.target)))counts[claim.target]=(counts[claim.target]||0)+1;const accused=g.player(p.accused);return Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0]||(accused?.alive&&!isImp(accused)?accused.id:'skip');}
 if(f.shift)return f.shift.who;if(f.witness&&!f.witness.uncertain)return f.witness.who;
 const best=f.ranking.find(r=>!p.memory?.some(m=>m.type==='clear'&&m.who===r.p.id)),living=g.s.players.filter(p=>p.alive).length;return best&&best.score>(living<=4?1.5:3.5)?best.p.id:'skip';
}
export function splitUtterance(text){const parts=[];let rest=String(text).trim();while(rest){if(rest.length<=100){parts.push(rest);break;}let cut=rest.lastIndexOf('. ',100);if(cut<35)cut=rest.lastIndexOf(' ',100);if(cut<1)cut=100;else if(rest[cut]==='.')cut++;parts.push(rest.slice(0,cut).trim());rest=rest.slice(cut).trim();}return parts;}
export function tickConversation(g,dt){
 const c=g.s.conversation,m=g.s.meeting;if(!c)return;if(g.s.phase==='meeting'&&['result','eject'].includes(m?.stage)){c.queue=[];c.typing=null;return;}
 if(c.typing){if(g.s.time<c.typing.until)return;const t=c.typing,p=g.player(t.player);c.typing=null;if(!p||!p.alive&&!t.allowDead)return;
  if(t.root){c.replied[t.root+':'+p.id]=(c.replied[t.root+':'+p.id]||0)+1;c.totals[t.root]=(c.totals[t.root]||0)+1;}
  const msg=g.say(p,t.text,'all',{replyTo:t.replyTo||null,root:t.root||null,depth:t.depth||0});p.lastSaid=t.text;p.chatRecent=[...(p.chatRecent||[]),normalize(t.text)].slice(-8);c.lastSpeech=g.s.time;c.nextSpeech=g.s.time+g.rand(.45,1.05);p.spoken=true;
  hearMessage(g,p,t.text,msg);if(t.rest?.length)c.queue.unshift({...t,typing:undefined,text:undefined,scriptedText:t.rest[0],rest:t.rest.slice(1),replyTo:msg.id,due:g.s.time+.2});return;
 }
 if(g.s.time<c.nextSpeech)return;
 const index=c.queue.findIndex(q=>q.due<=g.s.time&&(g.player(q.player)?.alive||q.allowDead));let entry=index>=0?c.queue.splice(index,1)[0]:null,p=entry?g.player(entry.player):null,text;
 if(entry)text=entry.scriptedText||makeReply(g,p,entry);
 else if(g.s.phase==='meeting'&&m?.timer>5){const candidates=g.s.players.filter(p=>p.bot&&p.alive&&!p.spoken);p=candidates.find(p=>p.id===m.reporter)||candidates.find(p=>facts(g,p).witness)||g.pick(candidates);if(!p)return;text=openingStatement(g,p);entry={opening:true,priority:1};}
 else if(g.s.phase==='lobby'&&c.lobbyBanter<2&&g.s.time-c.lastSpeech>3){p=g.pick(g.s.players.filter(p=>p.bot&&p.personality!=='quiet'));c.lobbyBanter++;text=g.s.lastWinnerTeam?g.pick(['gg','ggs','one more?','we threw 😭']):g.pick(['yo','ready','gl everyone']);entry={opening:true,priority:0};}
 if(!p||!text)return;if(p.chatRecent?.includes(normalize(text))&&!(entry.priority>=8&&entry.source&&!g.player(entry.source.player)?.bot))return;
 const beats=splitUtterance(text);c.typing={...entry,player:p.id,text:beats[0],rest:entry.rest||beats.slice(1,3),until:g.s.time+Math.min(1.65,.2+beats[0].length/(p.personality==='chatty'?110:80))};
}
