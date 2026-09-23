import { useRef } from 'react';
import type { Frame, FrameState, Job } from '../lib/schema';
import { devices, useCanvasStore } from '../store';

const labels:Record<FrameState,string>={idle:'Idle',filled:'Filled',positive:'Positive',negative:'Negative'};
const statusLabel=(job?:Job)=>job ? job.status : 'ready';

export default function FrameCanvas({frame,job,onGenerate}:{frame?:Frame;job?:Job;onGenerate:()=>void}){
  const device=useCanvasStore(s=>devices[s.device]);
  const selected=useCanvasStore(s=>s.selected);
  const setSelected=useCanvasStore(s=>s.setSelected);
  const zoom=useCanvasStore(s=>s.zoom);
  const position=useCanvasStore(s=>s.positions[frame?.state ?? 'idle']);
  const setPosition=useCanvasStore(s=>s.setPosition);
  const dragging=useRef<{x:number;y:number;px:number;py:number}|null>(null);
  const state=frame?.state ?? job?.states[0] ?? 'idle';

  const onPointerDown=(e:React.PointerEvent)=>{
    if(e.button!==0) return;
    e.stopPropagation();
    setSelected(state);
    dragging.current={x:e.clientX,y:e.clientY,px:position.x,py:position.y};
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove=(e:React.PointerEvent)=>{
    if(!dragging.current) return;
    const d=dragging.current;
    setPosition(state,{x:d.px+(e.clientX-d.x)/zoom,y:d.py+(e.clientY-d.y)/zoom});
  };
  const onPointerUp=()=>{dragging.current=null};

  return <div className={`frame-node ${selected===state?'selected':''}`} style={{left:position.x,top:position.y,width:device.width*zoom+2}} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
    <div className="frame-node-label"><span><b>{labels[state]}</b><small>{device.width} × {device.height}</small></span><span className={`frame-status ${statusLabel(job)}`}>{statusLabel(job)}</span></div>
    <div className="artboard" style={{width:device.width*zoom,height:device.height*zoom}}>
      {frame?.html ? <iframe title={frame.title} sandbox="allow-scripts" srcDoc={frame.html} style={{width:device.width,height:device.height,transform:`scale(${zoom})`}}/> : <div className="frame-placeholder"><div className="spinner"/><strong>{job?.status==='running'?'Generating…':'Not generated'}</strong><span>{job?.message ?? 'Generate this frame independently.'}</span><button onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();onGenerate()}}>Generate {labels[state]}</button></div>}
    </div>
    <div className="frame-node-footer"><span>Login — {labels[state]}</span><button onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();onGenerate()}}>{job?.status==='running'?'Running…':'Generate'}</button></div>
  </div>;
}
