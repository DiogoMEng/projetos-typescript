import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { MotionButton } from "@/components/MotionButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { transactionService, categoryService, boxService, type Category, type Box } from "@/lib/api";
import { toast } from "sonner";

const schema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z.string().min(1, "Informe o valor"),
  type: z.enum(["income", "expense"]),
  category_id: z.string().min(1, "Selecione uma categoria"),
  box_id: z.string().min(1, "Selecione um caixa"),
  date: z.string().min(1, "Informe a data"),
});

type FormData = z.infer<typeof schema>;

export default function NewTransactionPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([]);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "expense",
      date: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    categoryService.getAll().then((r) => setCategories(r.data.data || [])).catch(() => {});
    boxService.getAll().then((r) => setBoxes(r.data.data || [])).catch(() => {});
  }, []);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await transactionService.create(data.box_id, data.category_id, {
        description: data.description,
        type: data.type,
        date: data.date,
        amount: parseFloat(data.amount.replace(/[^\d.,]/g, "").replace(",", ".")),
      });
      toast.success("Transação registrada! 🎉");
      navigate("/transactions");
    } catch {
      toast.error("Erro ao registrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const selectedType = watch("type");

  return (
    <PageTransition className="flex-1 p-4 md:p-6 max-w-lg mx-auto w-full">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Nova Transação</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Type toggle */}
        <div className="flex gap-2">
          {(["expense", "income"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setValue("type", t)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors border ${
                selectedType === t
                  ? t === "income"
                    ? "bg-income border-income-border text-income-foreground"
                    : "bg-expense border-expense-border text-expense-foreground"
                  : "bg-card border-border text-muted-foreground"
              }`}
            >
              {t === "income" ? "Receita" : "Despesa"}
            </button>
          ))}
        </div>

        <div>
          <Label className="text-sm font-medium text-foreground">Valor (R$)</Label>
          <Input
            type="number"
            inputMode="decimal"
            step="0.01"
            placeholder="0,00"
            className="mt-1.5 text-2xl font-bold h-14"
            {...register("amount")}
          />
          {errors.amount && <p className="text-xs text-destructive mt-1">{errors.amount.message}</p>}
        </div>

        <div>
          <Label className="text-sm font-medium text-foreground">Descrição</Label>
          <Input placeholder="Ex: Almoço, Salário..." className="mt-1.5" {...register("description")} />
          {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm font-medium text-foreground">Categoria</Label>
            <Select onValueChange={(v) => setValue("category_id", v)}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                      {c.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category_id && <p className="text-xs text-destructive mt-1">{errors.category_id.message}</p>}
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground">Caixa</Label>
            <Select onValueChange={(v) => setValue("box_id", v)}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {boxes.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.box_id && <p className="text-xs text-destructive mt-1">{errors.box_id.message}</p>}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-foreground">Data</Label>
          <Input type="date" className="mt-1.5" {...register("date")} />
        </div>

        <MotionButton type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar Transação"}
        </MotionButton>
      </form>
    </PageTransition>
  );
}
