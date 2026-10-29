const LOBBY_FILES={ladderDown:"assets-sfx-ladderDown.wav",ladderUp:"assets-sfx-ladderUp.wav",platformMove:"assets-sfx-platformMove.wav",lobbySpawn:'assets-lobby-spawn.ogg',lobbyLeave:'assets-lobby-leave.ogg',lobbyOptions:'assets-lobby-options.wav',lobbyTimeout:'assets-lobby-timeout.wav',lobbyCopy:'assets-lobby-copy.wav'};
const ALIASES={medScan:'scan',phantom:'phantomIn',click:'button',complete:'taskComplete',roundstart:'roundStart',vent:'ventOpen',kill:'killKnife',alarm:'alarmCritical',chat:'notification',tab:'button',select:'button',cosmeticEquip:'button',shopOpen:'panelOpen',purchase:'stardustPurchase',deny:'notificationError',cubeActivate:'button',equip:'button',roleGuardianAngel:'roleCrewmate',roleInfluencer:'roleCrewmate'};
// World distances use the same pixel coordinates as player/map positions.
export function spatialVolume(source,listener,{maxDistance=900,referenceDistance=140,occluded=false,occlusion=.35,requireLineOfSight=false}={}){
 if(!source||!listener||![source.x,source.y,listener.x,listener.y].every(Number.isFinite))return 0;
 const distance=Math.hypot(source.x-listener.x,source.y-listener.y);if(distance>=maxDistance||requireLineOfSight&&occluded)return 0;
 const ramp=Math.max(0,Math.min(1,(distance-referenceDistance)/Math.max(1,maxDistance-referenceDistance)));
 return (1-ramp)**2*(occluded?Math.max(0,Math.min(1,occlusion)):1);
}
export class SoundBank {
 constructor(enabled=()=>true){this.enabled=enabled;this.context=null;this.buffer=null;this.meta=null;this.extra=null;this.bytes=null;this.external={};this.steps={};this.bankBytes={};this.bankBuffers={};this.bankPromises={};this.active=new Set();this.loops=new Map();this.loading=this.prepare();}
 get volume(){return this._volume??1;}
 set volume(value){this._volume=Math.max(0,Math.min(1,Number(value)||0));for(const stop of this.active||[])stop.refresh?.();}
 get musicVolume(){return this._musicVolume??1;}
 set musicVolume(value){this._musicVolume=Math.max(0,Math.min(1,Number(value)||0));for(const stop of this.active||[])stop.refresh?.();}
 async prepare(){
  const base=async()=>{try{const [meta,bytes]=await Promise.all([fetch('assets-sfx.json').then(r=>r.json()),fetch('assets-sfx.wav').then(r=>r.arrayBuffer())]);this.meta=meta;this.bytes=bytes;if(this.context)await this.decode();}catch(e){console.warn('Original SFX pack unavailable',e.message);}};
  const extra=async()=>{try{this.extra=await fetch('assets-audio-v4.json?v=3.6.0').then(r=>r.json());this.bankBytes.actions=await fetch(this.extra.banks.actions.file).then(r=>r.arrayBuffer());if(this.context)await this.getBank('actions');}catch(e){console.warn('Expanded original audio pack unavailable',e.message);}};
  await Promise.all([base(),extra()]);
 }
 async decode(){if(!this.context||!this.bytes)return;if(this.decodePromise)return this.decodePromise;
  this.decodePromise=(async()=>{this.buffer??=await this.context.decodeAudioData(this.bytes.slice(0));const files={...this.meta.external,...Object.fromEntries(Object.entries(LOBBY_FILES).map(([k,file])=>[k,{file}])),acidKill1:{file:'assets-sfx-acid1.ogg'},acidKill2:{file:'assets-sfx-acid2.ogg'}};
   await Promise.all(Object.entries(files).map(async([key,v])=>{try{if(!this.external[key])this.external[key]=await this.context.decodeAudioData(await fetch(v.file).then(r=>r.arrayBuffer()));}catch{}}));
  })().catch(e=>{this.decodePromise=null;console.warn('Original audio decode failed',e.message);});return this.decodePromise;
 }
 async getBank(bank){if(this.bankBuffers[bank])return this.bankBuffers[bank];if(!this.context||!this.extra?.banks[bank])return null;if(this.bankPromises[bank])return this.bankPromises[bank];
  this.bankPromises[bank]=(async()=>{const bytes=this.bankBytes[bank]||await fetch(this.extra.banks[bank].file).then(r=>r.arrayBuffer());const decoded=await this.context.decodeAudioData(bytes.slice(0));this.bankBuffers[bank]=decoded;delete this.bankBytes[bank];return decoded;})().catch(e=>{delete this.bankPromises[bank];console.warn('Audio bank unavailable: '+bank,e.message);return null;});return this.bankPromises[bank];
 }
 unlock(){if(!this.context){const AC=globalThis.AudioContext||globalThis.webkitAudioContext;if(AC)this.context=new AC();}this.context?.resume().catch(()=>{});this.decode().catch(()=>{});this.getBank('actions').catch(()=>{});}
 has(key){key=ALIASES[key]||key;return !!(this.meta?.clips[key]||this.extra?.clips[key]||this.meta?.external[key]||['acidKill1','acidKill2'].includes(key)||LOBBY_FILES[key]);}
 play(key,volume=.6,options={}){
  if(!this.enabled()||!this.context)return null;key=ALIASES[key]||key;const expanded=LOBBY_FILES[key]?null:this.extra?.clips[key],external=this.external[key],clip=expanded||(LOBBY_FILES[key]?{start:0,duration:external?.duration||3600}:external?{start:0,duration:external.duration}:this.meta?.clips[key]);if(!clip)return null;
  let stopped=false,source=null,gain=null,panner=null;const stop=()=>{if(stopped)return;stopped=true;this.active.delete(stop);try{source?.stop();source?.disconnect();gain?.disconnect();panner?.disconnect();}catch{}};this.active.add(stop);
  const begin=buffer=>{if(stopped||!buffer||!this.enabled()){stop();return;}source=this.context.createBufferSource();gain=this.context.createGain();source.buffer=buffer;
   stop.refresh=()=>{gain.gain.value=Math.max(0,volume)*(options.bus==='music'?this.musicVolume:this.volume);};stop.refresh();source.connect(gain);
   if(Number.isFinite(options.pan)&&this.context.createStereoPanner){panner=this.context.createStereoPanner();panner.pan.value=Math.max(-1,Math.min(1,options.pan));gain.connect(panner).connect(this.context.destination);}else gain.connect(this.context.destination);
   source.onended=()=>{if(!options.loop)stop();};const start=Math.max(0,clip.start),duration=Math.min(clip.duration,buffer.duration-start);if(duration<=0){stop();return;}
   if(options.loop){source.loop=true;source.loopStart=start;source.loopEnd=start+duration;source.start(0,start);}else source.start(0,start,duration);
  };
  const buffer=expanded?this.bankBuffers[expanded.bank]:LOBBY_FILES[key]?external:external||this.buffer;if(buffer)begin(buffer);else if(expanded)this.getBank(expanded.bank).then(begin);else this.decode().then(()=>begin(LOBBY_FILES[key]?this.external[key]:this.external[key]||this.buffer));return stop;
 }
 playAt(key,source,listener,options={}){
  const {volume=.6,line,...settings}=options;let occluded=!!settings.occluded;if(typeof line==='function')occluded=!line(listener,source);const attenuation=spatialVolume(source,listener,{...settings,occluded});if(attenuation<=0)return null;
  const pan=settings.pan===false?0:Math.max(-1,Math.min(1,(source.x-listener.x)/(settings.maxDistance||900)*1.3));return this.play(key,volume*attenuation,{...settings,pan});
 }
 setLoop(channel,key,volume=.2,options={}){const previous=this.loops.get(channel);if(previous?.key===key&&previous.volume===volume&&previous.bus===options.bus)return;previous?.stop();this.loops.delete(channel);if(!key||!this.enabled())return;if(key==='lobbyMusic'&&channel==='music'||key==='lobbyAtmosphere'&&channel==='atmosphere'){const el=new Audio(key==='lobbyMusic'?'assets-lobby-music.mp3':'assets-lobby-atmosphere.ogg');el.dataset.gameAudio=key;document.body.append(el);el.loop=true;const stop=()=>{el.pause();el.removeAttribute('src');el.load();el.remove();this.active.delete(stop);};stop.refresh=()=>{el.volume=Math.max(0,Math.min(1,volume*(options.bus==='music'?this.musicVolume:this.volume)));};stop.refresh();this.active.add(stop);el.play().catch(()=>{});this.loops.set(channel,{key,volume,bus:options.bus,stop});return;}const stop=this.play(key,volume,{...options,loop:true});if(stop)this.loops.set(channel,{key,volume,bus:options.bus,stop});}
 setMusic(scene,volume=.35){const key=scene==='menu'?'menuMusic':scene==='lobby'?'lobbyMusic':null;this.setLoop('music',key,volume,{bus:'music'});}
 setAmbience(map,room,volume=.15){const polus=String(map).toLowerCase()==='polus';let key;
  if(polus)key=({'Boiler Room':'ambPolusBoiler',Communications:'ambPolusComms',Decontamination:'ambPolusDecontam',Electrical:'ambPolusElectrical',Laboratory:'ambPolusLab',MedBay:'ambPolusLab',O2:'ambPolusO2',Security:'ambSecurity','Specimen Room':'ambPolusSpecimen',Dropship:'ambPolusOutside',Outside:'ambPolusOutside','Seismic Stabilizers':'ambPolusSeismic'})[room]||'ambPolusOutside';
  else key=({Electrical:'ambSkeldElectrical','Upper Engine':'ambSkeldEngine','Lower Engine':'ambSkeldEngine',O2:'ambSkeldO2',Reactor:'ambSkeldReactor',Shields:'ambSkeldShields',Communications:'ambSkeldComms',MedBay:'ambMedBay',Security:'ambSecurity',Weapons:'ambWeapons'})[room]||'ambSkeldHallway';
  this.setLoop('ambience',key,volume);
 }
 stopScene(){for(const {stop}of this.loops.values())stop();this.loops.clear();}
 stopAll(){this.stopScene();for(const stop of [...this.active])stop();}
 footstep(room,volume=.2,options={}){let material=options.material;
  if(!material){const polus=String(options.map).toLowerCase()==='polus';material=polus?(room==='Outside'?'snow':['O2','Boiler Room','Storage','Electrical','Dropship'].includes(room)?'metal':['Office','Admin','Specimen Room','Decontamination','Laboratory','MedBay'].includes(room)?'tile':'plastic'):room==='Cafeteria'?'tile':['Admin','MedBay','Communications'].includes(room)?'plastic':room==='Navigation'?'glass':'metal';}
  const count={metal:8,plastic:5,sand:6}[material]||7;this.steps[material]=(this.steps[material]||0)%count+1;const key='step'+material+this.steps[material];return options.source&&options.listener?this.playAt(key,options.source,options.listener,{...options,volume}):this.play(key,volume);
 }
}
