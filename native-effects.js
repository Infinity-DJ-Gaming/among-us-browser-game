const load=src=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=src;});
export class NativeEffects{
 constructor(recolor){this.recolor=recolor;this.images={};}
 async load(){this.meta=await fetch('assets-native-fx.json').then(r=>r.json());await Promise.all(this.meta.images.map(async file=>this.images[file]=await load(file)));}
 bounds(names,first=false){const frames=names.flatMap(name=>(this.meta?.clips[name]?.tracks||[]).flatMap(t=>(first?t.keys.slice(0,1):t.keys).map(k=>this.frame(k.sprite)))).filter(Boolean),x=Math.min(...frames.map(f=>f.draw[0])),y=Math.min(...frames.map(f=>f.draw[1])),right=Math.max(...frames.map(f=>f.draw[0]+f.draw[2])),bottom=Math.max(...frames.map(f=>f.draw[1]+f.draw[3]));return {x,y,w:right-x,h:bottom-y};}
 frame(key){return this.meta?.frames[key];}
 draw(ctx,key,x,y,scale=1,color=null){const f=this.frame(key);if(!f)return;const im=this.images[f.image||this.meta.image];if(!im)return;const [rx,ry,rw,rh]=f.rect,d=f.draw;if(color!==null){const cell=this.recolor('native:'+key+':'+color,im,{x:rx,y:ry,w:rw,h:rh},color);ctx.drawImage(cell,x+d[0]*scale,y+d[1]*scale,d[2]*scale,d[3]*scale);}else ctx.drawImage(im,rx,ry,rw,rh,x+d[0]*scale,y+d[1]*scale,d[2]*scale,d[3]*scale);}
 fit(ctx,key,x,y,w,h,color=null){const f=this.frame(key);if(!f)return;const [rx,ry,rw,rh]=f.rect,im=this.images[f.image||this.meta.image];if(color!==null){const cell=this.recolor('native:'+key+':'+color,im,{x:rx,y:ry,w:rw,h:rh},color);ctx.drawImage(cell,x,y,w,h);}else ctx.drawImage(im,rx,ry,rw,rh,x,y,w,h);}
 group(ctx,name,phase,x,y,scale=1,color=null){const keys=this.meta?.groups[name];if(keys?.length)this.draw(ctx,keys[Math.min(keys.length-1,Math.max(0,Math.floor(phase*keys.length)))],x,y,scale,color);}
 clip(ctx,name,phase,x,y,scale=1,color=null){const clip=this.meta?.clips[name];if(!clip)return;for(const t of clip.tracks){const key=[...t.keys].reverse().find(k=>k.time<=phase*clip.duration)||t.keys[0];if(key)this.draw(ctx,key.sprite,x,y,scale,color);}}
}
