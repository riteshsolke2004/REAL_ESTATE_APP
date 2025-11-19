import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const LoadingState = () => {
  return (
    <Card className="border-border shadow-sm">
      <CardContent className="py-16">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="text-center">
            <p className="text-lg font-medium text-foreground">Analyzing real estate data...</p>
            <p className="text-sm text-muted-foreground mt-1">This may take a few moments</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingState;
