
import {
  Calendar,
  Settings2,
  CalendarClock,
  CalendarCheck,
  FileText,
  LogOut, // Add this import
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { supabase } from "@/integrations/supabase/client"; // Import Supabase client
import { useToast } from "@/components/ui/use-toast"; // Import toast

const menuItems = [
  {
    title: "Agendamentos",
    icon: CalendarCheck,
    isActive: true,
  },
  {
    title: "Horários de Atendimento",
    icon: CalendarClock,
    isActive: false,
  },
  {
    title: "Relatórios",
    icon: FileText,
    isActive: false,
  },
  {
    title: "Configurações",
    icon: Settings2,
    isActive: false,
  },
];

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const navigate = useNavigate();
  const { toast } = useToast();

  // Add logout function
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Erro ao sair",
          description: "Ocorreu um erro ao tentar fazer logout.",
          variant: "destructive"
        });
      } else {
        // Redirect to login page
        navigate('/admin/login');
        
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso.",
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    }
  };

  return (
    <Sidebar 
      className="bg-gray-100 border-r border-gray-300 text-gray-800"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-gray-300 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-medical-primary" />
          {!isCollapsed && (
            <span className="font-semibold text-sm text-gray-900 truncate">
              Clínica Admin
            </span>
          )}
        </div>
        <SidebarTrigger 
          className={cn(
            "h-7 w-7 hover:bg-gray-200 rounded-md absolute top-2 right-2",
            isCollapsed && "self-center"
          )} 
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-600 px-3 py-2">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.title)}
                    isActive={activeTab === item.title}
                    className={cn(
                      "w-full text-sm px-3 py-2 flex items-center gap-2 transition-colors",
                      activeTab === item.title 
                        ? "bg-medical-primary text-white" 
                        : "text-gray-700 hover:bg-gray-200"
                    )}
                    tooltip={item.title}
                  >
                    <item.icon className="h-4 w-4" />
                    {!isCollapsed && <span className="truncate">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {/* Add Logout menu item */}
              <SidebarMenuItem key="Logout">
                <SidebarMenuButton
                  onClick={handleLogout}
                  className={cn(
                    "w-full text-sm px-3 py-2 flex items-center gap-2 transition-colors text-red-600 hover:bg-red-50"
                  )}
                  tooltip="Logout"
                >
                  <LogOut className="h-4 w-4" />
                  {!isCollapsed && <span className="truncate">Sair</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
