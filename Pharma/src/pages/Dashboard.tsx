import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Activity, DollarSign, Package } from "lucide-react";

const monthlyData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4500 },
  { name: "May", sales: 6000 },
  { name: "Jun", sales: 5500 },
];

const dailyTopTen = [
  { name: "Paracetamol", amount: 120 },
  { name: "Amoxicillin", amount: 98 },
  { name: "Ibuprofen", amount: 86 },
  { name: "Cetirizine", amount: 75 },
  { name: "Azithromycin", amount: 65 },
  { name: "Omeprazole", amount: 55 },
  { name: "Ciprofloxacin", amount: 48 },
  { name: "Metformin", amount: 42 },
  { name: "Losartan", amount: 38 },
  { name: "Aspirin", amount: 30 },
];

const latestMedicines = [
  { id: "MED-001", name: "Vitamin C 500mg", category: "Supplements", stock: 150, price: "$5.00" },
  { id: "MED-002", name: "Cough Syrup", category: "Syrups", stock: 85, price: "$8.50" },
  { id: "MED-003", name: "Antacid Tablets", category: "Tablets", stock: 200, price: "$3.20" },
];

export default function Dashboard() {
  return (
    <div className="flex-col gap-6">
      <div className="flex justify-between items-center mb-6">
        <h1>Dashboard</h1>
        <div className="flex gap-4">
          <button className="btn btn-primary">Download Report</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card flex items-center gap-4">
          <div className="p-4 rounded-full bg-blue-100 text-blue-600" style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-secondary">Total Monthly Sales</p>
            <h2 style={{ marginBottom: 0 }}>$28,000</h2>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-4 rounded-full bg-green-100 text-green-600" style={{ backgroundColor: '#d1fae5', color: '#10b981' }}>
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-secondary">Daily Transactions</p>
            <h2 style={{ marginBottom: 0 }}>142</h2>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-4 rounded-full bg-purple-100 text-purple-600" style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-secondary">Low Stock Items</p>
            <h2 style={{ marginBottom: 0 }}>12</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Monthly Sale Report */}
        <div className="card">
          <h3>Monthly Sale Report</h3>
          <div style={{ height: "300px", marginTop: "1rem" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="sales" stroke="var(--primary-color)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Top Ten Sale Report */}
        <div className="card">
          <h3>Daily Top Ten Sale</h3>
          <div style={{ height: "300px", marginTop: "1rem" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyTopTen} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color)" />
                <XAxis type="number" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                />
                <Bar dataKey="amount" fill="var(--secondary-color)" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Latest Medicine List */}
      <div className="card">
        <h3>Latest Medicine List</h3>
        <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {latestMedicines.map((med) => (
                <tr key={med.id}>
                  <td className="text-secondary">{med.id}</td>
                  <td style={{ fontWeight: 500 }}>{med.name}</td>
                  <td>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      backgroundColor: 'var(--bg-color)', 
                      borderRadius: '999px',
                      fontSize: '0.875rem' 
                    }}>
                      {med.category}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: med.stock < 100 ? 'var(--warning-color)' : 'var(--secondary-color)' }}>
                      {med.stock} units
                    </span>
                  </td>
                  <td>{med.price}</td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
