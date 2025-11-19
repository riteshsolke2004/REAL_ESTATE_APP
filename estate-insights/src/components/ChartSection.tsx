import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  ComposedChart
} from "recharts";
import { TrendingUp, BarChart3, Activity, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChartDataPoint {
  year: number;
  totalSales: number;
  totalSold: number;
  flatRate: number;
  officeRate?: number;
  shopRate?: number;
  carpetArea?: number;
}

interface ChartSectionProps {
  chartData: ChartDataPoint[];
  area: string;
}

const ChartSection = ({ chartData, area }: ChartSectionProps) => {
  const [activeChart, setActiveChart] = useState<'line' | 'bar' | 'area' | 'composed'>('composed');

  if (!chartData || chartData.length === 0) {
    return (
      <Card className="border-2 border-dashed border-border bg-muted/20">
        <CardContent className="py-16">
          <div className="text-center">
            <Activity className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Chart Data</h3>
            <p className="text-sm text-muted-foreground">Chart visualization will appear here once data is loaded</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate statistics
  const latestData = chartData[chartData.length - 1];
  const oldestData = chartData[0];
  const priceChange = ((latestData.flatRate - oldestData.flatRate) / oldestData.flatRate * 100).toFixed(1);
  const salesChange = ((latestData.totalSales - oldestData.totalSales) / oldestData.totalSales * 100).toFixed(1);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-sm border-2 border-border rounded-xl p-4 shadow-2xl">
          <p className="font-bold text-foreground mb-2 text-lg">{label}</p>
          <div className="space-y-1.5">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-muted-foreground">{entry.name}:</span>
                </div>
                <span className="font-bold text-foreground">
                  {typeof entry.value === 'number' 
                    ? entry.value.toLocaleString() 
                    : entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative">
      {/* Gradient glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-10"></div>
      
      <Card className="relative border-2 border-border shadow-2xl bg-gradient-to-br from-card to-card/50">
        <CardHeader className="border-b-2 border-border/50 bg-gradient-to-r from-muted/30 to-transparent space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 animate-pulse"></div>
                <div className="relative flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                  Market Trends - {area}
                </span>
                <p className="text-sm font-normal text-muted-foreground mt-0.5">
                  {chartData[0].year} - {chartData[chartData.length - 1].year}
                </p>
              </div>
            </CardTitle>

            {/* Stats badges */}
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant="outline" 
                className={`gap-1.5 ${Number(priceChange) > 0 ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20'}`}
              >
                <TrendingUp className={`h-3 w-3 ${Number(priceChange) < 0 && 'rotate-180'}`} />
                Price {Number(priceChange) > 0 ? '+' : ''}{priceChange}%
              </Badge>
              <Badge 
                variant="outline" 
                className={`gap-1.5 ${Number(salesChange) > 0 ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20' : 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20'}`}
              >
                <BarChart3 className="h-3 w-3" />
                Sales {Number(salesChange) > 0 ? '+' : ''}{salesChange}%
              </Badge>
            </div>
          </div>

          {/* Chart type selector */}
          <Tabs value={activeChart} onValueChange={(v) => setActiveChart(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted/50">
              <TabsTrigger value="composed" className="gap-2">
                <Maximize2 className="h-4 w-4" />
                <span className="hidden sm:inline">Combined</span>
              </TabsTrigger>
              <TabsTrigger value="line" className="gap-2">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Line</span>
              </TabsTrigger>
              <TabsTrigger value="bar" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Bar</span>
              </TabsTrigger>
              <TabsTrigger value="area" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Area</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="h-[450px] w-full">
            <Tabs value={activeChart} className="w-full h-full">
              {/* Combined Chart */}
              <TabsContent value="composed" className="h-full mt-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="year" 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      yAxisId="left"
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={{ stroke: 'hsl(var(--border))' }}
                      label={{ value: 'Rate (₹/sqft)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={{ stroke: 'hsl(var(--border))' }}
                      label={{ value: 'Units Sold', angle: 90, position: 'insideRight', fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="circle"
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="flatRate"
                      fill="url(#colorPrice)"
                      stroke="#8884d8"
                      strokeWidth={3}
                      name="Flat Rate (₹/sqft)"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="totalSold"
                      fill="#82ca9d"
                      name="Units Sold"
                      radius={[8, 8, 0, 0]}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="totalSales"
                      stroke="#ffc658"
                      strokeWidth={3}
                      name="Total Sales (Cr)"
                      dot={{ fill: '#ffc658', r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </TabsContent>

              {/* Line Chart */}
              <TabsContent value="line" className="h-full mt-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="year" 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" />
                    <Line 
                      type="monotone" 
                      dataKey="flatRate" 
                      stroke="#8884d8" 
                      strokeWidth={3}
                      name="Flat Rate (₹/sqft)"
                      dot={{ fill: '#8884d8', r: 5, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="totalSold" 
                      stroke="#82ca9d" 
                      strokeWidth={3}
                      name="Units Sold"
                      dot={{ fill: '#82ca9d', r: 5, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="totalSales" 
                      stroke="#ffc658" 
                      strokeWidth={3}
                      name="Total Sales (Cr)"
                      dot={{ fill: '#ffc658', r: 5, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>

              {/* Bar Chart */}
              <TabsContent value="bar" className="h-full mt-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="year" 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="rect" />
                    <Bar 
                      dataKey="flatRate" 
                      fill="#8884d8" 
                      name="Flat Rate (₹/sqft)"
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar 
                      dataKey="totalSold" 
                      fill="#82ca9d" 
                      name="Units Sold"
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar 
                      dataKey="totalSales" 
                      fill="#ffc658" 
                      name="Total Sales (Cr)"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>

              {/* Area Chart */}
              <TabsContent value="area" className="h-full mt-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="gradientFlat" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="gradientSold" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="gradientSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ffc658" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="year" 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" />
                    <Area 
                      type="monotone" 
                      dataKey="flatRate" 
                      stroke="#8884d8" 
                      strokeWidth={3}
                      fill="url(#gradientFlat)"
                      name="Flat Rate (₹/sqft)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="totalSold" 
                      stroke="#82ca9d" 
                      strokeWidth={3}
                      fill="url(#gradientSold)"
                      name="Units Sold"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="totalSales" 
                      stroke="#ffc658" 
                      strokeWidth={3}
                      fill="url(#gradientSales)"
                      name="Total Sales (Cr)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </div>

          {/* Insights Footer */}
          <div className="mt-6 pt-4 border-t-2 border-border/50 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Flat Rate</p>
                <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
                  ₹{(chartData.reduce((sum, d) => sum + d.flatRate, 0) / chartData.length).toFixed(0)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Units</p>
                <p className="text-lg font-bold text-green-700 dark:text-green-400">
                  {chartData.reduce((sum, d) => sum + d.totalSold, 0).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Peak Year</p>
                <p className="text-lg font-bold text-purple-700 dark:text-purple-400">
                  {chartData.reduce((max, d) => d.totalSold > max.totalSold ? d : max).year}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartSection;
