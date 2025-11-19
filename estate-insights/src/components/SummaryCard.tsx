import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, TrendingUp, DollarSign, Users, Calendar, Sparkles, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SummaryCardProps {
  summary: string;
  aiGenerated?: boolean;  // Add AI flag
}

const SummaryCard = ({ summary, aiGenerated = false }: SummaryCardProps) => {
  // Parse key metrics from summary text
  const extractMetric = (text: string, pattern: RegExp) => {
    const match = text.match(pattern);
    return match ? match[1] : null;
  };

  const avgPrice = extractMetric(summary, /Average.*?(?:Rate|Price).*?₹([\d,.]+)/i);
  const totalUnits = extractMetric(summary, /Total Units.*?([\d,]+)/i);
  const yearRange = extractMetric(summary, /(?:Period|Time Period).*?(\d{4}-\d{4})/i);
  const priceChange = extractMetric(summary, /\(([+-]?\d+\.?\d*)%\s*change\)/i);

  return (
    <div className="relative">
      {/* Gradient glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-10"></div>
      
      <Card className="relative border-2 border-border shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 bg-gradient-to-br from-card to-card/50">
        <CardHeader className="pb-4 border-b-2 border-border/50 bg-gradient-to-r from-muted/30 to-transparent">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-30 animate-pulse"></div>
                <div className="relative flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-purple-500/50">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                  Market Analysis
                </span>
                <p className="text-xs font-normal text-muted-foreground mt-0.5">
                  Comprehensive insights and trends
                </p>
              </div>
            </CardTitle>
            
            <div className="flex flex-wrap gap-2">
              {/* AI Badge */}
              {aiGenerated && (
                <Badge className="gap-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 shadow-lg shadow-purple-500/30">
                  <Sparkles className="h-3 w-3 animate-pulse" />
                  AI-Generated
                </Badge>
              )}
              
              {/* Year Range Badge */}
              {yearRange && (
                <Badge variant="outline" className="gap-1.5 bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20">
                  <Calendar className="h-3 w-3" />
                  {yearRange}
                </Badge>
              )}
            </div>
          </div>

          {/* Key Metrics Row */}
          {(avgPrice || totalUnits || priceChange) && (
            <div className="flex flex-wrap gap-3 mt-4">
              {avgPrice && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
                  <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-xs text-muted-foreground">Avg Price</p>
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                      ₹{avgPrice}/sqft
                    </p>
                  </div>
                </div>
              )}
              
              {totalUnits && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-xs text-muted-foreground">Units Sold</p>
                    <p className="text-sm font-bold text-blue-700 dark:text-blue-400">
                      {totalUnits}
                    </p>
                  </div>
                </div>
              )}

              {priceChange && (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                  parseFloat(priceChange) > 0 
                    ? 'bg-green-500/10 border-green-500/20 hover:bg-green-500/20' 
                    : parseFloat(priceChange) < 0
                    ? 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20'
                    : 'bg-gray-500/10 border-gray-500/20 hover:bg-gray-500/20'
                } transition-colors`}>
                  <TrendingUp className={`h-4 w-4 ${
                    parseFloat(priceChange) > 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : parseFloat(priceChange) < 0
                      ? 'text-red-600 dark:text-red-400 rotate-180'
                      : 'text-gray-600 dark:text-gray-400'
                  }`} />
                  <div>
                    <p className="text-xs text-muted-foreground">Price Change</p>
                    <p className={`text-sm font-bold ${
                      parseFloat(priceChange) > 0 
                        ? 'text-green-700 dark:text-green-400' 
                        : parseFloat(priceChange) < 0
                        ? 'text-red-700 dark:text-red-400'
                        : 'text-gray-700 dark:text-gray-400'
                    }`}>
                      {parseFloat(priceChange) > 0 ? '+' : ''}{priceChange}%
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-6">
          {/* Formatted Summary Text */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground bg-gradient-to-br from-muted/40 to-muted/20 p-5 rounded-xl border-2 border-border/50 shadow-inner">
              {summary}
            </div>
          </div>

          {/* Bottom Info Bar */}
          <div className="mt-6 pt-4 border-t-2 border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></div>
                <span className="font-medium text-green-700 dark:text-green-400">
                  {aiGenerated ? 'AI-Powered Insights' : 'Data-Driven Analysis'}
                </span>
              </div>
              
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Zap className="h-3 w-3 text-yellow-500" />
                <span>Real-time Data</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>Market Intelligence Report</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCard;
