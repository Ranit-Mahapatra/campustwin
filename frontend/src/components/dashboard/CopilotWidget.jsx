import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';

export default function CopilotWidget() {
  const { zones, roads } = useCampus();
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Ask me about traffic, air quality, heat, vulnerable zones or simulations.' },
    { sender: 'tip', text: 'Try: “Which area needs trees?”' }
  ]);
  const [question, setQuestion] = useState('');

  const answer = (q) => {
    const query = q.toLowerCase();
    let ans = '';

    if (query.includes('tree') || query.includes('green')) {
      const z = [...zones].sort((a, b) => a.treeCover - b.treeCover)[0];
      ans = `The priority area for green intervention is <b>${z.name}</b> with ${z.treeCover}% tree cover and vulnerability ${z.vulnerability}/10.`;
    } else if (query.includes('air') || query.includes('pollution') || query.includes('pm')) {
      const z = [...zones].sort((a, b) => b.pm25 - a.pm25)[0];
      ans = `The highest PM2.5 zone is <b>${z.name}</b> at ${z.pm25} µg/m³.`;
    } else if (query.includes('risk') || query.includes('vulner')) {
      const z = [...zones].sort((a, b) => b.vulnerability - a.vulnerability)[0];
      ans = `The highest vulnerability score is <b>${z.name}</b> at ${z.vulnerability}/10.`;
    } else if (query.includes('traffic') || query.includes('road')) {
      const r = [...roads].sort((a, b) => b.traffic - a.traffic)[0];
      ans = `The busiest modeled road is <b>${r.name}</b> with traffic intensity ${r.traffic}%.`;
    } else if (query.includes('temperature') || query.includes('heat')) {
      const z = [...zones].sort((a, b) => b.temp - a.temp)[0];
      ans = `The hottest modeled zone is <b>${z.name}</b> at ${z.temp}°C.`;
    } else {
      ans = `I can analyze <b>air quality, traffic, heat, green cover, risk</b> and the current what-if simulation.`;
    }

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: q },
      { sender: 'bot', text: ans }
    ]);
  };

  const handleAsk = (e) => {
    e?.preventDefault();
    if (!question.trim()) return;
    const q = question.trim();
    setQuestion('');
    answer(q);
  };

  return (
    <div
      className="panel-card"
      style={{
        background: 'linear-gradient(145deg, #0d252b, #0d1822)',
        borderColor: '#22545a',
        color: '#ffffff'
      }}
    >
      <div className="panel-title" style={{ color: '#5de2d0' }}>
        <span>Campus Copilot</span>
      </div>

      <div
        id="chat"
        style={{
          height: '110px',
          overflowY: 'auto',
          color: '#8ba6b4',
          fontSize: '11px',
          lineHeight: 1.5,
          marginBottom: '8px',
          paddingRight: '4px'
        }}
      >
        {messages.map((m, idx) => (
          <p key={idx} style={{ margin: '0 0 6px' }}>
            <strong style={{ color: m.sender === 'user' ? '#ffffff' : 'var(--cyan)' }}>
              {m.sender === 'user' ? 'You:' : m.sender === 'tip' ? 'Try:' : 'CampusTwin:'}
            </strong>{' '}
            <span dangerouslySetInnerHTML={{ __html: m.text }} />
          </p>
        ))}
      </div>

      <form onSubmit={handleAsk} style={{ display: 'flex', gap: '6px' }}>
        <input
          id="question"
          type="text"
          placeholder="Ask CampusTwin…"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid #1e454d', background: '#0a1a24', color: '#ffffff', fontSize: '11px' }}
        />
        <button
          type="submit"
          id="ask"
          className="btn-primary"
          style={{ padding: '0 12px', fontSize: '11px' }}
        >
          Ask
        </button>
      </form>
    </div>
  );
}
