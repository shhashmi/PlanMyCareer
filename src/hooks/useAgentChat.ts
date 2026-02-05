/**
 * useAgentChat Hook
 * Manages state and interactions for the agentic assessment chat
 */

import { useState, useRef, useCallback } from 'react';
import { agentService, buildInitializeRequest } from '../services/agentService';
import type { FluencyProfileResponse, AgentConversationMessage } from '../types/api.types';

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface UseAgentChatReturn {
  messages: ChatMessage[];
  isInitializing: boolean;
  isStreaming: boolean;
  isComplete: boolean;
  assessmentId: string | null;
  error: string | null;
  initialize: (apiProfile: FluencyProfileResponse) => Promise<boolean>;
  sendMessage: (message: string) => void;
  reset: () => void;
}

export function useAgentChat(): UseAgentChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Refs to avoid stale closures
  const threadIdRef = useRef<string | null>(null);
  const conversationHistoryRef = useRef<AgentConversationMessage[]>([]);
  const streamingContentRef = useRef<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateMessageId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  /**
   * Initialize the agent session and send the first message
   */
  const initialize = useCallback(async (apiProfile: FluencyProfileResponse): Promise<boolean> => {
    setIsInitializing(true);
    setError(null);

    try {
      const request = buildInitializeRequest(apiProfile);
      const response = await agentService.initialize(request);
      threadIdRef.current = response.thread_id;

      // Send the initial "Start assessment" message
      sendMessageInternal('Start assessment');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize assessment';
      setError(errorMessage);
      setIsInitializing(false);
      return false;
    }
  }, []);

  /**
   * Internal send message that handles streaming
   */
  const sendMessageInternal = useCallback((message: string) => {
    if (!threadIdRef.current) {
      setError('Session not initialized');
      return;
    }

    // Add user message to UI (skip for "Start assessment" as it's automatic)
    if (message !== 'Start assessment') {
      const userMessage: ChatMessage = {
        id: generateMessageId(),
        type: 'user',
        content: message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
    }

    // Add to conversation history
    conversationHistoryRef.current.push({
      role: 'user',
      content: message,
    });

    // Create placeholder for bot response
    const botMessageId = generateMessageId();
    streamingContentRef.current = '';

    setMessages((prev) => [
      ...prev,
      {
        id: botMessageId,
        type: 'bot',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      },
    ]);

    setIsStreaming(true);
    setIsInitializing(false);
    setError(null);

    const request = {
      message,
      thread_id: threadIdRef.current,
      conversation_history: conversationHistoryRef.current.slice(0, -1), // Exclude current message
    };

    abortControllerRef.current = agentService.streamChat(request, {
      onToken: (token: string) => {
        streamingContentRef.current += token;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? { ...msg, content: streamingContentRef.current }
              : msg
          )
        );
      },
      onStatus: (status: string) => {
        console.log('Agent status:', status);
      },
      onDone: (content: string, assessmentIdResult?: string, assessmentComplete?: boolean) => {
        // Finalize the message
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? { ...msg, content, isStreaming: false }
              : msg
          )
        );

        // Only add to conversation history if content is non-empty
        if (content && content.trim().length > 0) {
          conversationHistoryRef.current.push({
            role: 'assistant',
            content,
          });
        }

        setIsStreaming(false);

        if (assessmentIdResult) {
          setAssessmentId(assessmentIdResult);
        }

        if (assessmentComplete) {
          setIsComplete(true);
        }
      },
      onError: (errorMsg: string) => {
        setError(errorMsg);
        setIsStreaming(false);
        // Remove the placeholder message on error - do NOT add to conversation history
        setMessages((prev) => prev.filter((msg) => msg.id !== botMessageId));
      },
    });
  }, []);

  /**
   * Public send message method
   */
  const sendMessage = useCallback((message: string) => {
    if (!message.trim() || isStreaming) return;
    sendMessageInternal(message);
  }, [isStreaming, sendMessageInternal]);

  /**
   * Reset the chat state
   */
  const reset = useCallback(() => {
    // Abort any ongoing stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Clear all state
    setMessages([]);
    setIsInitializing(false);
    setIsStreaming(false);
    setIsComplete(false);
    setAssessmentId(null);
    setError(null);

    // Clear refs
    threadIdRef.current = null;
    conversationHistoryRef.current = [];
    streamingContentRef.current = '';
  }, []);

  return {
    messages,
    isInitializing,
    isStreaming,
    isComplete,
    assessmentId,
    error,
    initialize,
    sendMessage,
    reset,
  };
}

export default useAgentChat;
