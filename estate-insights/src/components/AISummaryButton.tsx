import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { generateAISummary } from "@/services/api";

interface AISummaryButtonProps {
  area: string;
  analysisData: any;
}

const AISummaryButton = ({ area, analysisData }: AISummaryButtonProps) => {
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAI = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Prepare data for AI
      const data = {
        yearRange: {
          start: analysisData.chartData?.[0]?.year || 2020,
          end: analysisData.chartData?.[analysisData.chartData.length - 1]?.year || 2024
        },
        salesTotal: analysisData.chartData?.reduce((sum: number, d: any) => sum + d.totalSales, 0) || 0,
        avgPrice: analysisData.chartData?.reduce((sum: number, d: any) => sum + d.flatRate, 0) / analysisData.chartData?.length || 0,
        totalUnits: analysisData.chartData?.reduce((sum: number, d: any) => sum + d.totalSold, 0) || 0,
        priceTrend: 'stable',
        priceChange: 0
      };
      
      const response = await generateAISummary(area, data);
      setAiSummary(response.aiSummary);
    } catch (err: any) {
      setError(err.message || 'Failed to generate AI summary');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAiSummary(null);
  };

  return (
    <div className="space-y-4">
      {/* Generate Button */}
      {!aiSummary && (
        <div className="flex justify-center">
          <Button
            onClick={handleGenerateAI}
            disabled={loading}
            size="lg"
            className="gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 shadow-xl shadow-purple-500/30 border-0 transform hover:scale-105 transition-all duration-300"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating AI Insights...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 animate-pulse" />
                Generate Personalized AI Summary
              </>
            )}
          </Button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          <p className="font-semibold">Failed to generate AI summary</p>
          <p className="text-xs mt-1">{error}</p>
        </div>
      )}

      {/* AI Summary Card */}
      {aiSummary && (
        <div className="relative animate-in fade-in slide-in-from-bottom duration-700">
          {/* Gradient glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl blur-xl opacity-20"></div>
          
          <Card className="relative border-2 border-purple-200 dark:border-purple-800 shadow-2xl bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-orange-50/20 dark:from-purple-950/20 dark:via-pink-950/10 dark:to-orange-950/10">
            <CardHeader className="border-b-2 border-purple-100 dark:border-purple-900 bg-gradient-to-r from-purple-100/50 to-transparent dark:from-purple-950/30">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-40 animate-pulse"></div>
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 shadow-lg shadow-purple-500/50">
                      <Sparkles className="h-6 w-6 text-white animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent font-bold">
                      AI-Generated Insights
                    </span>
                    <p className="text-xs font-normal text-muted-foreground mt-0.5">
                      Personalized analysis for {area}
                    </p>
                  </div>
                </CardTitle>

                <div className="flex items-center gap-2">
                  <Badge className="gap-1.5 bg-gradient-to-r from-purple-600 to-pink-600 border-0 shadow-lg">
                    <Sparkles className="h-3 w-3" />
                    AI-Powered
                  </Badge>
                  
                  <button
                    onClick={handleClose}
                    className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
                    aria-label="Close AI summary"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground bg-gradient-to-br from-white/60 to-purple-50/40 dark:from-slate-900/60 dark:to-purple-950/40 p-6 rounded-xl border-2 border-purple-100 dark:border-purple-900 shadow-inner">
                  {aiSummary}
                </div>
              </div>

              {/* Footer Info */}
              <div className="mt-6 pt-4 border-t-2 border-purple-100 dark:border-purple-900 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></div>
                  <span>Powered by Groq AI</span>
                </div>
                <button
                  onClick={handleGenerateAI}
                  disabled={loading}
                  className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                >
                  Regenerate Summary
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AISummaryButton;
