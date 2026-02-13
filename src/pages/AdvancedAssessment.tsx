import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigateWithParams } from '../hooks/useNavigateWithParams';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Loader, AlertCircle, Clock, ArrowLeft, Eye, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAgentChat, ChatMessage } from '../hooks/useAgentChat';
import SEOHead from '../components/SEOHead';
import { trackAssessmentStart } from '../lib/analytics';
import MarkdownRenderer from '../components/ui/MarkdownRenderer';
import AutoExpandingTextarea from '../components/ui/AutoExpandingTextarea';
import { Modal } from '../components/ui';

interface LocationState {
  selectedSkillCodes?: string[];
  resumeSessionId?: number;
}

export default function AdvancedAssessment() {
  const navigate = useNavigateWithParams();
  const location = useLocation();
  const { apiProfile, setAdvancedSessionId } = useApp();
  const locationState = location.state as LocationState | null;
  const selectedSkillCodes = locationState?.selectedSkillCodes;
  const {
    messages,
    isInitializing,
    isStreaming,
    isComplete,
    isResumed,
    sessionId,
    cooldownEndsAt,
    error,
    initialize,
    sendMessage,
    endAssessment,
  } = useAgentChat();

  const [input, setInput] = useState('');
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const latestBotMessageRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const prevMessagesLength = useRef(0);
  const wasStreaming = useRef(false);

  // Initialize the agent session on mount
  useEffect(() => {
    if (apiProfile && !hasInitialized.current) {
      hasInitialized.current = true;
      trackAssessmentStart('advanced');
      initialize(apiProfile, selectedSkillCodes);
    }
  }, [apiProfile, initialize, selectedSkillCodes]);

  // Store sessionId in context when it's set
  useEffect(() => {
    if (sessionId) {
      setAdvancedSessionId(sessionId);
    }
  }, [sessionId, setAdvancedSessionId]);

  // Smart scroll behavior
  const isNearBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return true;
    const threshold = 100;
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const newBotMessageStarted =
      messages.length > prevMessagesLength.current &&
      messages[messages.length - 1]?.type === 'bot';

    // When a new bot message starts streaming, scroll to the top of that message
    if (newBotMessageStarted && latestBotMessageRef.current) {
      latestBotMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // When streaming ends and user is near bottom, scroll to bottom
    else if (wasStreaming.current && !isStreaming && isNearBottom()) {
      container.scrollTop = container.scrollHeight;
    }

    prevMessagesLength.current = messages.length;
    wasStreaming.current = isStreaming;
  }, [messages, isStreaming, isNearBottom]);

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    sendMessage(input);
    setInput('');
  };

  const handleViewResults = () => {
    navigate('/advanced-results', { state: { sessionId } });
  };

  const renderMessage = (msg: ChatMessage, index: number, isLatestBot: boolean) => (
    <motion.div
      key={msg.id}
      ref={isLatestBot ? latestBotMessageRef : undefined}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
        flexDirection: msg.type === 'user' ? 'row-reverse' : 'row',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: msg.type === 'user' ? 'var(--surface-light)' : 'var(--gradient-1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {msg.type === 'user' ? <User size={18} /> : <Bot size={18} color="white" />}
      </div>
      <div
        style={{
          maxWidth: '70%',
          padding: '14px 18px',
          borderRadius: msg.type === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          background: msg.type === 'user' ? 'var(--primary)' : 'var(--surface)',
          color: 'var(--text-primary)',
          lineHeight: '1.5',
        }}
      >
        {msg.type === 'bot' ? <MarkdownRenderer content={msg.content} /> : msg.content}
        {msg.isStreaming && (
          <span
            style={{
              display: 'inline-block',
              width: '2px',
              height: '1em',
              background: 'var(--text-primary)',
              marginLeft: '2px',
              animation: 'blink 1s infinite',
            }}
          />
        )}
      </div>
    </motion.div>
  );

  const renderTypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'var(--gradient-1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Bot size={18} color="white" />
      </div>
      <div
        style={{
          padding: '14px 18px',
          borderRadius: '16px 16px 16px 4px',
          background: 'var(--surface)',
        }}
      >
        <div style={{ display: 'flex', gap: '4px' }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--text-muted)',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );

  const formatCooldownDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const renderCooldown = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        gap: '24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(245, 158, 11, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Clock size={36} color="var(--accent)" />
      </div>
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
          Assessment Cooldown Active
        </h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '400px' }}>
          You recently completed an assessment. Your next assessment will be available on:
        </p>
        <p style={{ color: 'var(--primary-light)', fontSize: '18px', fontWeight: '600', marginTop: '12px' }}>
          {cooldownEndsAt && formatCooldownDate(cooldownEndsAt)}
        </p>
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
        <button
          onClick={() => navigate('/assessment-choice')}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={18} />
          Go Back
        </button>
        <button
          onClick={() => navigate('/advanced-results')}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Eye size={18} />
          View Results
        </button>
      </div>
    </motion.div>
  );

  const renderError = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        padding: '16px',
        background: 'var(--surface)',
        borderRadius: '12px',
        border: '1px solid var(--error, #ef4444)',
      }}
    >
      <AlertCircle size={20} color="var(--error, #ef4444)" />
      <div style={{ flex: 1 }}>
        <p style={{ color: 'var(--error, #ef4444)', marginBottom: '4px' }}>
          Something went wrong
        </p>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{error}</p>
      </div>
      <button
        onClick={() => {
          if (apiProfile) {
            hasInitialized.current = false;
            initialize(apiProfile, selectedSkillCodes);
          }
        }}
        className="btn-secondary"
        style={{ padding: '8px 16px' }}
      >
        Retry
      </button>
    </motion.div>
  );

  return (
    <div
      className="chat-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '24px',
      }}
    >
      <SEOHead />
      {/* Add keyframes for cursor blink animation */}
      <style>
        {`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `}
      </style>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--gradient-1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Sparkles size={24} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600' }}>AI Assessment Assistant</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Interactive skill evaluation
          </p>
        </div>
        {!isComplete && !isInitializing && !cooldownEndsAt && (
          <button
            onClick={() => setShowEndConfirmation(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              borderRadius: '8px',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'var(--surface-light)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
          >
            <X size={14} />
            End Assessment
          </button>
        )}
      </div>

      <div
        ref={messagesContainerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          paddingRight: '8px',
        }}
      >
        {/* Loading state during initialization */}
        {isInitializing && messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '48px',
              gap: '16px',
            }}
          >
            <Loader
              size={32}
              style={{
                animation: 'spin 1s linear infinite',
              }}
            />
            <p style={{ color: 'var(--text-muted)' }}>Starting your assessment...</p>
            <style>
              {`
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
              `}
            </style>
          </motion.div>
        )}

        {/* Cooldown display */}
        {cooldownEndsAt && renderCooldown()}

        {/* Error display (only show if not a cooldown error) */}
        {error && !cooldownEndsAt && renderError()}

        {/* Resume indicator */}
        {isResumed && messages.length === 0 && !isInitializing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--gradient-1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Bot size={18} color="white" />
            </div>
            <div
              style={{
                padding: '14px 18px',
                borderRadius: '16px 16px 16px 4px',
                background: 'var(--surface)',
                color: 'var(--text-primary)',
                lineHeight: '1.5',
              }}
            >
              Welcome back! I see you have an assessment in progress. Type a message to continue where you left off.
            </div>
          </motion.div>
        )}

        {/* Messages */}
        <AnimatePresence>
          {messages.map((msg, index) => {
            const isLatestBot =
              msg.type === 'bot' &&
              index === messages.length - 1 ||
              (index === messages.length - 2 && messages[messages.length - 1]?.type === 'user');
            return renderMessage(msg, index, isLatestBot && msg.type === 'bot');
          })}
        </AnimatePresence>

        {/* Typing indicator when streaming with no content yet */}
        {isStreaming && messages.length > 0 && !messages[messages.length - 1]?.content && renderTypingIndicator()}
      </div>

      {isComplete ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: '24px' }}
        >
          <button
            onClick={handleViewResults}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '16px' }}
          >
            <Sparkles size={20} />
            View Your Detailed Results
          </button>
        </motion.div>
      ) : (
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '24px',
            padding: '4px',
            paddingBottom: 'env(safe-area-inset-bottom, 4px)',
            background: 'var(--surface)',
            borderRadius: '16px',
            border: '1px solid var(--border)',
          }}
        >
          <AutoExpandingTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onSubmit={handleSend}
            placeholder="Type your response..."
            minHeight={48}
            maxHeight={150}
            style={{
              flex: 1,
              padding: '14px 16px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '16px',
              outline: 'none',
              fontFamily: 'inherit',
            }}
            disabled={isStreaming || isInitializing}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming || isInitializing}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background:
                input.trim() && !isStreaming && !isInitializing
                  ? 'var(--gradient-1)'
                  : 'var(--surface-light)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: input.trim() && !isStreaming && !isInitializing ? 1 : 0.5,
            }}
          >
            {isStreaming || isInitializing ? (
              <Loader size={20} />
            ) : (
              <Send size={20} color="white" />
            )}
          </button>
        </div>
      )}

      <Modal
        isOpen={showEndConfirmation}
        onClose={() => setShowEndConfirmation(false)}
        title="End Assessment Early?"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Completing the full assessment helps us create a more accurate and contextual learning plan tailored to your needs. Are you sure you want to end now?
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              onClick={() => setShowEndConfirmation(false)}
              className="btn-primary"
              style={{ flex: 1 }}
            >
              Continue Assessment
            </button>
            <button
              onClick={async () => {
                setShowEndConfirmation(false);
                const success = await endAssessment();
                if (success) {
                  navigate('/advanced-results', { state: { sessionId } });
                }
              }}
              className="btn-secondary"
              style={{ flex: 1, color: 'var(--error)' }}
            >
              End &amp; View Results
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
