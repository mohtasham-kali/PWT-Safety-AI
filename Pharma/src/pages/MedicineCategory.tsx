import { Plus, Edit, Trash2 } from "lucide-react";

export default function MedicineCategory() {
  return (
    <div className="flex-col gap-6">
      <div className="flex justify-between items-center mb-6">
        <h1>Medicine Category Management</h1>
        <div className="flex gap-4">
          <button className="btn btn-primary">
            <Plus size={18} /> Add Category
          </button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Category List</h3>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Category Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-secondary">CAT-01</td>
                <td style={{ fontWeight: 500 }}>Syrups</td>
                <td className="text-secondary">Liquid medicines</td>
                <td><span style={{ color: 'var(--secondary-color)' }}>Active</span></td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}><Edit size={16} /></button>
                    <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', color: 'var(--danger-color)' }}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="text-secondary">CAT-02</td>
                <td style={{ fontWeight: 500 }}>Tablets</td>
                <td className="text-secondary">Solid unit dosage form</td>
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
    </div>
  );
}
