import path from 'node:path';
import fs from 'node:fs/promises';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const root=path.resolve(process.env.AKSA_AGENT_ROOT??'agent-workspace');
const frames=path.join(root,'frames');
const design=path.resolve('docs/design.md');
const prompt=path.resolve('docs/login-redesign-prompt.md');
const states=['idle','filled','positive','negative'] as const;
const agents=['claude','codex','antigravity'] as const;
const server=new Server({name:'aksa-html-canvas',version:'0.1.0'},{capabilities:{tools:{}}});
server.setRequestHandler(ListToolsRequestSchema,async()=>({tools:[
{name:'get_design_context',description:'Read the Aksa design.md source of truth.',inputSchema:{type:'object',properties:{}}},
{name:'get_login_prompt',description:'Read the master prompt for the four Login HTML states.',inputSchema:{type:'object',properties:{}}},
{name:'publish_frame_html',description:'Write one self-contained HTML preview to the frame workspace. Never modifies React.',inputSchema:{type:'object',properties:{state:{type:'string',enum:[...states]},html:{type:'string'}},required:['state','html']}},
{name:'get_frame_html',description:'Read one published HTML frame.',inputSchema:{type:'object',properties:{state:{type:'string',enum:[...states]}},required:['state']}},
{name:'list_frames',description:'List published preview frames.',inputSchema:{type:'object',properties:{}}},
{name:'create_generation_job',description:'Create a generation job for the local bridge. The bridge may run an explicitly configured agent adapter.',inputSchema:{type:'object',properties:{agent:{type:'string',enum:[...agents]},states:{type:'array',items:{type:'string',enum:[...states]}},prompt:{type:'string'}},required:['agent','states','prompt']}}
]}));
server.setRequestHandler(CallToolRequestSchema,async(req)=>{const name=req.params.name;const a=(req.params.arguments??{}) as Record<string,unknown>;
if(name==='get_design_context')return {content:[{type:'text',text:await fs.readFile(design,'utf8')}]};
if(name==='get_login_prompt')return {content:[{type:'text',text:await fs.readFile(prompt,'utf8')}]};
if(name==='publish_frame_html'){const state=String(a.state),html=String(a.html);if(!(states as readonly string[]).includes(state)||!html)return {isError:true,content:[{type:'text',text:'Invalid state or empty HTML'}]};const base=process.env.AKSA_BRIDGE_URL??'http://127.0.0.1:8787';const r=await fetch(`${base}/api/frames/${state}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({html})});if(!r.ok)return {isError:true,content:[{type:'text',text:await r.text()}]};return {content:[{type:'text',text:`Published ${state}. React source was not modified.`}]};}
if(name==='get_frame_html'){const state=String(a.state);if(!(states as readonly string[]).includes(state))return {isError:true,content:[{type:'text',text:'Invalid state'}]};try{return {content:[{type:'text',text:await fs.readFile(path.join(frames,`${state}.html`),'utf8')}]};}catch{return {isError:true,content:[{type:'text',text:`No ${state} frame.`}]};}}
if(name==='create_generation_job'){const agent=String(a.agent);const statesArg=Array.isArray(a.states)?a.states.map(String):[];const promptText=String(a.prompt??'');if(!(agents as readonly string[]).includes(agent)||!statesArg.every(s=>(states as readonly string[]).includes(s))||!promptText.trim())return {isError:true,content:[{type:'text',text:'Invalid generation job payload.'}]};const base=process.env.AKSA_BRIDGE_URL??'http://127.0.0.1:8787';const r=await fetch(`${base}/api/jobs`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({agent,states:statesArg,prompt:promptText})});return {content:[{type:'text',text:await r.text()}]};}
if(name==='list_frames'){const out=[];for(const state of states){try{const stat=await fs.stat(path.join(frames,`${state}.html`));out.push({state,exists:true,updatedAt:stat.mtime.toISOString()});}catch{out.push({state,exists:false})}}return {content:[{type:'text',text:JSON.stringify(out,null,2)}]};}
return {isError:true,content:[{type:'text',text:'Unknown tool'}]};});
await server.connect(new StdioServerTransport());
