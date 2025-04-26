
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, FileText } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

export function InsuranceTypeManager() {
  const [insurances, setInsurances] = useState<Array<{ id: string; nome: string }>>([]);
  const [newInsurance, setNewInsurance] = useState('');
  const [editingInsurance, setEditingInsurance] = useState<{ id: string; nome: string } | null>(null);
  const { toast } = useToast();

  const fetchInsurances = async () => {
    const { data, error } = await supabase
      .from('insurances')
      .select('*')
      .order('nome', { ascending: true });
    
    if (error) {
      toast({
        title: "Erro ao carregar convênios",
        description: error.message,
        variant: "destructive"
      });
      return;
    }
    
    setInsurances(data || []);
  };

  const handleAdd = async () => {
    if (!newInsurance.trim()) return;
    
    const { error } = await supabase
      .from('insurances')
      .insert([{ nome: newInsurance }]);
      
    if (error) {
      toast({
        title: "Erro ao adicionar convênio",
        description: error.message,
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Convênio adicionado",
      description: "O novo convênio foi adicionado com sucesso."
    });
    
    setNewInsurance('');
    fetchInsurances();
  };

  const handleUpdate = async () => {
    if (!editingInsurance) return;
    
    const { error } = await supabase
      .from('insurances')
      .update({ nome: editingInsurance.nome })
      .eq('id', editingInsurance.id);
      
    if (error) {
      toast({
        title: "Erro ao atualizar convênio",
        description: error.message,
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Convênio atualizado",
      description: "O convênio foi atualizado com sucesso."
    });
    
    setEditingInsurance(null);
    fetchInsurances();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('insurances')
      .delete()
      .eq('id', id);
      
    if (error) {
      toast({
        title: "Erro ao excluir convênio",
        description: error.message,
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Convênio excluído",
      description: "O convênio foi excluído com sucesso."
    });
    
    fetchInsurances();
  };

  useEffect(() => {
    fetchInsurances();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-medical-primary" />
          <CardTitle>Tipos de Convênio</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Nome do novo convênio"
                value={newInsurance}
                onChange={(e) => setNewInsurance(e.target.value)}
              />
            </div>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {insurances.map((insurance) => (
                <TableRow key={insurance.id}>
                  <TableCell>
                    {editingInsurance?.id === insurance.id ? (
                      <Input
                        value={editingInsurance.nome}
                        onChange={(e) => setEditingInsurance({ ...editingInsurance, nome: e.target.value })}
                      />
                    ) : (
                      insurance.nome
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {editingInsurance?.id === insurance.id ? (
                        <Button onClick={handleUpdate} size="sm">
                          Salvar
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingInsurance(insurance)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(insurance.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
