import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="flex-col gap-6">
      <div className="flex justify-between items-center mb-6">
        <h1>User Management</h1>
        <div className="flex gap-4">
          <button className="btn btn-primary">
            <Plus size={18} /> {activeTab === "users" ? "Add User" : "Add Role"}
          </button>
        </div>
      </div>

      <div className="card mb-6" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="flex" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <button 
            className={`btn ${activeTab === "users" ? "" : "btn-secondary"}`}
            style={{ borderRadius: 0, border: 'none', padding: '1rem 2rem', backgroundColor: activeTab === "users" ? 'var(--bg-color)' : 'transparent', color: activeTab === "users" ? 'var(--primary-color)' : 'var(--text-secondary)' }}
            onClick={() => setActiveTab("users")}
          >
            Show Users List
          </button>
          <button 
            className={`btn ${activeTab === "roles" ? "" : "btn-secondary"}`}
            style={{ borderRadius: 0, border: 'none', padding: '1rem 2rem', backgroundColor: activeTab === "roles" ? 'var(--bg-color)' : 'transparent', color: activeTab === "roles" ? 'var(--primary-color)' : 'var(--text-secondary)' }}
            onClick={() => setActiveTab("roles")}
          >
            Users Roles
          </button>
        </div>
      </div>

      <div className="card">
        {activeTab === "users" ? (
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>Users List</h3>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 500 }}>John Doe</td>
                    <td className="text-secondary">john@example.com</td>
                    <td>Admin</td>
                    <td><span style={{ color: 'var(--secondary-color)' }}>Active</span></td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}><Edit size={16} /></button>
                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', color: 'var(--danger-color)' }}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500 }}>Jane Smith</td>
                    <td className="text-secondary">jane@example.com</td>
                    <td>Pharmacist</td>
                    <td><span style={{ color: 'var(--secondary-color)' }}>Active</span></td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}><Edit size={16} /></button>
                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', color: 'var(--danger-color)' }}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>Roles List</h3>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Role Name</th>
                    <th>Description</th>
                    <th>Users Count</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 500 }}>Admin</td>
                    <td className="text-secondary">Full system access</td>
                    <td>1</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}><Edit size={16} /></button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500 }}>Pharmacist</td>
                    <td className="text-secondary">Can manage medicines and orders</td>
                    <td>4</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}><Edit size={16} /></button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
