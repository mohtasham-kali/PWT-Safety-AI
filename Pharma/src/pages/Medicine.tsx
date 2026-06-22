import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, AlertTriangle, X } from "lucide-react";
import { getMedicines, addMedicine, updateMedicine, deleteMedicine } from "../db";

export default function Medicine() {
  const [showModal, setShowModal] = useState(false);
  const [medicines, setMedicines] = useState<any[]>([]);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [genericName, setGenericName] = useState("Paracetamol");
  const [category, setCategory] = useState("Tablets");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const loadMedicines = async () => {
    try {
      const data = await getMedicines();
      setMedicines(data as any[]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  const openModalForAdd = () => {
    setEditingId(null);
    setName("");
    setGenericName("Paracetamol");
    setCategory("Tablets");
    setPrice("");
    setStock("");
    setShowModal(true);
  };

  const openModalForEdit = (med: any) => {
    setEditingId(med.id);
    setName(med.name);
    setGenericName(med.generic_name);
    setCategory(med.category);
    setPrice(med.price.toString());
    setStock(med.stock.toString());
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!name) return;
    try {
      if (editingId) {
        await updateMedicine(editingId, name, genericName, category, parseFloat(price) || 0, parseInt(stock) || 0);
      } else {
        await addMedicine(name, genericName, category, parseFloat(price) || 0, parseInt(stock) || 0);
      }
      setShowModal(false);
      setName("");
      setPrice("");
      setStock("");
      setEditingId(null);
      loadMedicines();
    } catch (e) {
      console.error("Failed to save medicine", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this medicine?")) {
      await deleteMedicine(id);
      loadMedicines();
    }
  };

  return (
    <div className="flex-col gap-6">
      <div className="flex justify-between items-center mb-6">
        <h1>Medicine Management</h1>
        <div className="flex gap-4">
          <button className="btn btn-primary" onClick={openModalForAdd}>
            <Plus size={18} /> Add Medicine
          </button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Medicine List</h3>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Medicine Name</th>
                <th>Generic</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicines.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    No medicines added yet.
                  </td>
                </tr>
              ) : (
                medicines.map((med) => (
                  <tr key={med.id}>
                    <td className="text-secondary">{med.id}</td>
                    <td style={{ fontWeight: 500 }}>{med.name}</td>
                    <td>{med.generic_name}</td>
                    <td>{med.category}</td>
                    <td>
                      {med.stock < 50 ? (
                        <span style={{ color: 'var(--warning-color)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <AlertTriangle size={14} /> {med.stock}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--secondary-color)' }}>{med.stock}</span>
                      )}
                    </td>
                    <td>${med.price.toFixed(2)}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => openModalForEdit(med)}><Edit size={16} /></button>
                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', color: 'var(--danger-color)' }} onClick={() => handleDelete(med.id)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Medicine</h2>
              <button className="btn btn-secondary" style={{ padding: '0.5rem', border: 'none' }} onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Medicine Name</label>
                <input type="text" className="input" placeholder="Enter medicine name" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label>Generic</label>
                  <select className="input" value={genericName} onChange={e => setGenericName(e.target.value)}>
                    <option>Paracetamol</option>
                    <option>Amoxicillin</option>
                    <option>Ibuprofen</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select className="input" value={category} onChange={e => setCategory(e.target.value)}>
                    <option>Tablets</option>
                    <option>Capsules</option>
                    <option>Syrups</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input type="number" className="input" placeholder="0.00" value={price} onChange={e => setPrice(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Initial Stock</label>
                  <input type="number" className="input" placeholder="0" value={stock} onChange={e => setStock(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save Medicine</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
