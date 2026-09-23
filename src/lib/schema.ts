import { z } from 'zod';

export const FrameStateSchema = z.enum(['idle','filled','positive','negative']);
export type FrameState = z.infer<typeof FrameStateSchema>;

export const AgentSchema = z.enum(['claude','codex','antigravity']);
export type Agent = z.infer<typeof AgentSchema>;

export const FrameSchema = z.object({state:FrameStateSchema,title:z.string(),html:z.string(),previousHtml:z.string().optional(),updatedAt:z.string()});
export const FrameListSchema = z.array(FrameSchema);
export type Frame = z.infer<typeof FrameSchema>;

export const JobStatusSchema = z.enum(['queued','running','succeeded','failed','cancelled']);
export type JobStatus = z.infer<typeof JobStatusSchema>;
export const JobSchema = z.object({
  id:z.string(), agent:AgentSchema, states:z.array(FrameStateSchema), prompt:z.string(), device:z.string().optional(), status:JobStatusSchema,
  createdAt:z.string(), startedAt:z.string().nullable().optional(), finishedAt:z.string().nullable().optional(),
  message:z.string().optional(), output:z.string().optional()
});
export type Job = z.infer<typeof JobSchema>;
export const JobListSchema = z.array(JobSchema);

export const PromptRequestSchema = z.object({agent:AgentSchema, prompt:z.string().min(1), states:z.array(FrameStateSchema).min(1), device:z.string().optional()});
