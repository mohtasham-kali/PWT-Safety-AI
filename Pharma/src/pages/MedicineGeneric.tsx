import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { getGenerics, addGeneric, updateGeneric, deleteGeneric } from "../db";

export default function MedicineGeneric() {
  const [showModal, setShowModal] = useState(false);
  const [generics, setGenerics] = useState<any[]>([]);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Tablets");
  const [description, setDescription] = useState("");

  const loadGenerics = async () => {
    try {
      const data = await getGenerics();
      setGenerics(data as any[]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadGenerics();
  }, []);

  const openModalForAdd = () => {
    setEditingId(null);
    setName("");
    setCategory("Tablets");
    setDescription("");
    setShowModal(true);
  };

  const openModalForEdit = (gen: any) => {
    setEditingId(gen.id);
    setName(gen.name);
    setCategory(gen.category);
    setDescription(gen.description || "");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!name) return;
    try {
      if (editingId) {
        await updateGeneric(editingId, name, category, description);
      } else {
        await addGeneric(name, category, description);
      }
      setShowModal(false);
      setName("");
      setDescription("");
      setEditingId(null);
      loadGenerics(); // Refresh list
    } catch (e) {
      console.error("Failed to save generic", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this generic?")) {
      await deleteGeneric(id);
      loadGenerics();
    }
  };

  return (
    <div className="flex-col gap-6">
      <div className="flex justify-between items-center mb-6">
        <h1>Medicine Generic Management</h1>
        <div className="flex gap-4">
          <button className="btn btn-primary" onClick={openModalForAdd}>
            <Plus size={18} /> Add Generic
          </button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Generic List</h3>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Generic Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {generics.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    No generics added yet.
                  </td>
                </tr>
              ) : (
                generics.map((gen) => (
                  <tr key={gen.id}>
                    <td className="text-secondary">{gen.id}</td>
                    <td style={{ fontWeight: 500 }}>{gen.name}</td>
                    <td><span style={{ padding: '0.25rem 0.75rem', backgroundColor: 'var(--bg-color)', borderRadius: '999px', fontSize: '0.875rem' }}>{gen.category}</span></td>
                    <td className="text-secondary">{gen.description}</td>
                    <td><span style={{ color: 'var(--secondary-color)' }}>{gen.status}</span></td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => openModalForEdit(gen)}><Edit size={16} /></button>
                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', color: 'var(--danger-color)' }} onClick={() => handleDelete(gen.id)}><Trash2 size={16} /></button>
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
              <h2>Add New Generic</h2>
              <button className="btn btn-secondary" style={{ padding: '0.5rem', border: 'none' }} onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label>Generic Name</label>
                  <input type="text" className="input" placeholder="e.g., Paracetamol" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select className="input" value={category} onChange={e => setCategory(e.target.value)}>
                    <option>Tablets</option>
                    <option>Capsules</option>
                    <option>Syrups</option>
                    <option>Injections</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="input" placeholder="Usage description" style={{ resize: 'vertical', minHeight: '80px' }} value={description} onChange={e => setDescription(e.target.value)}></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save Generic</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
