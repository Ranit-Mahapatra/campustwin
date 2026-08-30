import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CampusProvider } from './context/CampusContext';
import AppLayout from './components/layout/AppLayout';
import DashboardView from './views/DashboardView';
import MapView from './views/MapView';
import ZonesView from './views/ZonesView';
import TrendsView from './views/TrendsView';
import SimulationView from './views/SimulationView';
import CopilotView from './views/CopilotView';
import AlertsView from './views/AlertsView';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CampusProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<DashboardView />} />
              <Route path="map" element={<MapView />} />
              <Route path="zones" element={<ZonesView />} />
              <Route path="trends" element={<TrendsView />} />
              <Route path="simulation" element={<SimulationView />} />
              <Route path="copilot" element={<CopilotView />} />
              <Route path="alerts" element={<AlertsView />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CampusProvider>
    </QueryClientProvider>
  );
}
