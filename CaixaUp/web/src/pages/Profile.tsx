import { PageTransition } from "@/components/PageTransition";
import { useAuthStore } from "@/stores/authStore";
import { MotionButton } from "@/components/MotionButton";
import { LogOut, Shield, User, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <PageTransition className="flex-1 p-4 md:p-6 max-w-lg mx-auto w-full">
      <h1 className="text-xl font-bold text-foreground mb-6">Perfil</h1>

      <div className="rounded-xl border border-border bg-card p-6 mb-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{user?.name || "Usuário"}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Nome</p>
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">E-mail</p>
              <p className="text-sm font-medium text-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Permissão</p>
              <p className="text-sm font-medium text-foreground capitalize">{user?.role || "user"}</p>
            </div>
          </div>
        </div>
      </div>

      <MotionButton variant="destructive" className="w-full" size="lg" onClick={handleLogout}>
        <LogOut className="h-4 w-4 mr-2" /> Sair da conta
      </MotionButton>
    </PageTransition>
  );
}
