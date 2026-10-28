import {LOBBY_QUICK_CHAT,MEETING_QUICK_CHAT} from './lobby.js?v=3.4.0';

// Shared native chat presentation for the dropship and the larger meeting overlay.
export function createNativeChat({root,prefix,getState,getRoom,drawCrew,colors,escape,sound,modal,closeModal,mutedPlayers=new Set()}){
 const input=root.querySelector('input'),form=root.querySelector('form'),send=form.querySelector('button');
 const messages=root.querySelector('.messages'),header=root.querySelector('.chat-top,.discussion-title');
 const living=header.querySelector('#living-count');let lastChat='',quickOpen=false;
 root.classList.add('native-chat');header.className='native-chat-header';
 header.innerHTML='<button class="native-chat-close" id="'+prefix+'-chat-close" aria-label="Close '+prefix+' chat"><img src="assets-ui-close.png" alt=""></button>';
 if(living){living.classList.add('sr-only');header.append(living);}header.querySelector('button').onclick=()=>root.classList.add('hidden');
 input.classList.add('native-chat-input');input.maxLength=100;input.placeholder='';form.classList.add('native-chat-form');
 send.innerHTML='<img src="assets-chat-send.png" alt=""> Send';send.setAttribute('aria-label','Send '+prefix+' message');messages.classList.add('native-chat-messages');
 root.querySelector('.quick-chat')?.remove();
 const quick=root.querySelector('#'+prefix+'-quick-chat')||document.createElement('div');quick.id=prefix+'-quick-chat';quick.className='native-chat-quick hidden';
 quick.innerHTML=(prefix==='meeting'?MEETING_QUICK_CHAT:LOBBY_QUICK_CHAT).map(t=>'<button data-native-quick="'+escape(t)+'">'+escape(t)+'</button>').join('');root.append(quick);
 quick.querySelectorAll('button').forEach(b=>b.onclick=()=>{getRoom().action('chat',{text:b.dataset.nativeQuick});sound('click',.3);});
 const counter=document.createElement('output');counter.className='native-chat-counter';counter.setAttribute('aria-label','Message character count');root.append(counter);
 const tools=document.createElement('div');tools.className='native-chat-tools';
 tools.innerHTML='<button aria-label="Player controls"><img src="assets-chat-players.png" alt=""></button><button aria-label="Free chat keyboard"><img src="assets-chat-keyboard.png" alt=""></button><button aria-label="Quick Chat choices"><img src="assets-chat-wheel.png" alt=""></button>';root.append(tools);
 const [players,keyboard,wheel]=tools.querySelectorAll('button');
 wheel.onclick=()=>{quickOpen=!quickOpen;sound('click',.3);update();};
 keyboard.onclick=()=>{if(getState().settings.chatType==='Quick Chat')return;quickOpen=false;update();input.focus();sound('click',.3);};players.onclick=playerControls;
 function playerControls(){
  const s=getState(),room=getRoom();
  modal('<h2>Player controls</h2><div class="chat-player-controls">'+s.players.filter(p=>p.id!==room.id).map(p=>'<div><span>'+escape(p.name)+'</span><button data-chat-mute="'+escape(p.id)+'">'+(mutedPlayers.has(p.id)?'Unmute':'Mute')+'</button>'+(room.mode==='host'&&!p.bot?'<button data-chat-kick="'+escape(p.id)+'">Kick</button><button data-chat-ban="'+escape(p.id)+'">Ban</button>':'')+'</div>').join('')+'</div>','chat-players');
  document.querySelectorAll('[data-chat-mute]').forEach(b=>b.onclick=()=>{const id=b.dataset.chatMute;mutedPlayers.has(id)?mutedPlayers.delete(id):mutedPlayers.add(id);lastChat='';playerControls();});
  for(const [attr,ban]of [['kick',false],['ban',true]])document.querySelectorAll('[data-chat-'+attr+']').forEach(b=>b.onclick=()=>{room.kick(b.dataset[ban?'chatBan':'chatKick'],ban);closeModal();});
 }
 function update(){
  const s=getState();if(!s)return;const quickOnly=s.settings.chatType==='Quick Chat';
  form.classList.toggle('hidden',quickOnly||quickOpen);quick.classList.toggle('hidden',!quickOnly&&!quickOpen);keyboard.disabled=quickOnly;
  send.disabled=!input.value.trim();counter.textContent=input.value.length+'/100';counter.classList.toggle('hidden',quickOnly||quickOpen);
  if(root.classList.contains('hidden'))return;
  const typing=s.conversation?.typing,rows=s.chat.filter(c=>!mutedPlayers.has(c.player));
  const signature=rows.map(c=>c.id+':'+c.text+':'+c.dead).join(',')+'-'+(typing?.player||'');if(signature===lastChat)return;
  const bottom=messages.scrollHeight-messages.scrollTop-messages.clientHeight<90||!lastChat;lastChat=signature;
  messages.innerHTML=rows.map(c=>{
   if(!c.player)return '<div class="system-message">'+escape(c.text)+'</div>';
   const reply=rows.find(r=>r.id===c.replyTo);
   return '<article class="native-chat-message '+(c.dead?'native-chat-ghost':'')+'" data-message="'+c.id+'"><canvas width="128" height="112" aria-label="'+escape(colors[c.color]+' crewmate portrait')+'"></canvas><div><strong>'+escape(c.name)+(c.dead?' (ghost)':'')+'</strong>'+(reply?'<small class="native-chat-reply">↳ '+escape(reply.name)+': '+escape(reply.text.slice(0,60))+'</small>':'')+'<p>'+escape(c.text)+'</p></div></article>';
  }).join('')+(typing&&!mutedPlayers.has(typing.player)?'<div class="typing-message">'+escape(s.players.find(p=>p.id===typing.player)?.name||'Someone')+' is typing…</div>':'');
  messages.querySelectorAll('[data-message]').forEach(row=>{
   const msg=rows.find(r=>r.id===+row.dataset.message),actor=s.players.find(p=>p.id===msg.player),canvas=row.querySelector('canvas');
   drawCrew(canvas.getContext('2d'),{...actor,id:'chat-'+msg.player,color:msg.color,displayColor:msg.color,face:1,moving:false,alive:true,phantom:0,cosmetics:msg.cosmetics||actor?.cosmetics||{}},64,134,1,!!msg.dead,0);
  });if(bottom)messages.scrollTop=messages.scrollHeight;
 }
 input.addEventListener('input',update);form.addEventListener('submit',()=>queueMicrotask(update));
 return {update,mutedPlayers};
}
