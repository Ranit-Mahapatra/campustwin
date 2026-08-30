import React, { useEffect, useRef } from 'react';
import { Bot, User } from 'lucide-react';

export default function CopilotChatThread({ messages }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '10px 4px', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '340px', maxHeight: '460px' }}>
      {messages.map((m, idx) => {
        const isUser = m.sender === 'user';
        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              gap: '8px',
              alignSelf: isUser ? 'flex-end' : 'flex-start',
              maxWidth: '85%'
            }}
          >
            {!isUser && (
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#087f76', color: '#ffffff', display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: '2px' }}>
                <Bot size={16} />
              </div>
            )}

            <div
              style={{
                background: isUser ? '#1e3945' : '#f0fbf9',
                color: isUser ? '#ffffff' : 'var(--text)',
                border: isUser ? 'none' : '1px solid #c2e9e3',
                padding: '10px 14px',
                borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                fontSize: '13px',
                lineHeight: 1.5,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ fontSize: '10px', color: isUser ? '#93c5fd' : 'var(--cyan)', fontWeight: 800, marginBottom: '2px' }}>
                {isUser ? 'You' : 'CampusTwin Copilot'}
              </div>
              <span dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
            </div>

            {isUser && (
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#334155', color: '#ffffff', display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: '2px' }}>
                <User size={16} />
              </div>
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
