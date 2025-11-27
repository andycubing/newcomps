import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { WCACompetition, COUNTRY_NAMES, COUNTRY_EMOJIS } from '../types';

interface StatsChartProps {
  competitions: WCACompetition[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00C49F', '#FFBB28', '#FF8042', '#a05195', '#d45087'];

const StatsChart: React.FC<StatsChartProps> = ({ competitions }) => {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    competitions.forEach(comp => {
      const code = comp.country_iso2;
      counts[code] = (counts[code] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([code, count]) => ({
        name: code,
        fullName: COUNTRY_NAMES[code] || code,
        emoji: COUNTRY_EMOJIS[code] || '',
        count
      }))
      .sort((a, b) => b.count - a.count);
  }, [competitions]);

  if (data.length === 0) return null;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const countryData = data.find(d => d.name === label);
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
          <p className="font-semibold text-gray-800">
            {countryData?.emoji} {countryData?.fullName}
          </p>
          <p className="text-blue-600">
            {payload[0].value} Competition{payload[0].value !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 bg-white rounded-xl shadow-sm p-4 mb-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Competitions by Region</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: -20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            tick={{fontSize: 12, fill: '#64748b'}} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{fontSize: 12, fill: '#64748b'}} 
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsChart;
