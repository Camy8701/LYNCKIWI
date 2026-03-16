import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Skeleton } from '@/components/ui/skeleton';
import {
  getLeadsTrend,
  getConversionByService,
  getRevenueTrend,
  getTopCities,
  getAnalyticsSummary,
  type LeadTrendData,
  type ServiceConversionData,
  type RevenueData,
  type CityPerformanceData,
} from '@/lib/database';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Helper function to format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Helper function to calculate percentage change
function calculateChange(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? '+100%' : '0%';
  const change = ((current - previous) / previous) * 100;
  return change >= 0 ? `+${change.toFixed(0)}%` : `${change.toFixed(0)}%`;
}

// Time range type
type TimeRange = 7 | 14 | 30 | 90;

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>(30);

  const [leadsTrend, setLeadsTrend] = useState<LeadTrendData[]>([]);
  const [conversionData, setConversionData] = useState<ServiceConversionData[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<RevenueData[]>([]);
  const [topCities, setTopCities] = useState<CityPerformanceData[]>([]);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    async function loadAnalyticsData() {
      setLoading(true);
      try {
        const [leads, conversions, revenue, cities, summaryData] = await Promise.all([
          getLeadsTrend(timeRange),
          getConversionByService(),
          getRevenueTrend(timeRange),
          getTopCities(10),
          getAnalyticsSummary(),
        ]);

        setLeadsTrend(leads);
        setConversionData(conversions);
        setRevenueTrend(revenue);
        setTopCities(cities);
        setSummary(summaryData);
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAnalyticsData();
  }, [timeRange]);

  // Format date for chart display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(language === 'de' ? 'de-DE' : 'en-US', {
      day: '2-digit',
      month: 'short',
    }).format(date);
  };

  // Custom tooltip styles
  const tooltipStyle = {
    backgroundColor: 'rgba(17, 17, 17, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '8px 12px',
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 md:p-8">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-64 mb-8" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  const leadsChange = summary ? calculateChange(summary.leadsLast30 || 0, summary.leadsPrevious30 || 0) : '0%';
  const revenueChange = summary ? calculateChange(summary.revenueLast30 || 0, summary.revenuePrevious30 || 0) : '0%';
  const totalLeads = leadsTrend.reduce((sum, d) => sum + d.count, 0);
  const totalRevenue = revenueTrend.reduce((sum, d) => sum + d.revenue, 0);
  const avgConversionRate = conversionData.length > 0
    ? Math.round(conversionData.reduce((sum, d) => sum + d.rate, 0) / conversionData.length)
    : 0;

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-instrument-serif text-foreground mb-2">
              {'Analytics'}
            </h1>
            <p className="text-muted-foreground">
              {'Detailed insights into your lead performance'}
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-lg p-1">
            {([7, 14, 30, 90] as TimeRange[]).map((days) => (
              <button
                key={days}
                onClick={() => setTimeRange(days)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  timeRange === days
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {days}d
              </button>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Leads */}
          <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6">
            <div className="text-muted-foreground text-sm font-medium mb-1">
              {'Total Leads'} ({timeRange}d)
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {totalLeads}
            </div>
            <div className={`text-xs font-medium ${
              leadsChange.startsWith('+') ? 'text-primary' : 'text-destructive'
            }`}>
              {leadsChange} {'vs. previous'}
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6">
            <div className="text-muted-foreground text-sm font-medium mb-1">
              {'Total Revenue'} ({timeRange}d)
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {formatCurrency(totalRevenue)}
            </div>
            <div className={`text-xs font-medium ${
              revenueChange.startsWith('+') ? 'text-primary' : 'text-destructive'
            }`}>
              {revenueChange} {'vs. previous'}
            </div>
          </div>

          {/* Avg Conversion Rate */}
          <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6">
            <div className="text-muted-foreground text-sm font-medium mb-1">
              {'Avg Conversion Rate'}
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {avgConversionRate}%
            </div>
            <div className="text-xs text-muted-foreground">
              {'across all services'}
            </div>
          </div>

          {/* Top City */}
          <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6">
            <div className="text-muted-foreground text-sm font-medium mb-1">
              {'Top City'}
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {topCities[0]?.city || '-'}
            </div>
            <div className="text-xs text-muted-foreground">
              {topCities[0]?.leads || 0} {'Leads'}
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leads Trend Chart */}
          <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              {'Leads Trend'}
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={leadsTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fontSize: 11 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelFormatter={formatDate}
                    formatter={(value: number) => [value, 'Leads']}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#22c55e' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Trend Chart */}
          <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              {'Revenue Trend'}
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fontSize: 11 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value) => `€${value}`}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelFormatter={formatDate}
                    formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#22c55e"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Conversion by Service Chart */}
          <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              {'Conversion Rate by Service'}
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conversionData.slice(0, 8)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fontSize: 11 }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value: number, name: string) => {
                      if (name === 'rate') return [`${value}%`, 'Conversion Rate'];
                      return [value, name];
                    }}
                  />
                  <Bar
                    dataKey="rate"
                    fill="#22c55e"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Cities Chart */}
          <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              {'Top Cities by Leads'}
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topCities.slice(0, 8)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    type="number"
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="city"
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fontSize: 11 }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value: number, name: string) => {
                      if (name === 'leads') return [value, 'Leads'];
                      if (name === 'revenue') return [formatCurrency(value), 'Revenue'];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="leads"
                    fill="#22c55e"
                    name={'Leads'}
                    radius={[0, 4, 4, 0]}
                    maxBarSize={15}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Service Stats Table */}
        <div className="mt-8 bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/[0.06]">
            <h2 className="text-xl font-semibold text-foreground mb-1">
              {'Service Statistics'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {'Detailed breakdown by service category'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/[0.02] border-b border-white/[0.06]">
                <tr>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase">
                    {'Service'}
                  </th>
                  <th className="text-right py-3 px-6 text-xs font-medium text-muted-foreground uppercase">
                    {'Total Leads'}
                  </th>
                  <th className="text-right py-3 px-6 text-xs font-medium text-muted-foreground uppercase">
                    {'Converted'}
                  </th>
                  <th className="text-right py-3 px-6 text-xs font-medium text-muted-foreground uppercase">
                    {'Conversion Rate'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {conversionData.map((service) => (
                  <tr key={service.name} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <span className="text-sm font-medium text-foreground">
                        {service.name}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-sm text-muted-foreground">
                        {service.total}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-sm text-muted-foreground">
                        {service.converted}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        service.rate >= 50
                          ? 'bg-primary/10 text-primary'
                          : service.rate >= 25
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-white/[0.05] text-muted-foreground'
                      }`}>
                        {service.rate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
