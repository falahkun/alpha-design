import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';

const port=Number(process.env.PREVIEW_PORT??8787);
const root=path.resolve(process.env.PREVIEW_ROOT??'agent-workspace');
const dir=path.join(root,'frames');
const historyDir=path.join(root,'history');
const jobsDir=path.join(root,'jobs');
const states=['idle','filled','positive','negative'] as const;
const agents=['claude','codex','antigravity'] as const;
type State=typeof states[number]; type Agent=typeof agents[number];
type Job={id:string;agent:Agent;states:State[];prompt:string;device?:string;status:'queued'|'running'|'succeeded'|'failed'|'cancelled';createdAt:string;startedAt?:string|null;finishedAt?:string|null;message?:string;output?:string};
const jobs=new Map<string,Job>();
const children=new Map<string,ReturnType<typeof spawn>>();
await Promise.all([fs.mkdir(dir,{recursive:true}),fs.mkdir(historyDir,{recursive:true}),fs.mkdir(jobsDir,{recursive:true})]);

function json(res:http.ServerResponse,status:number,data:unknown){res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type'});res.end(JSON.stringify(data));}
function validState(s:string):s is State{return (states as readonly string[]).includes(s)}
function validAgent(s:string):s is Agent{return (agents as readonly string[]).includes(s)}
async function readJson(req:http.IncomingMessage){let body='';for await(const c of req)body+=c;return body?JSON.parse(body):{};}
async function readFrame(state:string){if(!validState(state)) return null;try{const file=path.join(dir,`${state}.html`),html=await fs.readFile(file,'utf8'),stat=await fs.stat(file);let previousHtml:string|undefined;try{previousHtml=await fs.readFile(path.join(historyDir,state,'previous.html'),'utf8')}catch{};return {state,title:`Login — ${state}`,html,previousHtml,updatedAt:stat.mtime.toISOString()}}catch{return null}}
async function snapshot(state:State){try{const current=path.join(dir,`${state}.html`);const html=await fs.readFile(current,'utf8');const h=path.join(historyDir,state);await fs.mkdir(h,{recursive:true});await fs.writeFile(path.join(h,`v-${Date.now()}.html`),html,'utf8');await fs.writeFile(path.join(h,'previous.html'),html,'utf8')}catch{}}

function commandFor(agent:Agent,job:Job){
  const raw=process.env.AKSA_AGENT_COMMANDS_JSON; if(!raw) return null;
  try{const map=JSON.parse(raw) as Record<string,string[]>; const argv=map[agent]; if(!Array.isArray(argv)||!argv.length) return null;
    return argv.map(x=>String(x).replaceAll('{{promptFile}}',path.resolve(jobsDir,job.id,'PROMPT.md')).replaceAll('{{jobId}}',job.id).replaceAll('{{root}}',root).replaceAll('{{states}}',job.states.join(',')));
  }catch{return null}
}
async function runJob(job:Job){
  const argv=commandFor(job.agent,job);
  if(!argv){job.status='failed';job.finishedAt=new Date().toISOString();job.message='No agent command configured. Set AKSA_AGENT_COMMANDS_JSON to explicit argv arrays for claude, codex, and/or antigravity.';await persistJob(job);return;}
  job.status='running';job.startedAt=new Date().toISOString();job.message=`Running ${job.agent} adapter…`;await persistJob(job);
  const [bin,...args]=argv; const child=spawn(bin,args,{cwd:root,env:{...process.env,AKSA_AGENT_ROOT:root,AKSA_JOB_ID:job.id},stdio:['ignore','pipe','pipe']});children.set(job.id,child);
  let output=''; child.stdout?.on('data',d=>{output+=d.toString();job.output=output.slice(-12000)}); child.stderr?.on('data',d=>{output+=d.toString();job.output=output.slice(-12000)});
  child.on('error',async err=>{children.delete(job.id);job.status='failed';job.finishedAt=new Date().toISOString();job.message=err.message;await persistJob(job)});
  child.on('exit',async code=>{children.delete(job.id);if(job.status==='cancelled')return;job.status=code===0?'succeeded':'failed';job.finishedAt=new Date().toISOString();job.message=code===0?'Agent finished. Refreshing published frames.':`Agent exited with code ${code}`;await persistJob(job)});
}
async function persistJob(job:Job){await fs.writeFile(path.join(jobsDir,job.id,'job.json'),JSON.stringify(job,null,2),'utf8');}

const server=http.createServer(async(req,res)=>{try{
  if(req.method==='OPTIONS'){res.writeHead(204,{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type'});return res.end()}
  const u=new URL(req.url??'/',`http://${req.headers.host??'127.0.0.1'}`);
  if(req.method==='GET'&&u.pathname==='/api/health')return json(res,200,{ok:true});
  if(req.method==='GET'&&u.pathname==='/api/frames'){const out=[];for(const s of states){const f=await readFrame(s);if(f)out.push(f)}return json(res,200,out)}
  if(req.method==='GET'&&u.pathname==='/api/jobs'){return json(res,200,[...jobs.values()].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).slice(0,50))}
  if(req.method==='POST'&&u.pathname==='/api/jobs'){
    const body=await readJson(req); if(!validAgent(body.agent)||!Array.isArray(body.states)||!body.states.every(validState)||typeof body.prompt!=='string'||!body.prompt.trim())return json(res,422,{error:'agent, states and prompt are required'});
    const id=randomUUID(); const job:Job={id,agent:body.agent,states:body.states,prompt:body.prompt,device:typeof body.device==='string'?body.device:undefined,status:'queued',createdAt:new Date().toISOString(),message:'Queued'};
    jobs.set(id,job); await fs.mkdir(path.join(jobsDir,id),{recursive:true}); const deviceLine=job.device?`\n\n## Device contract\nTarget CSS viewport: ${job.device}. Use viewport-fit=cover and env(safe-area-inset-*) where appropriate. Do not draw device chrome inside the HTML.`:''; await fs.writeFile(path.join(jobsDir,id,'PROMPT.md'),body.prompt+deviceLine,'utf8'); await persistJob(job); void runJob(job); return json(res,201,job);
  }
  const jm=u.pathname.match(/^\/api\/jobs\/([^/]+)$/); if(jm&&req.method==='GET'){const j=jobs.get(jm[1]);return j?json(res,200,j):json(res,404,{error:'job not found'})}
  const cm=u.pathname.match(/^\/api\/jobs\/([^/]+)\/cancel$/); if(cm&&req.method==='POST'){const j=jobs.get(cm[1]);if(!j)return json(res,404,{error:'job not found'});j.status='cancelled';j.finishedAt=new Date().toISOString();j.message='Cancelled by user';children.get(j.id)?.kill('SIGTERM');await persistJob(j);return json(res,200,j)}
  const fm=u.pathname.match(/^\/api\/frames\/([^/]+)$/);
  if(fm&&req.method==='GET'){const f=await readFrame(fm[1]);return f?json(res,200,f):json(res,404,{error:'frame not found'})}
  if(fm&&req.method==='POST'){const s=fm[1];if(!validState(s))return json(res,400,{error:'invalid state'});const parsed=await readJson(req);if(typeof parsed.html!=='string')return json(res,422,{error:'html must be string'});await snapshot(s);await fs.writeFile(path.join(dir,`${s}.html`),parsed.html,'utf8');return json(res,201,await readFrame(s))}
  return json(res,404,{error:'not found'});
}catch(e){return json(res,500,{error:e instanceof Error?e.message:'unknown error'})}});
server.listen(port,'127.0.0.1',()=>console.error(`Aksa bridge: http://127.0.0.1:${port}`));
