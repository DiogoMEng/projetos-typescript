
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, FileText } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

export function ServiceTypeManager() {
  const [services, setServices] = useState<Array<{ id: string; nome: string }>>([]);
  const [newService, setNewService] = useState('');
  const [editingService, setEditingService] = useState<{ id: string; nome: string } | null>(null);
  const { toast } = useToast();

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('nome', { ascending: true });
    
    if (error) {
      toast({
        title: "Erro ao carregar serviços",
        description: error.message,
        variant: "destructive"
      });
      return;
    }
    
    setServices(data || []);
  };

  const handleAdd = async () => {
    if (!newService.trim()) return;
    
    const { error } = await supabase
      .from('services')
      .insert([{ nome: newService }]);
      
    if (error) {
      toast({
        title: "Erro ao adicionar serviço",
        description: error.message,
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Serviço adicionado",
      description: "O novo tipo de consulta foi adicionado com sucesso."
    });
    
    setNewService('');
    fetchServices();
  };

  const handleUpdate = async () => {
    if (!editingService) return;
    
    const { error } = await supabase
      .from('services')
      .update({ nome: editingService.nome })
      .eq('id', editingService.id);
      
    if (error) {
      toast({
        title: "Erro ao atualizar serviço",
        description: error.message,
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Serviço atualizado",
      description: "O tipo de consulta foi atualizado com sucesso."
    });
    
    setEditingService(null);
    fetchServices();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
      
    if (error) {
      toast({
        title: "Erro ao excluir serviço",
        description: error.message,
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Serviço excluído",
      description: "O tipo de consulta foi excluído com sucesso."
    });
    
    fetchServices();
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-medical-primary" />
          <CardTitle>Tipos de Serviço</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="text-lg font-medium mb-4">Tipos de Consulta</h3>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Nome do novo tipo de consulta"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
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
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    {editingService?.id === service.id ? (
                      <Input
                        value={editingService.nome}
                        onChange={(e) => setEditingService({ ...editingService, nome: e.target.value })}
                      />
                    ) : (
                      service.nome
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {editingService?.id === service.id ? (
                        <Button onClick={handleUpdate} size="sm">
                          Salvar
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingService(service)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(service.id)}
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
