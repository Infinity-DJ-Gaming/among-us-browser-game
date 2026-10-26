const $=(s,r=document)=>r.querySelector(s);
export function taskUI(root,station,onComplete,sound=()=>{}){
 let timers=[],closed=false,finished=false,intervals=[];
 const later=(fn,ms)=>{let id=setTimeout(()=>{if(!closed)fn();},ms);timers.push(id);return id;};
 const every=(fn,ms)=>{let id=setInterval(()=>{if(!closed)fn();},ms);intervals.push(id);return id;};
 let instructions={wires:'Connect each wire to its matching color and symbol. Click or drag.',card:'Drag the card from left to right in one smooth swipe.',asteroids:'Click the asteroids to destroy 12 of them.',sequence:'Watch the blue lights. Repeat the sequence on the right.',download:'Download the ship’s data. Stay here until the transfer finishes.',power:'Raise every power slider to the top.',scan:'Stay on the scanner while your identity is verified.',steering:'Drag the crosshair into the center of the target.',garbage:'Hold the lever to eject the garbage.',shields:'Turn every red shield white.',numbers:'Press the numbers in order, from 1 through 10.',fuel:'Hold the fuel button until the tank is full.'};
 root.innerHTML=`<button class="close-modal" aria-label="Close task">×</button><h2>${station.name}</h2><p>${instructions[station.type]||'Repair the ship system.'}</p><div class="task-board"></div><div class="task-status" aria-live="polite">${station.room||''}</div>`;
 const board=$('.task-board',root),status=$('.task-status',root);
 const complete=()=>{if(finished||closed)return;finished=true;status.textContent='TASK COMPLETED!';status.classList.add('success');sound('complete');later(onComplete,750);};
 const progress=(label,duration,hold=false)=>{
  board.innerHTML=`<div class="progress-center"><div class="task-icon">${station.type==='scan'?'⌁':station.type==='garbage'?'⇩':station.type==='fuel'?'▣':'⇄'}</div><div>${label}</div><div class="progress-track"><i></i></div>${hold?'<button class="task-cta hold-button">HOLD</button>':'<div class="scan-code">WAITING…</div>'}</div>`;
  let amount=0,active=!hold;
  if(hold){const btn=$('.hold-button',board);btn.onpointerdown=e=>{e.preventDefault();btn.setPointerCapture(e.pointerId);active=true;btn.textContent='HOLDING…';};btn.onpointerup=btn.onpointercancel=()=>{active=false;btn.textContent='HOLD';};btn.onkeydown=e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();active=true;btn.textContent='HOLDING…';}};btn.onkeyup=e=>{if(e.key===' '||e.key==='Enter'){active=false;btn.textContent='HOLD';}};}
  every(()=>{if(finished)return;if(active){amount+=.05/duration;$('.progress-track i',board).style.width=Math.min(100,amount*100)+'%';status.textContent=Math.min(100,Math.floor(amount*100))+'%';if(!hold)$('.scan-code',board).textContent=station.type==='scan'?['ID: '+Math.floor(1000+amount*8000),'HEIGHT: 3′ 6″','WEIGHT: 92 LB','BLOOD TYPE: O−'][Math.min(3,Math.floor(amount*4))]:'TRANSFER IN PROGRESS';if(amount>=1)complete();}},50);
 };
 if(station.type==='wires'){
  board.classList.add('bg-wires');let colors=['#f34e67','#4fa7ff','#ffe448','#fb73ed'],symbols=['●','◆','▲','✚'],order=[2,0,3,1],done=new Set(),selected=-1;
  board.innerHTML='<svg class="wire-svg" viewBox="0 0 600 350" preserveAspectRatio="none"></svg>';
  for(let side=0;side<2;side++)for(let i=0;i<4;i++){let c=side?order[i]:i,btn=document.createElement('button');btn.className='wire-terminal'+(side?' right':'');btn.style.cssText=`top:${17+i*20}%;--wire:${colors[c]}`;btn.textContent=symbols[c];btn.dataset.color=c;btn.dataset.side=side;btn.setAttribute('aria-label',`${side?'Right':'Left'} ${['red','blue','yellow','pink'][c]} wire`);board.append(btn);
   btn.onpointerdown=e=>{e.preventDefault();if(done.has(c))return;if(!side){selected=c;board.querySelectorAll('.wire-terminal').forEach(el=>el.classList.toggle('selected',el===btn));}else connect(c);};
  }
  function connect(c){if(selected!==c||done.has(c))return;done.add(c);let line=document.createElementNS('http://www.w3.org/2000/svg','line');line.setAttribute('x1','100');line.setAttribute('y1',String((17+c*20)*3.5+12));line.setAttribute('x2','500');line.setAttribute('y2',String((17+order.indexOf(c)*20)*3.5+12));line.setAttribute('stroke',colors[c]);$('.wire-svg',board).append(line);board.querySelectorAll(`[data-color="${c}"]`).forEach(el=>el.classList.add('connected'));sound('click');selected=-1;if(done.size===4)complete();}
  board.onpointerup=e=>{let target=document.elementFromPoint(e.clientX,e.clientY)?.closest('.wire-terminal.right');if(target)connect(Number(target.dataset.color));};
 }else if(station.type==='card'){
  board.classList.add('card-board');board.innerHTML='<div class="swipe-label">PLEASE SWIPE CARD</div><div class="card-track"></div><div class="swipe-card" role="button" tabindex="0" aria-label="Swipe ID card"></div>';
  let card=$('.swipe-card',board),start=0,startX=0,moving=false;
  card.onpointerdown=e=>{if(finished)return;e.preventDefault();card.setPointerCapture(e.pointerId);start=performance.now();startX=e.clientX;moving=true;};
  card.onpointermove=e=>{if(!moving)return;let w=board.clientWidth,shift=Math.max(0,Math.min(w*.7,e.clientX-startX));card.style.left=`calc(7% + ${shift}px)`;};
  card.onpointerup=e=>{if(!moving)return;moving=false;let ms=performance.now()-start,shift=e.clientX-startX;card.style.left='7%';if(shift<board.clientWidth*.5){status.textContent='SWIPE ALL THE WAY ACROSS';return;}if(ms<350){status.textContent='TOO FAST. TRY AGAIN.';sound('click');}else if(ms>1400){status.textContent='TOO SLOW. TRY AGAIN.';sound('click');}else{$('.swipe-label',board).textContent='ACCEPTED. THANK YOU.';complete();}};
  card.onpointercancel=()=>{moving=false;card.style.left='7%';};
  card.onkeydown=e=>{if(e.key===' '||e.key==='Enter'){if(e.repeat)return;start=performance.now();card.style.left='72%';e.preventDefault();}};
  card.onkeyup=e=>{if(e.key===' '||e.key==='Enter'){let ms=performance.now()-start;card.style.left='7%';if(ms>=350&&ms<=1400)complete();else status.textContent=ms<350?'TOO FAST. HOLD SPACE FOR A MOMENT.':'TOO SLOW. TRY AGAIN.';}};
 }else if(station.type==='asteroids'){
  board.classList.add('asteroid-board');board.innerHTML='<div class="score-counter">Destroyed: 0 / 12</div>';let score=0;
  function rock(){if(finished||board.querySelectorAll('.asteroid').length>5)return;let el=document.createElement('button');el.className='asteroid';el.setAttribute('aria-label','Destroy asteroid');el.innerHTML='<img src="assets-tasks-asteroid.png" alt="Asteroid">';let size=45+Math.random()*30;el.style.cssText=`width:${size}px;height:${size}px;left:${8+Math.random()*75}%;top:${5+Math.random()*55}%`;el.onclick=()=>{if(finished)return;el.remove();score++;$('.score-counter',board).textContent=`Destroyed: ${score} / 12`;sound('click');if(score===12)complete();else rock();};board.append(el);later(()=>{el.remove();rock();},6500);}
  for(let i=0;i<4;i++)rock();every(rock,1000);
 }else if(station.type==='sequence'){
  board.classList.add('sequence-board');board.innerHTML='<div class="sequence-display">'+Array.from({length:9},()=>'<div class="seq-light"></div>').join('')+'</div><div class="sequence-keys">'+Array.from({length:9},(_,i)=>`<button class="seq-key" aria-label="Reactor key ${i+1}" data-key="${i}"></button>`).join('')+'</div>';
  let pattern=Array.from({length:4},()=>Math.floor(Math.random()*9)),round=1,input=0,locked=true;
  function show(){locked=true;input=0;status.textContent=`WATCH THE PATTERN · ${round} / 4`;for(let i=0;i<round;i++){later(()=>{board.querySelectorAll('.seq-light')[pattern[i]].classList.add('on');sound('click');},500+i*600);later(()=>board.querySelectorAll('.seq-light')[pattern[i]].classList.remove('on'),900+i*600);}later(()=>{locked=false;status.textContent='YOUR TURN';},500+round*600);}
  board.querySelectorAll('.seq-key').forEach(btn=>btn.onclick=()=>{if(locked||finished)return;if(Number(btn.dataset.key)!==pattern[input]){status.textContent='INCORRECT. WATCH AGAIN.';locked=true;later(show,900);return;}sound('click');input++;if(input===round){locked=true;if(round===4)complete();else{round++;later(show,700);}}});show();
 }else if(station.type==='download')progress('DOWNLOADING SHIP DATA',7);
 else if(station.type==='scan')progress('MEDBAY SCAN IN PROGRESS',7);
 else if(station.type==='garbage')progress('EMPTY GARBAGE · HOLD LEVER',2.5,true);
 else if(station.type==='fuel')progress('FILL FUEL TANK',3.5,true);
 else if(station.type==='power'){
  board.style.background="url('assets-tasks-power.png') center/100% 100% no-repeat";board.innerHTML='<div class="power-sliders">'+['O2','NAV','COMMS','SHIELDS'].map(n=>`<div class="power-column"><input type="range" min="0" max="100" value="0" aria-label="Power to ${n}"><span>${n}</span></div>`).join('')+'</div>';
  board.querySelectorAll('input').forEach(input=>input.oninput=()=>{if([...board.querySelectorAll('input')].every(el=>Number(el.value)>95))complete();});
 }else if(station.type==='steering'){
  board.classList.add('steering-board');board.innerHTML='<div class="steering-target"></div><button class="steering-cross" aria-label="Drag crosshair to center">⊕</button>';let cross=$('.steering-cross',board),active=false;
  cross.onpointerdown=e=>{e.preventDefault();cross.setPointerCapture(e.pointerId);active=true;};cross.onpointermove=e=>{if(!active||finished)return;let box=board.getBoundingClientRect(),x=e.clientX-box.left,y=e.clientY-box.top;cross.style.left=(x-35)+'px';cross.style.top=(y-30)+'px';};cross.onpointerup=e=>{active=false;let box=board.getBoundingClientRect();if(Math.hypot(e.clientX-box.left-box.width/2,e.clientY-box.top-box.height/2)<40){cross.style.left='calc(50% - 35px)';cross.style.top='calc(50% - 30px)';complete();}};
  cross.onkeydown=e=>{let x=parseFloat(cross.style.left)||board.clientWidth*.15,y=parseFloat(cross.style.top)||board.clientHeight*.2;if(e.key==='ArrowRight')x+=10;if(e.key==='ArrowLeft')x-=10;if(e.key==='ArrowUp')y-=10;if(e.key==='ArrowDown')y+=10;cross.style.left=x+'px';cross.style.top=y+'px';if(Math.hypot(x+35-board.clientWidth/2,y+30-board.clientHeight/2)<30)complete();};
 }else if(station.type==='numbers'){
  let nums=[1,2,3,4,5,6,7,8,9,10].sort(()=>Math.random()-.5),next=1;board.innerHTML='<div class="number-grid">'+nums.map(n=>`<button class="number-key" data-number="${n}">${n}</button>`).join('')+'</div>';
  board.querySelectorAll('button').forEach(btn=>btn.onclick=()=>{if(finished)return;if(Number(btn.dataset.number)===next){btn.classList.add('complete');sound('click');next++;if(next===11)complete();}else{status.textContent='WRONG ORDER — START AGAIN';next=1;board.querySelectorAll('button').forEach(el=>el.classList.remove('complete'));}});
 }else if(station.type==='shields'){
  board.innerHTML='<div class="shield-grid">'+Array.from({length:9},(_,i)=>`<button class="shield-cell ${i%3===1?'on':''}" aria-label="Shield ${i+1}"></button>`).join('')+'</div>';
  board.querySelectorAll('button').forEach(btn=>btn.onclick=()=>{if(finished)return;btn.classList.toggle('on');sound('click');if([...board.querySelectorAll('button')].every(b=>b.classList.contains('on')))complete();});
 }else if(station.type==='lights'){
  board.classList.add('lights-board');board.innerHTML=Array.from({length:5},(_,i)=>`<button class="light-switch ${i===1?'on':''}" aria-label="Light switch ${i+1}"></button>`).join('');board.querySelectorAll('button').forEach(btn=>btn.onclick=()=>{btn.classList.toggle('on');sound('click');if([...board.querySelectorAll('button')].every(b=>b.classList.contains('on')))complete();});
 }else if(station.type==='oxygen'){
  let code=String(Math.floor(10000+Math.random()*89999));board.innerHTML=`<div class="progress-center"><div>CODE: <b>${code}</b></div><input type="text" inputmode="numeric" maxlength="5" aria-label="Oxygen code" style="width:180px;color:#90edc4;font:25px monospace"><button class="task-cta">CONFIRM</button></div>`;$('.task-cta',board).onclick=()=>{if($('input',board).value===code)complete();else status.textContent='INCORRECT CODE';};
 }else progress('HOLD TO RESTORE SYSTEM',3,true);
 return ()=>{closed=true;for(const id of timers)clearTimeout(id);for(const id of intervals)clearInterval(id);};
}
