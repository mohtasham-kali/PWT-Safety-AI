import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import MedicineCategory from "./pages/MedicineCategory";
import MedicineGeneric from "./pages/MedicineGeneric";
import Medicine from "./pages/Medicine";
import MedicineSupplier from "./pages/MedicineSupplier";
import MedicineOrder from "./pages/MedicineOrder";
import Settings from "./pages/Settings";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/categories" element={<MedicineCategory />} />
            <Route path="/generics" element={<MedicineGeneric />} />
            <Route path="/medicines" element={<Medicine />} />
            <Route path="/suppliers" element={<MedicineSupplier />} />
            <Route path="/orders" element={<MedicineOrder />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
