import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home, ArrowLeft, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  // Determine error type for better messaging
  const isNetworkError = message.toLowerCase().includes('network') || message.toLowerCase().includes('fetch');
  const isValidationError = message.toLowerCase().includes('area') || message.toLowerCase().includes('query');
  const is404Error = message.toLowerCase().includes('404') || message.toLowerCase().includes('not found');

  const getErrorTitle = () => {
    if (isNetworkError) return "Connection Error";
    if (isValidationError) return "Invalid Query";
    if (is404Error) return "Data Not Found";
    return "Something Went Wrong";
  };

  const getErrorIcon = () => {
    return (
      <div className="relative">
        {/* Animated pulse ring */}
        <div className="absolute -inset-4 bg-red-500/20 rounded-full animate-ping"></div>
        <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur opacity-40"></div>
        
        {/* Icon container */}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-500 via-red-600 to-orange-600 shadow-2xl shadow-red-500/50 ring-4 ring-red-100 dark:ring-red-950">
          <AlertCircle className="h-10 w-10 text-white animate-pulse" />
        </div>
      </div>
    );
  };

  const getSuggestions = () => {
    if (isValidationError) {
      return [
        "Include an area name (Wakad, Aundh, Akurdi, or Ambegaon Budruk)",
        "Try: 'Analyze Wakad' or 'Price trend of Aundh'",
      ];
    }
    if (isNetworkError) {
      return [
        "Check your internet connection",
        "Verify the backend server is running",
      ];
    }
    return [
      "Try refreshing the page",
      "Check your query format",
    ];
  };

  return (
    <div className="relative">
      {/* Background glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 rounded-2xl blur-xl opacity-20"></div>
      
      <Card className="relative border-2 border-red-200 dark:border-red-900 shadow-2xl bg-gradient-to-br from-white via-red-50/30 to-orange-50/20 dark:from-slate-950 dark:via-red-950/20 dark:to-orange-950/10">
        <CardContent className="py-12 px-6">
          <div className="text-center space-y-6">
            {/* Error Icon */}
            <div className="flex justify-center">
              {getErrorIcon()}
            </div>
            
            {/* Error Title & Message */}
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-2xl font-bold text-foreground">
                  {getErrorTitle()}
                </h3>
                <Badge variant="destructive" className="text-xs">
                  Error
                </Badge>
              </div>
              
              <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
                {message}
              </p>
            </div>

            {/* Suggestions Box */}
            <div className="max-w-lg mx-auto bg-amber-50/50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-left space-y-2">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                    Suggestions:
                  </p>
                  <ul className="text-xs text-amber-800 dark:text-amber-300 space-y-1">
                    {getSuggestions().map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button 
                onClick={onRetry} 
                size="lg"
                className="gap-2 shadow-lg bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              
              <Button 
                onClick={() => window.location.reload()}
                variant="outline" 
                size="lg"
                className="gap-2 border-2"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </div>

            {/* Footer Help Text */}
            <div className="pt-6 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Still having issues?{" "}
                <button 
                  onClick={() => window.location.reload()} 
                  className="text-primary hover:underline font-medium"
                >
                  Refresh the page
                </button>
                {" "}or contact support
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorMessage;
