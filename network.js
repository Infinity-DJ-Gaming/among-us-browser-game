export class Room {
 constructor(game,onState,onStatus){this.game=game;this.onState=onState;this.onStatus=onStatus;this.mode='solo';this.id='you';this.code='';this.peer=null;this.connections=new Map();this.banned=new Set();this.last=0;}
 close(){this.peer?.destroy();this.peer=null;this.connections.clear();this.mode='solo';this.id='you';this.code='';}
 host(){
  this.close();if(!globalThis.Peer){this.onStatus('The online library did not load. Bot matches are still available.');return;}
  this.mode='host';this.code=Array.from(crypto.getRandomValues(new Uint8Array(6)),x=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[x%32]).join('');
  this.onStatus('Opening room…');this.peer=new Peer('among-web-'+this.code);
  this.peer.on('open',()=>this.onStatus('Room open. Share the code with your friends.'));
  this.peer.on('connection',conn=>{
   let humanId=null;
   conn.on('data',data=>{
    if(!data||typeof data!=='object')return;
    if(data.type==='hello'&&!humanId){
     if(this.banned.has(conn.peer)){conn.send({type:'error',text:'You were banned from this room.'});conn.close();return;}
     if(this.game.s.phase!=='lobby'||this.connections.size>=this.game.settings.players-1){conn.send({type:'error',text:'This room is full or the match has already started.'});conn.close();return;}
     humanId='human-'+conn.peer;this.connections.set(humanId,conn);const positions=new Map(this.game.s.players.filter(p=>!p.bot).map(p=>[p.id,{x:p.x,y:p.y}]));this.game.addHuman(humanId,data.name,data.color,data.cosmetics);this.game.lobby();for(const [id,pos]of positions)Object.assign(this.game.player(id),pos);this.game.say(null,`${this.game.player(humanId).name} joined the room.`);conn.send({type:'welcome',id:humanId,code:this.code});this.broadcast();
    }else if(data.type==='action'&&humanId){this.game.action(humanId,data.action,data.data||{});}
   });
   conn.on('close',()=>{if(!humanId)return;this.connections.delete(humanId);let p=this.game.player(humanId);if(p){if(this.game.s.phase==='lobby'){this.game.s.players=this.game.s.players.filter(p=>p.id!==humanId);this.game.fillBots();this.game.lobby();}else{p.bot=true;p.input={x:0,y:0};p.think=0;p.wait=1;p.memory=[];p.suspicion={};p.goal=null;}}this.game.say(null,`${p?.name||'A player'} disconnected. A bot has taken over.`);});
  });this.peer.on('error',e=>this.onStatus('Room connection: '+e.type+'. You can still play with bots.'));
 }
 join(code,name,color,cosmetics){
  this.close();this.mode='client';this.code=code.toUpperCase().replace(/[^A-Z2-9]/g,'');this.onStatus('Connecting to room…');
  if(!globalThis.Peer){this.onStatus('Online library unavailable.');this.mode='solo';return;}
  this.peer=new Peer();let welcomed=false;
  this.peer.on('open',()=>{let conn=this.peer.connect('among-web-'+this.code,{reliable:true});this.server=conn;
   conn.on('open',()=>conn.send({type:'hello',name,color,cosmetics}));
   conn.on('data',data=>{if(data.type==='welcome'){welcomed=true;this.id=data.id;this.onStatus('Connected to '+this.code);}if(data.type==='state')this.onState(data.state);if(data.type==='error'){this.onStatus(data.text);this.close();}});
   conn.on('close',()=>{if(this.mode==='client'){this.onStatus('The host disconnected. Return to the menu to play another match.');this.onState(null);}});
  });this.peer.on('error',e=>this.onStatus('Could not connect ('+e.type+'). Check the code and that the host is still in the lobby.'));
  setTimeout(()=>{if(this.mode==='client'&&!welcomed)this.onStatus('Still connecting. Some networks block peer-to-peer connections; try another network or play with bots.');},12000);
 }
 action(action,data={}){if(this.mode==='client'){if(this.server?.open)this.server.send({type:'action',action,data});return;}return this.game.action(this.id,action,data);}
 kick(id,ban=false){if(this.mode!=='host')return false;const conn=this.connections.get(id);if(!conn)return false;if(ban)this.banned.add(conn.peer);conn.send({type:'error',text:ban?'The host banned you from this room.':'The host kicked you from this room.'});conn.close();return true;}
 broadcast(){if(this.mode!=='host')return;for(const [id,conn] of this.connections)if(conn.open)conn.send({type:'state',state:this.game.snapshot(id)});}
}
