import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { RevenueData } from '../../types.ts';

interface RevenueChartProps {
  data: RevenueData[];
  timeRange: 'weekly' | 'monthly' | 'annual';
}

export default function RevenueChart({ data, timeRange }: RevenueChartProps) {
  return (
    <div className="h-[400px] w-full bg-white dark:bg-slate-800 p-6 rounded-2xl border border-line dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Revenue Overview</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {timeRange === 'weekly' ? 'Daily earnings for the last 7 days' : 
             timeRange === 'monthly' ? 'Weekly earnings for the current month' : 
             'Monthly earnings for the current year'}
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-100 dark:border-emerald-800/50 uppercase tracking-wider">
            {timeRange}
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card-bg)',
              borderRadius: '12px',
              border: '1px solid var(--line)',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              padding: '12px'
            }}
            itemStyle={{ color: '#10B981', fontWeight: 'bold' }}
            labelStyle={{ color: 'var(--ink)', fontWeight: 'bold', marginBottom: '4px' }}
            cursor={{ stroke: '#10B981', strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#10B981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorAmount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
