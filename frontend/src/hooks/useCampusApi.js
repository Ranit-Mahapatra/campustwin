import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchZones,
  fetchRoads,
  fetchCampusMetrics,
  fetchTrendData,
  postSimulation,
  postCopilotQuery
} from '../api/campusApi';
import { baselineZones } from '../data/baselineZones';
import { baselineRoads } from '../data/baselineRoads';
import { baselineTrendData } from '../data/baselineTrends';

export const QUERY_KEYS = {
  ZONES: ['campus', 'zones'],
  ROADS: ['campus', 'roads'],
  METRICS: ['campus', 'metrics'],
  TRENDS: (range) => ['campus', 'trends', range]
};

/**
 * Hook to query campus zones with automatic caching and baseline initialData.
 */
export function useZonesQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.ZONES,
    queryFn: fetchZones,
    initialData: baselineZones,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
}

/**
 * Hook to query transit corridors with automatic caching and baseline initialData.
 */
export function useRoadsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.ROADS,
    queryFn: fetchRoads,
    initialData: baselineRoads,
    staleTime: 1000 * 60 * 5
  });
}

/**
 * Hook to query aggregated campus telemetry metrics with background polling.
 */
export function useCampusMetricsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.METRICS,
    queryFn: fetchCampusMetrics,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60 // Poll every minute
  });
}

/**
 * Hook to query trend datasets for 24h or 7d.
 */
export function useTrendsQuery(range = '24h') {
  return useQuery({
    queryKey: QUERY_KEYS.TRENDS(range),
    queryFn: () => fetchTrendData(range),
    initialData: baselineTrendData[range] || baselineTrendData['24h'],
    staleTime: 1000 * 60 * 10
  });
}

/**
 * Hook to run digital-twin simulation mutation.
 */
export function useSimulateMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postSimulation,
    onSuccess: () => {
      // Invalidate relevant queries if needed
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.METRICS });
    }
  });
}

/**
 * Hook to post copilot natural language query.
 */
export function useCopilotMutation() {
  return useMutation({
    mutationFn: postCopilotQuery
  });
}
