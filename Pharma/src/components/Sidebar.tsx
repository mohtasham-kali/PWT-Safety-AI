import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Grid, List, Pill, Truck, ShoppingCart, Settings } from "lucide-react";
import "./Sidebar.css";

const menuItems = [
  { path: "/", name: "Dashboard", icon: LayoutDashboard },
  { path: "/users", name: "User Management", icon: Users },
  { path: "/categories", name: "Medicine Category", icon: Grid },
  { path: "/generics", name: "Medicine Generic", icon: List },
  { path: "/medicines", name: "Medicine Management", icon: Pill },
  { path: "/suppliers", name: "Suppliers", icon: Truck },
  { path: "/orders", name: "Orders", icon: ShoppingCart },
  { path: "/settings", name: "Settings", icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">💊</div>
        <h2>PharmaCore</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive ? "active" : ""}`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
