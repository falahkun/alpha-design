import { useMemo } from 'react';
import type { Frame } from '../lib/schema';

function lines(s:string){return s.replace(/\r\n/g,'\n').split('\n');}
function esc(s:string){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
export default function HtmlDiff({current,previous}:{current:Frame;previous?:Frame}){
  const rows=useMemo(()=>{
    const a=lines(previous?.html??current.previousHtml??''),b=lines(current.html);
    const n=Math.max(a.length,b.length); const out:{kind:'same'|'add'|'remove'|'change',text:string,side:'left'|'right'}[]=[];
    for(let i=0;i<n;i++){const av=a[i],bv=b[i]; if(av===bv) out.push({kind:'same',text:bv??'',side:'right'}); else {if(av!==undefined) out.push({kind:'remove',text:av,side:'left'}); if(bv!==undefined) out.push({kind:'add',text:bv,side:'right'});}}
    return out;
  },[current,previous]);
  if(!previous) return <div className="diff-empty">No previous snapshot for <b>{current.state}</b>. Publish another version to compare.</div>;
  return <div className="diff"><div className="diff-meta"><span>{previous.updatedAt}</span><span>→</span><span>{current.updatedAt}</span></div>{rows.map((r,i)=><div className={`diff-line ${r.kind}`} key={i}><span className="mark">{r.kind==='add'?'+':r.kind==='remove'?'-':' '}</span><code dangerouslySetInnerHTML={{__html:esc(r.text)||' '}} /></div>)}</div>;
}
