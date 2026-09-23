import { create } from 'zustand';
import type { Agent, FrameState } from './lib/schema';

export type DeviceId = 'iphone17' | 'iphone17pro' | 'iphone17promax';
export type Point = { x:number; y:number };

export const devices:Record<DeviceId,{label:string;width:number;height:number;density:number}> = {
  iphone17:{label:'iPhone 17',width:402,height:874,density:3},
  iphone17pro:{label:'iPhone 17 Pro',width:402,height:873,density:3},
  iphone17promax:{label:'iPhone 17 Pro Max',width:440,height:956,density:3},
};

const defaultPrompt=`Redesign the Login screen from docs/design.md. Generate self-contained HTML for each requested state independently: idle, filled, positive, negative. Keep the same visual system and geometry across states while changing only the state-specific content and feedback. Target the selected iPhone CSS viewport exactly, use viewport-fit=cover and env(safe-area-inset-*) for real safe-area behavior, and do not draw fake device chrome inside the HTML. Publish each state independently with publish_frame_html. Do not touch React or infrastructure.`;

const initialPositions:Record<FrameState,Point> = {
  idle:{x:80,y:140},
  filled:{x:560,y:140},
  positive:{x:1040,y:140},
  negative:{x:1520,y:140},
};

type Store = {
  agent:Agent; prompt:string; states:FrameState[]; selected:FrameState|null; zoom:number; device:DeviceId;
  positions:Record<FrameState,Point>; pan:Point;
  setAgent:(v:Agent)=>void; setPrompt:(v:string)=>void; toggleState:(v:FrameState)=>void;
  setSelected:(v:FrameState|null)=>void; setZoom:(v:number)=>void; setDevice:(v:DeviceId)=>void;
  setPosition:(state:FrameState,point:Point)=>void; setPan:(point:Point)=>void;
};

export const useCanvasStore = create<Store>((set)=>({
  agent:'claude', prompt:defaultPrompt, states:['idle','filled','positive','negative'], selected:'idle', zoom:.72,
  device:'iphone17pro', positions:initialPositions, pan:{x:80,y:30},
  setAgent:(agent)=>set({agent}), setPrompt:(prompt)=>set({prompt}),
  toggleState:(state)=>set(s=>({states:s.states.includes(state)?s.states.filter(x=>x!==state):[...s.states,state]})),
  setSelected:(selected)=>set({selected}), setZoom:(zoom)=>set({zoom}), setDevice:(device)=>set({device}),
  setPosition:(state,point)=>set(s=>({positions:{...s.positions,[state]:point}})), setPan:(pan)=>set({pan}),
}));
