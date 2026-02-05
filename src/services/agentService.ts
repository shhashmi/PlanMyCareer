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
} from '../types/api.types';
import { getTopCompetencies } from '../utils/profileUtils';
import { buildUrlWithParams } from '../utils/queryParamStore';

const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'https://api.aifluens.com/api';

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
 * Only includes top 4 competencies by priority (lower priority number = higher importance)
 */
export function buildInitializeRequest(apiProfile: FluencyProfileResponse): AgentInitializeRequest {
  const track = mapRoleToTrack(apiProfile.metadata.role);
  const experience = apiProfile.metadata.experience;

  // Get top 4 competencies by priority
  const topCompetencies = getTopCompetencies(apiProfile.profile);

  const fluencies: AgentFluencyInput[] = topCompetencies.map((skill) => ({
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

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Initialize failed: ${response.status}`);
  }

  const json = await response.json();
  // API returns { status: "success", data: { thread_id: "..." } }
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

export const agentService = {
  initialize,
  streamChat,
  buildInitializeRequest,
};

export default agentService;
