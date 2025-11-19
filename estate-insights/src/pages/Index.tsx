import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import ChatInput from "@/components/ChatInput";
import SummaryCard from "@/components/SummaryCard";
import ChartSection from "@/components/ChartSection";
import DataTable from "@/components/DataTable";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingState from "@/components/LoadingState";
import { analyzeQuery, getAvailableAreas } from "@/services/api";
import { AnalysisResponse, ApiError } from "@/types/analysis";
import AISummaryButton from "@/components/AISummaryButton";
import { 
  TrendingUp, 
  BarChart3, 
  MapPin, 
  Sparkles,
  ArrowRight,
  Building2,
  DollarSign,
  Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const [currentQuery, setCurrentQuery] = useState<string>("");
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);

  const mutation = useMutation<AnalysisResponse, ApiError, string>({
    mutationFn: analyzeQuery,
    onSuccess: (data) => {
      console.log('✅ Analysis successful:', data);
    },
    onError: (error) => {
      console.error('❌ Analysis failed:', error);
    },
  });

  // Load available areas on mount
  useEffect(() => {
    getAvailableAreas().then(setAvailableAreas).catch(console.error);
  }, []);

  const handleSubmit = (query: string) => {
    setCurrentQuery(query);
    mutation.mutate(query);
  };

  const handleRetry = () => {
    if (currentQuery) {
      mutation.mutate(currentQuery);
    }
  };

  const handleQuickAnalysis = (area: string) => {
    const query = `Analyze ${area}`;
    setCurrentQuery(query);
    mutation.mutate(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/10">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Hero Section */}
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="text-center space-y-6 py-6">
            {/* Icon with gradient glow */}
            

            {/* Title */}
            <div className="space-y-8">
              
              
              <h1 className="text-5xl md:text-6xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Real Estate Market
                </span>
                <br />
                <span className="text-foreground">Intelligence</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Get instant insights on property prices, trends, and comprehensive market analysis for{" "}
                <span className="font-semibold text-foreground">Pune localities</span>
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8">
              <Card className="border-2 border-blue-100 dark:border-blue-900 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20">
                <CardContent className="p-4 text-center">
                  <MapPin className="h-6 w-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                  <p className="text-2xl font-bold text-foreground">{availableAreas.length}</p>
                  <p className="text-xs text-muted-foreground">Areas Covered</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-100 dark:border-purple-900 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20">
                <CardContent className="p-4 text-center">
                  <BarChart3 className="h-6 w-6 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                  <p className="text-2xl font-bold text-foreground">2020-24</p>
                  <p className="text-xs text-muted-foreground">Year Range</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-pink-100 dark:border-pink-900 bg-gradient-to-br from-pink-50/50 to-transparent dark:from-pink-950/20">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2 text-pink-600 dark:text-pink-400" />
                  <p className="text-2xl font-bold text-foreground">Real-time</p>
                  <p className="text-xs text-muted-foreground">Live Data</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-100 dark:border-green-900 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-950/20">
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
                  <p className="text-2xl font-bold text-foreground">AI</p>
                  <p className="text-xs text-muted-foreground">Powered</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="max-w-3xl mx-auto">
          <ChatInput onSubmit={handleSubmit} isLoading={mutation.isPending} />
          
          {/* Quick Access Areas */}
          {!mutation.isPending && !mutation.isSuccess && availableAreas.length > 0 && (
            <div className="mt-6 space-y-3">
              <p className="text-sm font-medium text-muted-foreground text-center">
                Quick analyze popular areas:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {availableAreas.map((area) => (
                  <button
                    key={area}
                    onClick={() => handleQuickAnalysis(area)}
                    className="group px-4 py-2 rounded-full bg-white dark:bg-slate-900 border-2 border-border hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {area}
                      </span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Loading State */}
          {mutation.isPending && <LoadingState />}
          
          {/* Error State */}
          {mutation.isError && (
            <ErrorMessage 
              message={mutation.error.message || 'An error occurred'} 
              onRetry={handleRetry}
            />
          )}
          
          {/* Success State - Results */}
          {mutation.isSuccess && mutation.data && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Results Header */}
              <div className="flex items-center justify-between px-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Analysis Results
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Showing data for <span className="font-semibold text-foreground">{mutation.data.area}</span>
                  </p>
                </div>
                <Badge className="gap-1.5 bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  {mutation.data.recordCount} Records
                </Badge>
              </div>

              {/* Summary Card */}
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                <SummaryCard summary={mutation.data.summary} />
              </div>
              
              {/* AI Summary Button - NEW */}
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
      <AISummaryButton 
        area={mutation.data.area}
        analysisData={mutation.data}
      />
    </div>
              {/* Chart Section */}
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                <ChartSection 
                  chartData={mutation.data.chartData} 
                  area={mutation.data.area} 
                />
              </div>
              
              {/* Data Table */}
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <DataTable data={mutation.data.tableData} />
              </div>
            </div>
          )}

          {/* Empty State */}
          {!mutation.isPending && !mutation.isError && !mutation.isSuccess && (
            <Card className="border-2 border-dashed border-border bg-muted/20">
              <CardContent className="py-16">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                    <BarChart3 className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Ready to Analyze
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Enter a query above or click on any area to get started with AI-powered real estate insights
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center pt-4">
                    <Badge variant="outline" className="text-xs">
                      💡 Try: "Analyze Wakad"
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      📊 Or: "Price trend of Aundh"
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

 
    </div>
  );
};

export default Index;
