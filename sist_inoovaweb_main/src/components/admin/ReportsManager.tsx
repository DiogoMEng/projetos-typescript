
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Printer, CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";
import { format, addDays, isAfter, isBefore, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";

export function ReportsManager() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 30));
  
  // Create a form to handle date selection
  const form = useForm({
    defaultValues: {
      startDate: startDate,
      endDate: endDate
    }
  });

  // Update form values when dates change
  useEffect(() => {
    form.setValue('startDate', startDate);
    form.setValue('endDate', endDate);
  }, [startDate, endDate, form]);

  // Fetch appointment data for the selected date range
  const { data: stats, refetch } = useQuery({
    queryKey: ['reportsStats', startDate, endDate],
    queryFn: async () => {
      const startDateStr = format(startDate, 'yyyy-MM-dd');
      const endDateStr = format(endDate, 'yyyy-MM-dd');

      const { data: appointments } = await supabase
        .from('appointments')
        .select('data, hora, servico, convenio, status')
        .gte('data', startDateStr)
        .lte('data', `${endDateStr}`);

      const total = appointments?.length || 0;

      // Status counts
      const statusCounts = appointments?.reduce((acc: Record<string, number>, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      }, {}) || {};

      // Service types counts
      const serviceCounts = appointments?.reduce((acc: Record<string, number>, curr) => {
        acc[curr.servico || 'Não especificado'] = (acc[curr.servico || 'Não especificado'] || 0) + 1;
        return acc;
      }, {}) || {};

      // Insurance counts
      const insuranceCounts = appointments?.reduce((acc: Record<string, number>, curr) => {
        acc[curr.convenio || 'Não especificado'] = (acc[curr.convenio || 'Não especificado'] || 0) + 1;
        return acc;
      }, {}) || {};

      return {
        total,
        statusCounts,
        serviceCounts,
        insuranceCounts
      };
    }
  });

  // Recalculate stats when date range changes
  useEffect(() => {
    refetch();
  }, [startDate, endDate, refetch]);

  const calculatePercentage = (value: number, total: number) => {
    if (!total) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  };

  const handleUpdateDateRange = (startDate: Date, endDate: Date) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentDate = format(new Date(), 'dd/MM/yyyy HH:mm');
  const reportPeriod = `${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`;

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 print:hidden">
        <h2 className="text-2xl font-bold">Relatórios</h2>
        
        <div className="flex flex-col md:flex-row gap-4">
          {/* Date Range Selection */}
          <Form {...form}>
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data Inicial</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Selecione a data</span>
                            )}
                            <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(date);
                              setStartDate(date);
                            }
                          }}
                          initialFocus
                          locale={ptBR}
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data Final</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Selecione a data</span>
                            )}
                            <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(date);
                              setEndDate(date);
                            }
                          }}
                          disabled={(date) => isBefore(date, startDate)}
                          initialFocus
                          locale={ptBR}
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>
          </Form>

          <Button onClick={handlePrint} className="print:hidden bg-medical-primary hover:bg-medical-primary/90">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir Relatório
          </Button>
        </div>
      </div>

      {/* Report content - this will be visible when printing */}
      <Card className="inova-report-print bg-white p-6 rounded-lg shadow-sm">
        {/* Header with date and report title */}
        <div className="print-header flex justify-between text-xs text-gray-600 mb-2">
          <div>{currentDate}</div>
          <div>Relatório de Agendamentos</div>
        </div>

        {/* Main report title */}
        <h1 className="text-xl font-bold text-center text-blue-600 mb-2">Relatório de Agendamentos - InovaWeb</h1>
        
        {/* Report period */}
        <div className="text-center text-sm mb-4">Período: {reportPeriod}</div>
        
        <Separator className="my-4 bg-blue-600" />

        {/* Summary */}
        <section className="mb-4">
          <h2 className="text-blue-600 font-bold mb-2">Resumo</h2>
          <div className="flex justify-between mb-1">
            <span>Total de agendamentos:</span>
            <span className="font-semibold">{stats?.total || 0}</span>
          </div>
        </section>
        
        <Separator className="my-4 bg-blue-600" />

        {/* Status */}
        <section className="mb-4">
          <h2 className="text-blue-600 font-bold mb-2">Status dos Agendamentos</h2>
          <Table className="print-table">
            <TableHeader>
              <TableRow>
                <TableHead className="bg-blue-50">Status</TableHead>
                <TableHead className="bg-blue-50 text-right">Quantidade</TableHead>
                <TableHead className="bg-blue-50 text-right">Percentual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats?.statusCounts && Object.entries(stats.statusCounts).map(([status, count]) => (
                <TableRow key={status} className="h-8">
                  <TableCell className="font-medium capitalize">{status}</TableCell>
                  <TableCell className="text-right">{count}</TableCell>
                  <TableCell className="text-right">{calculatePercentage(count, stats.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        {/* Tipos de Consulta */}
        <section className="mb-4">
          <h2 className="text-blue-600 font-bold mb-2">Tipo de Consulta</h2>
          <Table className="print-table">
            <TableHeader>
              <TableRow>
                <TableHead className="bg-blue-50">Procedimento</TableHead>
                <TableHead className="bg-blue-50 text-right">Quantidade</TableHead>
                <TableHead className="bg-blue-50 text-right">Percentual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats?.serviceCounts && Object.entries(stats.serviceCounts).map(([service, count]) => (
                <TableRow key={service} className="h-8">
                  <TableCell className="font-medium">{service}</TableCell>
                  <TableCell className="text-right">{count}</TableCell>
                  <TableCell className="text-right">{calculatePercentage(count, stats.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        {/* Convênios */}
        <section className="mb-4">
          <h2 className="text-blue-600 font-bold mb-2">Convênios</h2>
          <Table className="print-table">
            <TableHeader>
              <TableRow>
                <TableHead className="bg-blue-50">Convênio</TableHead>
                <TableHead className="bg-blue-50 text-right">Quantidade</TableHead>
                <TableHead className="bg-blue-50 text-right">Percentual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats?.insuranceCounts && Object.entries(stats.insuranceCounts).map(([insurance, count]) => (
                <TableRow key={insurance} className="h-8">
                  <TableCell className="font-medium">{insurance}</TableCell>
                  <TableCell className="text-right">{count}</TableCell>
                  <TableCell className="text-right">{calculatePercentage(count, stats.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        {/* Footer */}
        <div className="print-footer flex justify-between text-xs text-gray-600 mt-8">
          <div>{format(new Date(), "dd/MM/yyyy")}</div>
          <div>1/1</div>
        </div>
      </Card>

      <style>
        {`
        /* Regular styling for the screen view */
        .print-table table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .print-table th,
        .print-table td {
          border: 1px solid #e2e8f0;
          padding: 6px 12px;
        }
        
        /* Print-specific styles */
        @media print {
          /* CRITICAL FIX: Override any visibility settings to ensure content is visible */
          .inova-report-print * {
            visibility: visible !important;
            opacity: 1 !important;
            display: block !important;
          }

          body * {
            visibility: hidden;
          }
          
          /* Hide the UI elements we don't want to print */
          header, .sidebar, nav, footer, .print\\:hidden {
            display: none !important;
          }
          
          /* Make sure ONLY our report is visible and correctly positioned */
          .inova-report-print {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 1cm !important;
            visibility: visible !important;
            display: block !important;
            z-index: 9999 !important;
            background-color: white !important;
            color: black !important;
            box-shadow: none !important;
            font-size: 12px !important; 
          }
          
          @page {
            size: A4 portrait;
            margin: 1cm;
          }
          
          body, html {
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          
          /* Compact layout adjustments */
          h1 {
            font-size: 16px !important;
            margin-bottom: 8px !important;
          }
          
          h2 {
            font-size: 14px !important;
            margin-bottom: 6px !important;
          }
          
          .print-table {
            page-break-inside: avoid !important;
            display: table !important;
          }
          
          .print-table th,
          .print-table td {
            padding: 4px 8px !important;
            font-size: 11px !important;
            border: 1px solid #ccc !important;
            page-break-inside: avoid !important;
            display: table-cell !important;
            visibility: visible !important;
          }
          
          .print-table th {
            background-color: #e6f0ff !important;
            color: #1a73e8 !important;
          }
          
          section {
            margin-bottom: 12px !important;
            page-break-inside: avoid !important;
          }
          
          .print-table tr {
            height: 24px !important;
            page-break-inside: avoid !important;
            display: table-row !important;
            visibility: visible !important;
          }
          
          .print-header, .print-footer {
            font-size: 8px !important;
            display: flex !important;
            visibility: visible !important;
          }
          
          /* Force tables to be visible */
          table, tr, td, th, tbody, thead, tfoot {
            page-break-inside: avoid !important;
            visibility: visible !important;
          }
          
          /* Force display for content */
          .inova-report-print section,
          .inova-report-print h1,
          .inova-report-print h2,
          .inova-report-print div,
          .inova-report-print .print-table {
            display: block !important;
            visibility: visible !important;
          }
        }
        `}
      </style>
    </div>
  );
}
