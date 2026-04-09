import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { TrendingUp, Loader2, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MotionButton } from "@/components/MotionButton";
import { useAuthStore } from "@/stores/authStore";
import { authService, userService } from "@/lib/api";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Nome é obrigatório"),
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const form = useForm<RegisterData>({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (values: Record<string, string>) => {
    setIsLoading(true);
    try {
      if (isRegister) {
        await userService.create({ name: values.name, email: values.email, password: values.password });
      }
      const res = await authService.login(values.email, values.password);
      const { accessToken } = res.data;
      login(accessToken);
      toast.success(isRegister ? "Conta criada com sucesso!" : "Bem-vindo de volta!");
      navigate("/");
    } catch (err: any) {
      const msg = err.response?.data?.message || "E-mail ou senha incorretos. Tente novamente.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <TrendingUp className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">CaixaUp</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isRegister ? "Crie sua conta e assuma o controle" : "Seu controle financeiro inteligente"}
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {isRegister && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}>
              <Label htmlFor="name" className="text-sm font-medium text-foreground">Nome</Label>
              <Input
                id="name"
                placeholder="Seu nome"
                className="mt-1.5"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive mt-1">{form.formState.errors.name.message}</p>
              )}
            </motion.div>
          )}

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-foreground">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="mt-1.5"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium text-foreground">Senha</Label>
            <div className="relative mt-1.5">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••"
                {...form.register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-xs text-destructive mt-1">{form.formState.errors.password.message}</p>
            )}
          </div>

          <MotionButton type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isRegister ? (
              "Criar conta"
            ) : (
              "Entrar"
            )}
          </MotionButton>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isRegister ? "Já tem uma conta?" : "Não tem uma conta?"}{" "}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              form.reset();
            }}
            className="text-primary font-medium hover:underline"
          >
            {isRegister ? "Entrar" : "Cadastre-se"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
