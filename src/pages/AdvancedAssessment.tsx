import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Loader, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAgentChat, ChatMessage } from '../hooks/useAgentChat';

export default function AdvancedAssessment() {
  const navigate = useNavigate();
  const { apiProfile } = useApp();
  const {
    messages,
    isInitializing,
    isStreaming,
    isComplete,
    error,
    initialize,
    sendMessage,
  } = useAgentChat();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  // Initialize the agent session on mount
  useEffect(() => {
    if (apiProfile && !hasInitialized.current) {
      hasInitialized.current = true;
      initialize(apiProfile);
    }
  }, [apiProfile, initialize]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    sendMessage(input);
    setInput('');
  };

  const handleViewResults = () => {
    navigate('/advanced-results');
  };

  const renderMessage = (msg: ChatMessage, index: number) => (
    <motion.div
      key={msg.id}
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
        {msg.content}
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
            initialize(apiProfile);
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
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '600' }}>AI Assessment Assistant</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Interactive skill evaluation
          </p>
        </div>
      </div>

      <div
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

        {/* Error display */}
        {error && renderError()}

        {/* Messages */}
        <AnimatePresence>
          {messages.map((msg, index) => renderMessage(msg, index))}
        </AnimatePresence>

        {/* Typing indicator when streaming with no content yet */}
        {isStreaming && messages.length > 0 && !messages[messages.length - 1]?.content && renderTypingIndicator()}

        <div ref={messagesEndRef} />
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
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your response..."
            style={{
              flex: 1,
              padding: '14px 16px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '16px',
              outline: 'none',
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
    </div>
  );
}
