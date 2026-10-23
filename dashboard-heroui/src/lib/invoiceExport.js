import logoUrl from '../assets/hala-logo.png';

const W=1240,H=1754,margin=80,purple='#270A5E',muted='#626B82',line='#E5E7EF';
const money=value=>value==null?'غير متاح':Number(value).toFixed(2)+' USD';
const date=(value,time=false)=>value?new Intl.DateTimeFormat('ar-EG',{dateStyle:'medium',...(time?{timeStyle:'short'}:{}),timeZone:'Africa/Cairo'}).format(new Date(value)):'غير محدد';
function pdfFromImages(images){
  const enc=new TextEncoder();const chunks=[];let length=0;const offsets=[0];
  const put=value=>{const bytes=typeof value==='string'?enc.encode(value):value;chunks.push(bytes);length+=bytes.length};
  const object=(id,body)=>{offsets[id]=length;put(id+' 0 obj\n');body();put('\nendobj\n')};
  put('%PDF-1.4\n% Hala invoice\n');
  object(1,()=>put('<< /Type /Catalog /Pages 2 0 R >>'));
  object(2,()=>put('<< /Type /Pages /Count '+images.length+' /Kids ['+images.map((_,i)=>(3+i*3)+' 0 R').join(' ')+'] >>'));
  images.forEach((image,i)=>{const page=3+i*3,content=page+1,picture=page+2;const stream='q\n595.28 0 0 841.89 0 0 cm\n/InvoiceImage Do\nQ\n';
    object(page,()=>put('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /InvoiceImage '+picture+' 0 R >> >> /Contents '+content+' 0 R >>'));
    object(content,()=>put('<< /Length '+enc.encode(stream).length+' >>\nstream\n'+stream+'endstream'));
    object(picture,()=>{put('<< /Type /XObject /Subtype /Image /Width '+image.width+' /Height '+image.height+' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+image.bytes.length+' >>\nstream\n');put(image.bytes);put('\nendstream')});
  });
  const start=length,count=3+images.length*3;put('xref\n0 '+count+'\n0000000000 65535 f \n');for(let i=1;i<count;i++)put(String(offsets[i]).padStart(10,'0')+' 00000 n \n');put('trailer\n<< /Size '+count+' /Root 1 0 R >>\nstartxref\n'+start+'\n%%EOF');
  return new Blob(chunks,{type:'application/pdf'});
}
async function renderInvoice(invoice,seller){
  await document.fonts.load('400 28px "IBM Plex Sans Arabic"');await document.fonts.load('600 28px "IBM Plex Sans Arabic"');
  const logo=new Image();logo.src=logoUrl;await logo.decode();
  const items=invoice?.items||[];const perPage=12,count=Math.max(1,Math.ceil(items.length/perPage)),pages=[];
  for(let page=0;page<count;page++){
    const canvas=document.createElement('canvas');canvas.width=W*1.5;canvas.height=H*1.5;const c=canvas.getContext('2d');if(!c)throw Error('Canvas unavailable');c.scale(1.5,1.5);c.fillStyle='#fff';c.fillRect(0,0,W,H);
    function text(value,x,y,size=24,color='#15132B',weight=400,direction='rtl'){c.font=weight+' '+size+'px "IBM Plex Sans Arabic"';c.fillStyle=color;c.textAlign='right';c.direction=direction;c.fillText(String(value),x,y)}
    function rule(y){c.strokeStyle=line;c.lineWidth=1;c.beginPath();c.moveTo(margin,y);c.lineTo(W-margin,y);c.stroke()}
    function wrap(value,x,y,width,size=23){let current='';for(const word of String(value).split(' ')){const next=current?current+' '+word:word;c.font='400 '+size+'px "IBM Plex Sans Arabic"';if(c.measureText(next).width>width&&current){text(current,x,y,size);y+=34;current=word}else current=next}if(current)text(current,x,y,size);return y}
    c.fillStyle=purple;c.fillRect(0,0,W,12);
    const imageW=180,imageH=logo.naturalHeight/logo.naturalWidth*imageW;c.drawImage(logo,margin,55,imageW,imageH);
    text('فاتورة خدمات',W-margin,110,46,purple,600);text('SERVICE INVOICE',W-margin,150,19,muted,400,'ltr');text(invoice?.id||'نموذج غير صادر',W-margin,190,22,muted,400,'ltr');rule(230);
    text('الجهة المصدرة',W-margin,275,20,muted);text('هلا كوميرس',W-margin,315,28,purple,600);text('فاتورة إلى',550,275,20,muted);text(seller.name,550,315,26,'#15132B',600,'ltr');text('معرّف البائع: '+seller.sellerId,550,352,20,muted);
    c.fillStyle='#F7F8FC';c.fillRect(margin,390,W-margin*2,118);text('تاريخ الإصدار',W-margin-22,430,20,muted);text(date(invoice?.issuedAt),W-margin-22,472,24);text('موعد الاستحقاق',550,430,20,muted);text(date(invoice?.dueAt,true),550,472,23);
    text('الحالة: '+(invoice?.status||'معاينة'),W-margin,555,22,purple,600);
    c.fillStyle=purple;c.fillRect(margin,585,W-margin*2,54);text('الخدمة',W-margin-20,621,22,'#fff',500);text('الكمية',660,621,22,'#fff',500);text('سعر الوحدة',470,621,22,'#fff',500);text('الإجمالي',260,621,22,'#fff',500);
    let y=639;for(const item of items.slice(page*perPage,(page+1)*perPage)){c.fillStyle=((y-639)/64)%2===0?'#fff':'#FAFAFC';c.fillRect(margin,y,W-margin*2,64);text(item.name,W-margin-20,y+41,23);text(item.quantity??'—',660,y+41,22);text(money(item.unitPrice),470,y+41,21,'#15132B',400,'ltr');text(money(item.total),260,y+41,21,purple,500,'ltr');y+=64;rule(y)}
    if(!items.length){text('تفاصيل البنود غير متاحة.',W-margin-20,y+55,24,muted);y+=90}
    if(page===count-1){y+=30;c.fillStyle='#F1EBFC';c.fillRect(margin,y,W-margin*2,90);text('إجمالي الفاتورة',W-margin-24,y+55,28,purple,600);text(money(invoice?.total),360,y+55,32,purple,600,'ltr')}
    rule(H-195);if(!invoice||invoice.demo)wrap('فاتورة تجريبية للمعاينة فقط — ليست فاتورة صادرة أو مطالبة مالية.',W-margin,H-145,W-margin*2,22);
    text('جميع المبالغ بالدولار الأمريكي • التوقيت: القاهرة',W-margin,H-90,19,muted);text((page+1)+' / '+count,190,H-90,19,muted,400,'ltr');
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',0.94));if(!blob)throw Error('Image export failed');pages.push({width:canvas.width,height:canvas.height,bytes:new Uint8Array(await blob.arrayBuffer()),url:canvas.toDataURL('image/jpeg',0.94)});
  }return pages;
}
export async function downloadInvoice(invoice,seller){const pages=await renderInvoice(invoice,seller);const blob=pdfFromImages(pages);const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Hala-'+(invoice?.id||'invoice-preview')+'.pdf';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000)}
export async function printInvoice(invoice,seller){
  const pages=await renderInvoice(invoice,seller);const frame=document.createElement('iframe');frame.title='طباعة فاتورة هلا';frame.style.cssText='position:fixed;width:1px;height:1px;left:-10000px;border:0';
  const ready=new Promise((resolve,reject)=>{frame.onload=resolve;frame.onerror=reject});frame.srcdoc='<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>Hala Invoice</title><style>@page{size:A4;margin:0}*{box-sizing:border-box}html,body{margin:0;padding:0}img{display:block;width:210mm;height:297mm;break-after:page}img:last-child{break-after:auto}</style></head><body>'+pages.map(p=>'<img alt="فاتورة خدمات هلا" src="'+p.url+'">').join('')+'</body></html>';document.body.appendChild(frame);await ready;await Promise.all([...frame.contentDocument.images].map(img=>img.decode()));frame.contentWindow.focus();frame.contentWindow.print();setTimeout(()=>frame.remove(),120000);
}
