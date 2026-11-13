window.mkDoc=async function(){
await new Promise((r,j)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';s.onload=r;s.onerror=j;document.head.appendChild(s)});
const z=await JSZip.loadAsync(await readFileBinary('HU-PW-194 Icono micrositio destacados Hero.docx'));
const x=await z.file('word/document.xml').async('string');
const esc=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const L='<w:lang w:val="es-ES"/>';const B=[];
const run=(t,rp='')=>String(t).split(/(\*\*[^*]+\*\*)/).filter(Boolean).map(p=>{const b=p.startsWith('**');return '<w:r><w:rPr>'+(b?'<w:b/><w:bCs/>':'')+rp+L+'</w:rPr><w:t xml:space="preserve">'+esc(b?p.slice(2,-2):p)+'</w:t></w:r>'}).join('');
const D={B,
H:t=>B.push('<w:p><w:pPr><w:keepNext/><w:spacing w:before="200" w:after="140"/></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:sz w:val="28"/>'+L+'</w:rPr><w:t xml:space="preserve">'+esc(t)+'</w:t></w:r></w:p>'),
H2:t=>B.push('<w:p><w:pPr><w:keepNext/><w:spacing w:before="180" w:after="80"/></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:sz w:val="24"/><w:color w:val="14555C"/>'+L+'</w:rPr><w:t xml:space="preserve">'+esc(t)+'</w:t></w:r></w:p>'),
b:t=>B.push('<w:p><w:pPr><w:keepNext/></w:pPr><w:r><w:rPr><w:b/><w:bCs/>'+L+'</w:rPr><w:t xml:space="preserve">'+esc(t)+'</w:t></w:r></w:p>'),
p:t=>B.push('<w:p>'+run(t)+'</w:p>'),
li:t=>B.push('<w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr>'+run(t)+'</w:p>'),
BR:()=>B.push('<w:p><w:r><w:br w:type="page"/></w:r></w:p>'),
T:(head,rows,w)=>{const bd=['top','left','bottom','right','insideH','insideV'].map(s=>'<w:'+s+' w:val="single" w:sz="4" w:space="0" w:color="A6A6A6"/>').join('');const cP=(t,bb)=>String(t).split('\n').map(l=>'<w:p><w:pPr><w:spacing w:before="30" w:after="30"/></w:pPr>'+run(l,(bb?'<w:b/><w:bCs/>':'')+'<w:sz w:val="20"/>')+'</w:p>').join('');
 B.push('<w:tbl><w:tblPr><w:tblW w:w="'+w.reduce((a,c)=>a+c,0)+'" w:type="dxa"/><w:tblBorders>'+bd+'</w:tblBorders><w:tblLayout w:type="fixed"/><w:tblCellMar><w:left w:w="80" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>'+w.map(v=>'<w:gridCol w:w="'+v+'"/>').join('')+'</w:tblGrid>'+(head?'<w:tr><w:trPr><w:tblHeader/></w:trPr>'+head.map((h,i)=>'<w:tc><w:tcPr><w:tcW w:w="'+w[i]+'" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="D9E2F3"/></w:tcPr>'+cP(h,1)+'</w:tc>').join('')+'</w:tr>':'')+rows.map(r=>'<w:tr><w:trPr><w:cantSplit/></w:trPr>'+r.map((c,i)=>'<w:tc><w:tcPr><w:tcW w:w="'+w[i]+'" w:type="dxa"/>'+(!head&&i===0?'<w:shd w:val="clear" w:color="auto" w:fill="EAF2F3"/>':'')+'</w:tcPr>'+cP(c,!head&&i===0)+'</w:tc>').join('')+'</w:tr>').join('')+'</w:tbl>');B.push('<w:p/>');},
save:async(path)=>{const head=x.slice(0,x.indexOf('<w:body>')+8),sect=x.slice(x.lastIndexOf('<w:sectPr'));z.file('word/document.xml',head+B.join('')+sect);await saveFile(path,await z.generateAsync({type:'blob'}));}};
return D;};