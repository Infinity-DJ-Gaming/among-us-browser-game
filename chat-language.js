const COLORS=['red','blue','green','pink','orange','yellow','black','white','purple','brown','cyan','lime','maroon','rose','banana','gray','tan','coral'];
export const normalize=t=>String(t).toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9?@\s]/g,' ').replace(/\s+/g,' ').trim();
const escaped=t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const ROOMS=[['Upper Engine',['upper engine','upper','ue']],['Lower Engine',['lower engine','lower','le']],['Specimen Room',['specimen room','specimen','spec','speci']],['Boiler Room',['boiler room','boiler']],['Decontamination',['decontamination','decon']],['Cafeteria',['cafeteria','cafe','caf']],['Weapons',['weapons','weps']],['O2',['o2','oxygen','oxy']],['Navigation',['navigation','navi','nav']],['Shields',['shields']],['Communications',['communications','comms','comm']],['Storage',['storage']],['Admin',['admin']],['Electrical',['electrical','elec']],['MedBay',['medbay','med bay','med']],['Security',['security','cameras','cams']],['Reactor',['reactor']],['Dropship',['dropship','drop ship']],['Office',['office']],['Laboratory',['laboratory','labs','lab']],['Outside',['outside']]];
export function roomMention(text){const low=normalize(text);for(const [room,aliases]of ROOMS)for(const alias of aliases)if(new RegExp('\\b'+escaped(alias)+'\\b').test(low))return room;return null;}
export function playerMentions(g,text){
 const low=normalize(text),matches=[];
 for(const p of g.s.players){const aliases=[[normalize(p.name),'name'],[COLORS[p.color],'color']];if(p.color===15)aliases.push(['grey','color']);
  for(const [alias,kind]of aliases){if(!alias)continue;const re=new RegExp('(^|[^a-z0-9])('+escaped(alias)+')(?=$|[^a-z0-9])','g');for(const m of low.matchAll(re)){const at=m.index+m[1].length;matches.push({id:p.id,kind,alias,at,end:at+alias.length});}}
 }
 // Longer duplicate-name aliases win over their shorter prefix (Player / Player 1).
 matches.sort((a,b)=>a.at-b.at||b.end-a.end);const result=[];for(const m of matches)if(!result.some(r=>m.at<r.end&&m.end>r.at))result.push(m);return result;
}
export function parseMessage(g,speaker,text){
 const low=normalize(text),mentions=playerMentions(g,text),c=g.s.conversation||{},focus=c.focus||{},room=roomMention(low);
 const first=mentions[0],direct=first&&first.at<2&&(/^(?:@)/.test(low)||/^(?:where|who|why|what|were|was|did|are|can|u |you |how|i |any|proof)/.test(low.slice(first.end).trim()))?first.id:null;
 const killMatch=/\b(kill(?:ed|ing|s)?|murder(?:ed)?|stabbed)\b/.exec(low),ventMatch=/\b(vent(?:ed|ing)?|venting)\b/.exec(low);
 const fake=/\b(fake[ds]?|faking)\b/.test(low)&&/\b(task|tasks|scan|scanning|wires|asteroids)\b/.test(low);
 const selfReport=/\bself ?report(?:ed|ing)?\b/.test(low),vote=/\b(vote|voting|voted|eject)\b/.test(low),visual=/\b(scan(?:ned|ning)?|visual|medscan)\b/.test(low);
 const denial=/\b(not me|wasnt me|was not me|its not me|im not|i didnt|i did not|i never|no i didnt|never killed|framed|frame me|no you didnt|no u didnt)\b/.test(low);
 const negatedKill=!!killMatch&&/\b(didnt|did not|never|not|wasnt)\b[^.!?]{0,18}$/.test(low.slice(0,killMatch.index));
 const negatedSeeing=/\b(didnt|did not|never|cant|cannot)\s+(?:actually\s+)?see\b/.test(low);
 const reportedSpeech=/\b(said|says|told|heard|according)\b/.test(low),witnessClaim=/\b(i|we)\s+(?:(?:literally|actually|just)\s+)*(saw|seen|watched)\b/.test(low)&&!negatedSeeing&&!reportedSpeech;
 const question=low.includes('?')||/^(where|who|why|how|any proof|any evidence|did |can |was |were )/.test(low);
 const pronounYou=direct||((focus.claimant===speaker.id||focus.suspect!==speaker.id)?focus.suspect:focus.claimant)||[...g.s.chat].reverse().find(m=>m.player&&m.player!==speaker.id)?.player;
 let actor=null,victim=null;
 if(killMatch||ventMatch){const event=killMatch||ventMatch,pre=low.slice(0,event.index),post=low.slice(event.index+event[0].length),before=mentions.filter(m=>m.end<=event.index),after=mentions.filter(m=>m.at>=event.index+event[0].length);
  const passive=killMatch&&/\b(?:was|got|been)\s+(?:just\s+)?$/.test(pre)&&/\bby\b/.test(post);
  if(passive){const by=low.indexOf('by',event.index+event[0].length);actor=after.find(m=>m.at>by)?.id||null;victim=before.at(-1)?.id||null;}
  else{actor=before.at(-1)?.id||null;
   if(/\b(i|im)\s+(?:(?:literally|actually|just|didnt|did not|never)\s+)*$/.test(pre)||/\bi (?:didnt|did not|never)\s*$/.test(pre))actor=speaker.id;
   if(/\b(u|you)\s+(?:(?:literally|actually|just|didnt|did not|never)\s+)*$/.test(pre))actor=pronounYou||null;
   if(/\b(who|someone|somebody)\s+(?:(?:just|actually)\s+)*$/.test(pre))actor=null;
   if(killMatch)victim=after.find(m=>m.id!==actor)?.id||(/^\s*me\b/.test(post)?speaker.id:null);
  }
 }
 if(selfReport)actor=mentions.find(m=>m.id!==direct)?.id||(/\bi\b/.test(low)?speaker.id:g.s.meeting?.reporter)||null;
 const sus=/\b(sus|suspicious|impost[oe]r|lying|liar|deflecting|teaming|faked|faking)\b/.test(low);
 if(!actor&&(fake||sus||vote)&&mentions.length)actor=mentions.find(m=>m.id!==direct)?.id||direct;
 if(!actor&&/\b(he|she|they|him|her|them)\b/.test(low)&&(killMatch||sus||vote))actor=focus.suspect||null;
 // "not red, its yellow" is a correction, not an accusation of both players.
 const correction=mentions.length>1&&/\bnot\s+/.test(low)&&/\b(its|is|it is)\b/.test(low);if(correction)actor=mentions.at(-1).id;
 const withPlayers=/\bwith\b/.test(low)?mentions.filter(m=>m.id!==speaker.id).map(m=>m.id):[];
 const bodyQuestion=/\b(where|location)\b/.test(low)&&(/\bbody|dead|report\b/.test(low)||!mentions.length&&!/\b(were|was everyone|you|u|route|alibi)\b/.test(low))&&!!g.s.meeting?.body;
 const personalWhere=/\b(where|route|alibi|were you|was everyone)\b/.test(low)&&!bodyQuestion;
 const taskAlibi=/\b(i|im|was|doing|did|finished)\b/.test(low)&&(/\b(task|tasks|wires|download|card|asteroids|scanned|scan|scanning)\b/.test(low)||!!room||withPlayers.length>0);
 const roleClaim=/\b(?:im|i am)\s+(engineer|engi|eng|scientist|tracker|detective|judge)\b/.exec(low)?.[1]||null;
 const clear=/\b(clear|safe|innocent|scanned|scan|visual)\b/.test(low)&&!fake&&!/\b(clear asteroids|clean o2)\b/.test(low);
 const accusation=!!actor&&(!!killMatch||!!ventMatch||sus||fake||selfReport||vote||correction)&&!negatedKill&&!negatedSeeing&&!denial;
 let intent='other';
 if(g.s.phase==='lobby'&&/\b(hi|hey|hello|yo|sup|gl|ready|start|gg|good luck|ez)\b/.test(low))intent='greeting';
 else if(bodyQuestion)intent='body-where';
 else if(personalWhere)intent='where';
 else if(/\b(lights|comms|reactor|oxygen|seismic|sabotage)\b/.test(low)&&/^who\b/.test(low))intent='sabotage';
 else if(/^\s*who\b/.test(low)&&!actor)intent='suspects';
 else if(/\b(why would i|why would you)\b/.test(low)&&selfReport||denial||negatedKill)intent='defend';
 else if(/\b(skip|no evidence|not enough|dont vote|do not vote)\b/.test(low)&&!/\b(dont|do not|no|not) skip\b/.test(low))intent='skip';
 else if(/\b(any proof|proof|evidence|zero proof|did you see|did u see|how do|how did|sure)\b/.test(low)||question&&(killMatch||ventMatch))intent='evidence';
 
 else if(/\b(confirm|vouch)\b/.test(low)&&question)intent='confirm';
 else if(roleClaim)intent='role-claim';
 else if(accusation)intent='accuse';
 else if(witnessClaim&&!killMatch&&!ventMatch&&!visual)intent='sighting';
 else if(taskAlibi)intent='alibi';
 else if(clear)intent='clear';
 else if(room&&mentions.length===0)intent=c.lastQuestion?.kind==='where'?'alibi':speaker.id===g.s.meeting?.reporter||c.lastQuestion?.kind==='body-where'?'body-location':'alibi';
 else if(/\b(who|anyone|suspect|any sus)\b/.test(low))intent='suspects';
 else if(/\b(lights|comms|reactor|oxygen|seismic|sabotage)\b/.test(low))intent='sabotage';
 else if(/\b(yes|agree|true|right|ok|okay|trust)\b/.test(low))intent='agree';
 else if(mentions.length&&low.replace(new RegExp('^@?'+escaped(mentions[0].alias)),'').trim().length<3)intent='call';
 const targets=intent==='accuse'?[actor]:intent==='clear'?[mentions.find(m=>m.id!==direct)?.id||direct||speaker.id]:intent==='defend'?[actor||speaker.id]:['where','call','confirm'].includes(intent)?[direct||mentions[0]?.id].filter(Boolean):intent==='evidence'?[actor||mentions.find(m=>m.id!==direct)?.id||focus.suspect].filter(Boolean):[];
 const previous=c.alibis?.[speaker.id],route=/\b(then|before|after|went|through|from|heading|walking|on my way)\b/.test(low);
 return {intent,targets,confirmWho:c.lastAlibi?.player||focus.suspect,roleClaim,actor,victim,addressee:direct,mentions,room,kill:!!killMatch,vent:!!ventMatch,fake,selfReport,visual,withPlayers,denied:denial||negatedKill,negatedSeeing,witnessClaim,reportedSpeech,question,bodyQuestion,route,contradiction:intent==='alibi'&&previous?.room&&room&&room!==previous.room&&!route?previous.room:null,bargain:/\bif not\b/.test(low)&&vote,low};
}
