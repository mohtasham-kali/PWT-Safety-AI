import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { getSuppliers, addSupplier, updateSupplier, deleteSupplier } from "../db";

export default function MedicineSupplier() {
  const [showModal, setShowModal] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const loadSuppliers = async () => {
    try {
      const data = await getSuppliers();
      setSuppliers(data as any[]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const openModalForAdd = () => {
    setEditingId(null);
    setName("");
    setContactPerson("");
    setPhone("");
    setEmail("");
    setAddress("");
    setShowModal(true);
  };

  const openModalForEdit = (sup: any) => {
    setEditingId(sup.id);
    setName(sup.name);
    setContactPerson(sup.contact_person);
    setPhone(sup.phone);
    setEmail(sup.email);
    setAddress(sup.address);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!name) return;
    try {
      if (editingId) {
        await updateSupplier(editingId, name, contactPerson, phone, email, address);
      } else {
        await addSupplier(name, contactPerson, phone, email, address);
      }
      setShowModal(false);
      setName("");
      setContactPerson("");
      setPhone("");
      setEmail("");
      setAddress("");
      setEditingId(null);
      loadSuppliers();
    } catch (e) {
      console.error("Failed to save supplier", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      await deleteSupplier(id);
      loadSuppliers();
    }
  };

  return (
    <div className="flex-col gap-6">
      <div className="flex justify-between items-center mb-6">
        <h1>Medicine Supplier Management</h1>
        <div className="flex gap-4">
          <button className="btn btn-primary" onClick={openModalForAdd}>
            <Plus size={18} /> Add Supplier
          </button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Supplier List</h3>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Supplier Name</th>
                <th>Contact Person</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    No suppliers added yet.
                  </td>
                </tr>
              ) : (
                suppliers.map((sup) => (
                  <tr key={sup.id}>
                    <td className="text-secondary">{sup.id}</td>
                    <td style={{ fontWeight: 500 }}>{sup.name}</td>
                    <td>{sup.contact_person}</td>
                    <td>{sup.phone}</td>
                    <td className="text-secondary">{sup.email}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => openModalForEdit(sup)}><Edit size={16} /></button>
                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', color: 'var(--danger-color)' }} onClick={() => handleDelete(sup.id)}><Trash2 size={16} /></button>
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
              <h2>Add New Supplier</h2>
              <button className="btn btn-secondary" style={{ padding: '0.5rem', border: 'none' }} onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Supplier Name</label>
                <input type="text" className="input" placeholder="Enter supplier name" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label>Contact Person</label>
                  <input type="text" className="input" placeholder="Contact person name" value={contactPerson} onChange={e => setContactPerson(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="text" className="input" placeholder="+1..." value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="input" placeholder="supplier@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea className="input" placeholder="Full address" style={{ resize: 'vertical', minHeight: '80px' }} value={address} onChange={e => setAddress(e.target.value)}></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save Supplier</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
