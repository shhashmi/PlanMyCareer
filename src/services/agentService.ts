/**
 * Agent Service
 * Handles communication with the agentic assessment API endpoints
 */

import type {
  AgentInitializeRequest,
  AgentInitializeResponse,
  AgentChatRequest,
  AgentSSEEvent,
  FluencyProfileResponse,
  CareerTrack,
  AgentFluencyInput,
  AdvancedAssessmentStatusResponse,
  AdvancedAssessmentResultsResponse,
  UpskillPlanResponse,
  UpskillPlanUpdateRequest,
  UpskillPlanMarkItemsResponse,
} from '../types/api.types';
import { getTopCompetencies } from '../utils/profileUtils';
import { buildUrlWithParams } from '../utils/queryParamStore';
import api from './api';

const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'https://api.aifluens.com/api';

/**
 * Error thrown when user is in cooldown period after completing an assessment
 */
export class CooldownActiveError extends Error {
  cooldown_ends_at: string;
  constructor(message: string, cooldownEndsAt: string) {
    super(message);
    this.name = 'CooldownActiveError';
    this.cooldown_ends_at = cooldownEndsAt;
  }
}

/**
 * Map role string to CareerTrack
 */
function mapRoleToTrack(role: string): CareerTrack {
  const roleLower = role.toLowerCase();
  if (roleLower.includes('product manager') || roleLower === 'pm') {
    return 'PM';
  }
  if (roleLower.includes('engineering manager') || roleLower === 'em') {
    return 'EM';
  }
  // Default to SE for software engineer and others
  return 'SE';
}

/**
 * Build AgentInitializeRequest from FluencyProfileResponse
 * Uses selected skill codes if provided, otherwise falls back to top 4 competencies by priority
 */
export function buildInitializeRequest(
  apiProfile: FluencyProfileResponse,
  selectedSkillCodes?: string[]
): AgentInitializeRequest {
  const track = mapRoleToTrack(apiProfile.metadata.role);
  const experience = apiProfile.metadata.experience;

  // Use selected codes if provided, otherwise fallback to top 4
  const competencies = selectedSkillCodes
    ? apiProfile.profile.filter(s => selectedSkillCodes.includes(s.code))
    : getTopCompetencies(apiProfile.profile);

  const fluencies: AgentFluencyInput[] = competencies.map((skill) => ({
    code: skill.code,
    name: skill.name,
    target_level: skill.proficiency.toLowerCase() as AgentFluencyInput['target_level'],
  }));

  return { track, experience, fluencies };
}

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onStatus: (status: string) => void;
  onDone: (content: string, assessmentId?: string, assessmentComplete?: boolean) => void;
  onError: (error: string) => void;
}

/**
 * Initialize an agent session
 * Returns full response including session_id and resumed flag
 * Throws CooldownActiveError if user is in cooldown period
 */
export async function initialize(request: AgentInitializeRequest): Promise<AgentInitializeResponse> {
  const url = buildUrlWithParams(`${API_BASE_URL}/v1/agent/initialize`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(request),
  });

  // Handle cooldown error (409)
  if (response.status === 409) {
    const errorData = await response.json();
    throw new CooldownActiveError(errorData.message, errorData.cooldown_ends_at);
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Initialize failed: ${response.status}`);
  }

  const json = await response.json();
  // API returns { status: "success", data: { thread_id, session_id, resumed? } }
  return json.data;
}

/**
 * Stream chat messages from the agent
 * Returns an AbortController to cancel the stream
 */
export function streamChat(
  request: AgentChatRequest,
  callbacks: StreamCallbacks,
): AbortController {
  const controller = new AbortController();
  const url = buildUrlWithParams(`${API_BASE_URL}/v1/agent/chat`);

  (async () => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        callbacks.onError(errorData.message || `Chat failed: ${response.status}`);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        callbacks.onError('No response body');
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE events (separated by double newlines)
        const events = buffer.split('\n\n');
        buffer = events.pop() || ''; // Keep incomplete event in buffer

        for (const event of events) {
          if (!event.trim()) continue;

          // Parse SSE format: "data: {...}"
          const lines = event.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6);
              try {
                const data: AgentSSEEvent = JSON.parse(jsonStr);

                switch (data.type) {
                  case 'token':
                    callbacks.onToken(data.content);
                    break;
                  case 'status':
                    callbacks.onStatus(data.content);
                    break;
                  case 'done':
                    callbacks.onDone(data.content, data.assessmentId, data.assessmentComplete);
                    break;
                  case 'error':
                    callbacks.onError(data.content);
                    break;
                }
              } catch (parseError) {
                console.error('Failed to parse SSE event:', jsonStr, parseError);
              }
            }
          }
        }
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        // Stream was cancelled, not an error
        return;
      }
      callbacks.onError((error as Error).message || 'Stream error');
    }
  })();

  return controller;
}

/** GET /api/v1/agent/assessments — get current assessment status */
export async function getAssessmentStatus(): Promise<AdvancedAssessmentStatusResponse> {
  const response = await api.get('/v1/agent/assessments');
  return response.data;
}

/** GET /api/v1/agent/assessments/:sessionId/results — get results + transcript */
export async function getAssessmentResults(sessionId: number): Promise<AdvancedAssessmentResultsResponse> {
  const response = await api.get(`/v1/agent/assessments/${sessionId}/results`);
  return response.data;
}

/** POST /api/v1/agent/assessments/:sessionId/reset — reset in-progress assessment */
export async function resetAssessment(sessionId: number): Promise<{ status: string; message: string }> {
  const response = await api.post(`/v1/agent/assessments/${sessionId}/reset`);
  return response.data;
}

/** POST /api/v1/agent/assessments/:sessionId/upskill-plan — Create plan */
export async function createUpskillPlan(sessionId: number): Promise<{ data: UpskillPlanResponse }> {
  const response = await api.post(`/v1/agent/assessments/${sessionId}/upskill-plan`);
  return response.data;
}

/** GET /api/v1/agent/assessments/:sessionId/upskill-plan — Get plan */
export async function getUpskillPlan(sessionId: number): Promise<{ data: UpskillPlanResponse }> {
  const response = await api.get(`/v1/agent/assessments/${sessionId}/upskill-plan`);
  return response.data;
}

/** PATCH /api/v1/agent/assessments/:sessionId/upskill-plan — Update plan (deactivate) */
export async function updateUpskillPlan(sessionId: number, data: UpskillPlanUpdateRequest): Promise<{ data: UpskillPlanResponse }> {
  const response = await api.patch(`/v1/agent/assessments/${sessionId}/upskill-plan`, data);
  return response.data;
}

/** PATCH /api/v1/agent/assessments/:sessionId/upskill-plan/items — Bulk mark items done */
export async function markPlanItemsDone(sessionId: number, itemIds: number[]): Promise<UpskillPlanMarkItemsResponse> {
  const response = await api.patch(`/v1/agent/assessments/${sessionId}/upskill-plan/items`, { item_ids: itemIds });
  return response.data;
}

export const agentService = {
  initialize,
  streamChat,
  buildInitializeRequest,
  getAssessmentStatus,
  getAssessmentResults,
  resetAssessment,
  createUpskillPlan,
  getUpskillPlan,
  updateUpskillPlan,
  markPlanItemsDone,
};

export default agentService;
