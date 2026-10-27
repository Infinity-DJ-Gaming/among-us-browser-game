// Apply the same soft visibility boundary to each pixel of a rendered actor layer.
export function maskVisibleLayer(ctx,mask,blur=7){ctx.save();ctx.globalCompositeOperation='destination-in';ctx.filter='blur('+blur+'px)';ctx.drawImage(mask,0,0);ctx.restore();}
