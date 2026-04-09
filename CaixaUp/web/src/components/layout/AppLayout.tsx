import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, ArrowLeftRight, Box, User, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AppDesktopSidebar } from "./AppDesktopSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const leftNav = [
  { path: "/", label: "Início", icon: Home },
  { path: "/transactions", label: "Transações", icon: ArrowLeftRight },
];

const rightNav = [
  { path: "/boxes", label: "Caixas", icon: Box },
  { path: "/profile", label: "Perfil", icon: User },
];

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const renderNavBtn = (item: typeof leftNav[0]) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;
    return (
      <button
        key={item.path}
        onClick={() => navigate(item.path)}
        className={cn(
          "flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-colors min-w-[56px]",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
      >
        <Icon className="h-5 w-5" />
        <span className="text-[10px] font-medium">{item.label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {!isMobile && <AppDesktopSidebar />}

      <main className={cn("flex-1 flex flex-col min-h-screen", isMobile ? "pb-20" : "")}>
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>

      {isMobile && (
        <nav className="fixed bottom-0 inset-x-0 z-50 bg-card/90 backdrop-blur-lg border-t border-border">
          <div className="flex items-center justify-around px-2 h-16 max-w-md mx-auto relative">
            {leftNav.map(renderNavBtn)}

            {/* FAB */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/transactions/new")}
              className="absolute -top-5 left-1/2 -translate-x-1/2 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center"
            >
              <Plus className="h-6 w-6" />
            </motion.button>

            <div className="w-14" /> {/* spacer for FAB */}

            {rightNav.map(renderNavBtn)}
          </div>
        </nav>
      )}
    </div>
  );
}
