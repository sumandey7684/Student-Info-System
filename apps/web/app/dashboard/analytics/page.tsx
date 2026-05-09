'use client';

import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Sidebar } from '@/components/layout/sidebar';
import { apiClient } from '@/lib/api';

export default function AnalyticsPage() {
  const { data } = useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: async () => {
      const response = await apiClient.get('/analytics/dashboard-summary');
      return response.data.data ?? response.data;
    },
  });

  const chartData = [
    { metric: 'Students', value: data?.students ?? 0 },
    { metric: 'Teachers', value: data?.teachers ?? 0 },
    { metric: 'Attendance %', value: Number((data?.attendanceRate ?? 0).toFixed(2)) },
    { metric: 'Revenue', value: data?.revenue ?? 0 },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="mb-4 text-2xl font-bold">Analytics Dashboard</h1>
        <div className="h-80 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0f172a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}
