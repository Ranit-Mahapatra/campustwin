import React, { useState } from 'react';
import CopilotChatThread from '../components/copilot/CopilotChatThread';
import CopilotInputBar from '../components/copilot/CopilotInputBar';
import CopilotSuggestedChips from '../components/copilot/CopilotSuggestedChips';
import CopilotKnowledgeScope from '../components/copilot/CopilotKnowledgeScope';
import { useCampus } from '../context/CampusContext';
import { useCopilotMutation } from '../hooks/useCampusApi';

export default function CopilotView() {
  const { zones, roads } = useCampus();
  const copilotMutation = useCopilotMutation();

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am **CampusTwin Copilot**. I can analyze real-time microclimate observations, particulate pollution, transit corridors, and what-if digital twin simulations across SOA ITER Campus.'
    }
  ]);
  const [input, setInput] = useState('');

  const answerQuery = async (q) => {
    // Add user message immediately
    setMessages((prev) => [...prev, { sender: 'user', text: q }]);

    try {
      const serverAnswer = await copilotMutation.mutateAsync({ question: q });
      setMessages((prev) => [...prev, { sender: 'bot', text: serverAnswer }]);
    } catch {
      // Offline fallback NLP parsing
      const query = q.toLowerCase();
      let reply = '';

      if (query.includes('tree') || query.includes('green')) {
        const z = [...zones].sort((a, b) => a.treeCover - b.treeCover)[0];
        reply = `The top priority area for greening intervention is **${z.name} (${z.code})** with only **${z.treeCover}%** tree canopy cover and vulnerability score **${z.vulnerability}/10**.`;
      } else if (query.includes('air') || query.includes('pollution') || query.includes('pm')) {
        const z = [...zones].sort((a, b) => b.pm25 - a.pm25)[0];
        reply = `The highest recorded PM2.5 hotspot is **${z.name} (${z.code})** at **${z.pm25} µg/m³** (${z.aqi} AQI category).`;
      } else if (query.includes('risk') || query.includes('vulner')) {
        const z = [...zones].sort((a, b) => b.vulnerability - a.vulnerability)[0];
        reply = `The highest vulnerability score is in **${z.name} (${z.code})** at **${z.vulnerability}/10** due to ${z.reason.toLowerCase()}.`;
      } else if (query.includes('traffic') || query.includes('road') || query.includes('street')) {
        const r = [...roads].sort((a, b) => b.traffic - a.traffic)[0];
        reply = `The heaviest traffic corridor is **${r.name} (${r.id})** with **${r.traffic}%** congestion intensity and average transit speed of ${r.speed} km/h.`;
      } else if (query.includes('temperature') || query.includes('heat') || query.includes('hot')) {
        const z = [...zones].sort((a, b) => b.temp - a.temp)[0];
        reply = `The hottest modeled campus zone is **${z.name} (${z.code})** reaching **${z.temp}°C**.`;
      } else if (query.includes('evac') || query.includes('route') || query.includes('safe') || query.includes('emergency')) {
        reply = `The safest designated evacuation corridor connects **ITER Main Gate (Incident Origin)** along **CDS Road** to the **Central Library Courtyard (Primary Safe Assembly)**.`;
      } else {
        reply = `I can analyze real-time **air quality, traffic corridors, urban heat, green canopy cover, vulnerability ratings**, and **what-if digital twin simulations**. Try asking: "Which area needs trees?"`;
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    const q = input.trim();
    setInput('');
    answerQuery(q);
  };

  return (
    <div>
      <div className="view-header">
        <div className="view-title-group">
          <h2>CampusTwin Copilot Intelligence</h2>
          <p>Natural language spatial decision-support assistant cross-referencing real-time environmental observations, transit telemetry, and digital twin simulation models.</p>
        </div>
      </div>

      <div className="dashboard-layout">
        {/* Main Conversational Thread */}
        <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '520px' }}>
          <div className="panel-title">
            <span>Conversational Copilot Assistant</span>
            <span className="badge-pill badge-low">Online · 20 Zones Active</span>
          </div>

          <CopilotChatThread messages={messages} />
          <CopilotInputBar value={input} onChange={setInput} onSubmit={handleSend} />
        </div>

        {/* Suggested Queries and Knowledge Scope */}
        <div>
          <CopilotSuggestedChips onSelectQuery={answerQuery} />
          <CopilotKnowledgeScope />
        </div>
      </div>
    </div>
  );
}
