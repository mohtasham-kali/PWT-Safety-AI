import { useRef } from "react";
import { Plus, FileDown, FileUp, Eye } from "lucide-react";

export default function MedicineOrder() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`CSV File "${file.name}" selected for import!`);
      // Here you would parse the CSV
    }
  };

  const handleExportClick = () => {
    alert("Exporting orders to CSV... (This will trigger a download in the full app)");
  };

  return (
    <div className="flex-col gap-6">
      <div className="flex justify-between items-center mb-6">
        <h1>Medicine Order Management</h1>
        <div className="flex gap-4">
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            style={{ display: "none" }} 
            onChange={handleFileChange}
          />
          <button className="btn btn-secondary" onClick={handleImportClick}>
            <FileUp size={18} /> Import CSV
          </button>
          <button className="btn btn-secondary" onClick={handleExportClick}>
            <FileDown size={18} /> Export CSV
          </button>
          <button className="btn btn-primary">
            <Plus size={18} /> Place Order
          </button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Order List</h3>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Supplier</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-secondary">ORD-2023-1001</td>
                <td style={{ fontWeight: 500 }}>PharmaCorp Ltd</td>
                <td>Oct 12, 2023</td>
                <td>$1,250.00</td>
                <td>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    backgroundColor: '#d1fae5', 
                    color: '#10b981',
                    borderRadius: '999px',
                    fontSize: '0.875rem' 
                  }}>
                    Delivered
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}><Eye size={16} /></button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="text-secondary">ORD-2023-1002</td>
                <td style={{ fontWeight: 500 }}>MediSupply Inc</td>
                <td>Oct 15, 2023</td>
                <td>$840.50</td>
                <td>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    backgroundColor: '#fef3c7', 
                    color: '#d97706',
                    borderRadius: '999px',
                    fontSize: '0.875rem' 
                  }}>
                    Pending
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}><Eye size={16} /></button>
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
