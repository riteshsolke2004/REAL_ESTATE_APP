// src/components/ChatInput.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles } from "lucide-react";

interface ChatInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

const ChatInput = ({ onSubmit, isLoading }: ChatInputProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query.trim());
      setQuery(""); // Clear input after submit
    }
  };

  // Updated with actual areas from your dataset
  const exampleQueries = [
    "Analyze Wakad",
    "Price trend of Aundh",
    "Show me data for Akurdi",
    "Ambegaon Budruk analysis"
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about any area... (e.g., Analyze Wakad)"
          className="flex-1 h-12 text-base bg-card border-border"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          size="lg"
          disabled={isLoading || !query.trim()}
          className="h-12 px-6"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              <span>Analyzing...</span>
            </div>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Analyze
            </>
          )}
        </Button>
      </form>
      
      <div className="flex flex-wrap gap-2 justify-center">
        <p className="w-full text-center text-xs text-muted-foreground mb-1">
          Available areas: Wakad, Aundh, Akurdi, Ambegaon Budruk
        </p>
        {exampleQueries.map((example, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isLoading) {
                setQuery(example);
                onSubmit(example);
              }
            }}
            className="group flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border border-border bg-card hover:bg-secondary transition-colors"
            disabled={isLoading}
          >
            <Sparkles className="h-3 w-3 text-accent" />
            <span className="text-muted-foreground group-hover:text-foreground">
              {example}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatInput;
