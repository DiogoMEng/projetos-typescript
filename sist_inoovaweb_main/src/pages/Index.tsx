
import React from "react";
import AppointmentForm from "@/components/AppointmentForm";
import { Toaster } from "@/components/ui/toaster";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-medical-primary text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center">Agendamento de Consultas</h1>
        </div>
      </header>
      
      <main className="container mx-auto py-8">
        <AppointmentForm />
      </main>
      
      <footer className="bg-medical-highlight text-white py-4 mt-16">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm">
            © {new Date().getFullYear()} Sistema de Agendamento | InoovaWeb
          </p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default Index;
