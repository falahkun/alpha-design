import { useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cancelJob, createJob, fetchFrames, fetchJobs } from './lib/api';
import type { Agent, FrameState, Job } from './lib/schema';
import { devices, useCanvasStore } from './store';
import FrameCanvas from './components/FrameCanvas';
import HtmlDiff from './components/HtmlDiff';

const states:FrameState[]=['idle','filled','positive','negative'];
const labels:Record<FrameState,string>={idle:'Idle',filled:'Filled',positive:'Positive',negative:'Negative'};
const agentLabels:Record<Agent,string>={claude:'Claude Code',codex:'Codex',antigravity:'Antigravity'};

export default function App(){
  const qc=useQueryClient();
  const {agent,setAgent,prompt,setPrompt,states:chosen,toggleState,selected,setSelected,zoom,setZoom,device,setDevice,pan,setPan}=useCanvasStore();
  const [composerOpen,setComposerOpen]=useState(true);
  const [jobsOpen,setJobsOpen]=useState(true);
  const [diffOpen,setDiffOpen]=useState(false);
  const framesQ=useQuery({queryKey:['frames'],queryFn:fetchFrames,refetchInterval:1000});
  const jobsQ=useQuery({queryKey:['jobs'],queryFn:fetchJobs,refetchInterval:1000});
  const create=useMutation({mutationFn:({state}:{state:FrameState})=>createJob(agent,prompt,[state],`${deviceMeta.label} — ${deviceMeta.width} × ${deviceMeta.height} CSS px — ${deviceMeta.density}×`),onSuccess:()=>qc.invalidateQueries({queryKey:['jobs']})});
  const cancel=useMutation({mutationFn:cancelJob,onSuccess:()=>qc.invalidateQueries({queryKey:['jobs']})});
  const frames=framesQ.data??[];
  const jobs=jobsQ.data??[];
  const selectedFrame=frames.find(f=>f.state===selected);
  const previous=selectedFrame?.previousHtml?({state:selectedFrame.state,title:`Previous — ${selectedFrame.state}`,html:selectedFrame.previousHtml,updatedAt:'previous snapshot'} as const):undefined;
  const surface=useRef<HTMLDivElement>(null);
  const panRef=useRef<{x:number;y:number;px:number;py:number}|null>(null);
  const deviceMeta=devices[device];

  const jobByState=useMemo(()=>{
    const map:Partial<Record<FrameState,Job>>={};
    for(const j of jobs){for(const s of j.states){if(!map[s] || new Date(j.createdAt)>new Date(map[s]!.createdAt)) map[s]=j;}}
    return map;
  },[jobs]);

  const generate=(state:FrameState)=>create.mutate({state});
  const generateChosen=()=>chosen.forEach((state,i)=>setTimeout(()=>generate(state),i*120));

  const onCanvasPointerDown=(e:React.PointerEvent)=>{
    if(e.target!==e.currentTarget) return;
    panRef.current={x:e.clientX,y:e.clientY,px:pan.x,py:pan.y};
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onCanvasPointerMove=(e:React.PointerEvent)=>{
    if(!panRef.current) return;
    const d=panRef.current;
    setPan({x:d.px+e.clientX-d.x,y:d.py+e.clientY-d.y});
  };
  const onCanvasPointerUp=()=>{panRef.current=null};
  const onWheel=(e:React.WheelEvent)=>{
    e.preventDefault();
    const next=Math.max(.45,Math.min(1.15,zoom-(e.deltaY>0?.05:-.05)));
    setZoom(next);
  };

  return <main className="app">
    <header className="topbar">
      <div className="brand"><button className="menu-dot" onClick={()=>setComposerOpen(v=>!v)}>☰</button><div><strong>Aksa Digital Login Redesign</strong><small>HTML frame lab</small></div></div>
      <div className="top-actions">
        <label className="select-wrap"><span>Device</span><select value={device} onChange={e=>setDevice(e.target.value as keyof typeof devices)}>{Object.entries(devices).map(([id,d])=><option key={id} value={id}>{d.label} · {d.width} × {d.height}</option>)}</select></label>
        <span className="sync"><i/> bridge ready</span>
        <button className="top-btn" onClick={()=>setJobsOpen(v=>!v)}>Jobs {jobs.length||''}</button>
        <button className="top-btn primary" disabled={create.isPending||chosen.length===0||!prompt.trim()} onClick={generateChosen}>Generate selected</button>
      </div>
    </header>

    <div className="canvas" ref={surface} onPointerDown={onCanvasPointerDown} onPointerMove={onCanvasPointerMove} onPointerUp={onCanvasPointerUp} onPointerCancel={onCanvasPointerUp} onWheel={onWheel}>
      <div className="grid-plane" style={{backgroundSize:`${24*zoom}px ${24*zoom}px`,backgroundPosition:`${pan.x}px ${pan.y}px`}}/>
      <div className="canvas-stage" style={{transform:`translate(${pan.x}px,${pan.y}px)`}}>
        <div className="system-card">
          <div className="system-title">Aksa Digital HR System</div>
          <div className="system-swatch primary-swatch">Primary <b>#0B6BFF</b></div><div className="system-swatch green-swatch">Secondary <b>#079455</b></div><div className="system-swatch orange-swatch">Tertiary <b>#F79309</b></div>
          <div className="system-type">Aa <span>Montserrat</span></div><div className="system-rules"><span/> <span/> <span/></div>
        </div>
        {states.map(state=><FrameCanvas key={state} frame={frames.find(f=>f.state===state)} job={jobByState[state]} onGenerate={()=>generate(state)}/>)}
      </div>

      <div className="canvas-toolbar left-toolbar"><button title="Zoom out" onClick={()=>setZoom(Math.max(.45,zoom-.1))}>−</button><button title="Zoom in" onClick={()=>setZoom(Math.min(1.15,zoom+.1))}>＋</button><button title="Fit" onClick={()=>{setZoom(.72);setPan({x:60,y:35})}}>⌂</button></div>
      <div className="canvas-toolbar bottom-toolbar"><span>{Math.round(zoom*100)}%</span><button onClick={()=>setZoom(Math.max(.45,zoom-.05))}>−</button><button onClick={()=>setZoom(Math.min(1.15,zoom+.05))}>＋</button></div>

      {composerOpen&&<section className="floating composer-float">
        <div className="float-head"><div><strong>Prompt Composer</strong><small>Generate each frame independently</small></div><button onClick={()=>setComposerOpen(false)}>×</button></div>
        <div className="agent-row">{(Object.keys(agentLabels) as Agent[]).map(a=><button key={a} className={agent===a?'active':''} onClick={()=>setAgent(a)}>{agentLabels[a]}</button>)}</div>
        <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} spellCheck={false}/>
        <div className="state-row">{states.map(s=><button key={s} className={chosen.includes(s)?'active':''} onClick={()=>toggleState(s)}>{chosen.includes(s)?'✓ ':''}{labels[s]}</button>)}</div>
        <button className="generate-all" disabled={create.isPending||chosen.length===0||!prompt.trim()} onClick={generateChosen}>{create.isPending?'Queueing…':'Generate selected frames'}</button>
      </section>}

      {jobsOpen&&<section className="floating jobs-float">
        <div className="float-head"><div><strong>Jobs / Status</strong><small>Independent frame jobs</small></div><button onClick={()=>setJobsOpen(false)}>×</button></div>
        {jobs.length===0?<div className="empty-small">No generation jobs yet.</div>:<div className="jobs-scroll">{jobs.slice(0,10).map(j=><div className="job" key={j.id}><div className="job-top"><span className={`dot ${j.status}`}/><b>{agentLabels[j.agent]}</b><code>{j.id.slice(0,7)}</code></div><div className="job-state">{j.states.map(s=>labels[s]).join(', ')} · {j.status}</div><div className="job-msg">{j.message??'Waiting…'}</div>{(j.status==='queued'||j.status==='running')&&<button className="cancel" onClick={()=>cancel.mutate(j.id)}>Cancel</button>}</div>)}</div>}
      </section>}

      {diffOpen&&<section className="floating diff-float"><div className="float-head"><div><strong>HTML Diff</strong><small>{selectedFrame?`${labels[selectedFrame.state]} · previous snapshot`: 'Select a frame'}</small></div><button onClick={()=>setDiffOpen(false)}>×</button></div>{selectedFrame?<HtmlDiff current={selectedFrame} previous={previous}/>:<div className="empty-small">Click a frame first.</div>}</section>}
      <div className="bottom-prompt"><span>↳</span><input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="What do you want to change or build?"/><button onClick={()=>setDiffOpen(v=>!v)}>Diff</button><button className="mini-send" disabled={chosen.length===0||!prompt.trim()} onClick={generateChosen}>↑</button></div>
    </div>

    <footer className="statusbar"><span>Selected: {selected?labels[selected]:'none'}</span><span>{deviceMeta.label} · {deviceMeta.width} × {deviceMeta.height} CSS px · {deviceMeta.density}×</span><span>Drag canvas to pan · drag frames to move · wheel to zoom</span></footer>
  </main>;
}
