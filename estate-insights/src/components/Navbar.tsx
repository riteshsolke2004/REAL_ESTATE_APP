import { Home, Sparkles } from "lucide-react";

const Navbar = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-3.5">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/80 via-purple-500/80 to-pink-500/80 shadow-md hover:shadow-lg transition-all duration-300">
              <Home className="h-5 w-5 text-white" />
            </div>
            
            <div>
              <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Real Estate Analysis
              </h1>
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-purple-500/70" />
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  AI-Powered Market Insights
                </p>
              </div>
            </div>
          </button>

          {/* Right Side - Subtle Live Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-800/30">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
            <span className="text-xs font-medium text-green-700 dark:text-green-400">
              Live
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
