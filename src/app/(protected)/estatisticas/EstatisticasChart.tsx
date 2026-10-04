'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export type ChartDatum = {
  name: string;
  totalBudget: number;
  executed: number;
};

export default function EstatisticasChart({ data }: { data: ChartDatum[] }) {
  const chartData = data.map((sub) => ({
    name: sub.name.length > 15 ? `${sub.name.slice(0, 15)}…` : sub.name,
    'Orçamento': sub.totalBudget,
    'Executado': sub.executed,
  }));

  return (
    <div style={{ height: '400px', width: '100%', marginTop: '1rem' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
          <Tooltip 
            cursor={{fill: 'rgba(0,0,0,0.02)'}}
            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}
          />
          <Legend wrapperStyle={{paddingTop: '20px'}} />
          <Bar dataKey="Orçamento" fill="#94a3b8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Executado" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
