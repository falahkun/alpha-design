import { FrameListSchema, JobListSchema, JobSchema, type Agent, type Frame, type FrameState, type Job } from './schema';
import { sampleFrames } from './sampleFrames';

const api = async (path:string, init?:RequestInit) => {
  const r=await fetch(path,{...init,headers:{'Content-Type':'application/json',...(init?.headers||{})}});
  if(!r.ok) throw new Error((await r.text()) || `HTTP ${r.status}`);
  return r.json();
};

export async function fetchFrames(): Promise<Frame[]> {
  try { return FrameListSchema.parse(await api('/api/frames')); }
  catch { return sampleFrames; }
}
export async function fetchJobs(): Promise<Job[]> {
  try { return JobListSchema.parse(await api('/api/jobs')); }
  catch { return []; }
}
export async function createJob(agent:Agent,prompt:string,states:FrameState[],device?:string): Promise<Job> {
  return JobSchema.parse(await api('/api/jobs',{method:'POST',body:JSON.stringify({agent,prompt,states,device})}));
}
export async function cancelJob(id:string): Promise<Job> {
  return JobSchema.parse(await api(`/api/jobs/${id}/cancel`,{method:'POST'}));
}
export async function fetchJob(id:string): Promise<Job> {
  return JobSchema.parse(await api(`/api/jobs/${id}`));
}
