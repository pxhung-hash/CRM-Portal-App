import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Settings,
  Boxes,
  FileInput,
  Shield,
  Layers,
  Users,
  Calculator,
  Grid3x3,
  Inbox
} from "lucide-react";
import { Button } from "./ui/button";
import type { UserRole } from "../types/database.types";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole?: UserRole;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  allowedRoles: UserRole[];
  badge?: number;
}

const menuItems: MenuItem[] = [
  { id: "products", label: "Catalog", icon: Package, allowedRoles: ["Admin", "Dealer", "Sales", "Viewer"] },
  { id: "windowDesign", label: "Window Design", icon: Grid3x3, allowedRoles: ["Admin", "Dealer", "Sales", "Viewer"] },
  { id: "windowQuotation", label: "Window Quotation", icon: Calculator, allowedRoles: ["Admin", "Dealer", "Sales", "Viewer"] },
  { id: "quotation", label: "Purchase Quotation", icon: FileInput, allowedRoles: ["Admin", "Dealer", "Sales", "Viewer"] },
  { id: "orders", label: "Purchasing Orders", icon: ShoppingCart, allowedRoles: ["Admin", "Dealer", "Sales", "Viewer"] },
  { id: "inboundPurchasingOrders", label: "Inbound POs", icon: Inbox, allowedRoles: ["Admin", "Sales"], badge: 5 },
  { id: "materials", label: "Materials", icon: Layers, allowedRoles: ["Admin", "Dealer", "Sales", "Viewer"] },
  { id: "documents", label: "Documents", icon: FileText, allowedRoles: ["Admin", "Dealer", "Sales", "Viewer"] },
  { id: "messages", label: "Messages", icon: MessageSquare, allowedRoles: ["Admin", "Dealer", "Sales", "Viewer"] },
  { id: "analytics", label: "Analytics", icon: BarChart3, allowedRoles: ["Admin", "Dealer", "Sales", "Viewer"] },
  { id: "settings", label: "Settings", icon: Settings, allowedRoles: ["Admin", "Dealer", "Sales", "Viewer"] },
  { id: "admin", label: "Admin Page", icon: Shield, allowedRoles: ["Admin", "Sales"] },
];

export function Sidebar({ activeTab, onTabChange, userRole = "Dealer" }: SidebarProps) {
  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter((item) =>
    item.allowedRoles.includes(userRole)
  );

  return (
    <aside className="w-64 bg-white border-r h-[calc(100vh-73px)] sticky top-[73px]">
      <nav className="p-4 space-y-1">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start gap-3 relative ${
                isActive ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : ""
              }`}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}