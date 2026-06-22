import { useState } from "react";
import { CreditCard, AlertCircle, Clock, FileText } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("payment");

  return (
    <div className="flex-col gap-6">
      <div className="flex justify-between items-center mb-6">
        <h1>Settings & Reports</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <button 
          className={`card flex-col items-center gap-2 justify-center ${activeTab === 'payment' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('payment')}
          style={{ cursor: 'pointer', border: activeTab === 'payment' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)' }}
        >
          <CreditCard size={32} color={activeTab === 'payment' ? 'var(--primary-color)' : 'var(--text-secondary)'} />
          <h3 style={{ fontSize: '1rem', textAlign: 'center', margin: 0, color: activeTab === 'payment' ? 'var(--primary-color)' : 'var(--text-primary)' }}>Payment Method</h3>
        </button>

        <button 
          className={`card flex-col items-center gap-2 justify-center ${activeTab === 'stock' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('stock')}
          style={{ cursor: 'pointer', border: activeTab === 'stock' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)' }}
        >
          <AlertCircle size={32} color={activeTab === 'stock' ? 'var(--primary-color)' : 'var(--text-secondary)'} />
          <h3 style={{ fontSize: '1rem', textAlign: 'center', margin: 0, color: activeTab === 'stock' ? 'var(--primary-color)' : 'var(--text-primary)' }}>Stock Info</h3>
        </button>

        <button 
          className={`card flex-col items-center gap-2 justify-center ${activeTab === 'expire' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('expire')}
          style={{ cursor: 'pointer', border: activeTab === 'expire' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)' }}
        >
          <Clock size={32} color={activeTab === 'expire' ? 'var(--primary-color)' : 'var(--text-secondary)'} />
          <h3 style={{ fontSize: '1rem', textAlign: 'center', margin: 0, color: activeTab === 'expire' ? 'var(--primary-color)' : 'var(--text-primary)' }}>Expire Info</h3>
        </button>

        <button 
          className={`card flex-col items-center gap-2 justify-center ${activeTab === 'invoice' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('invoice')}
          style={{ cursor: 'pointer', border: activeTab === 'invoice' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)' }}
        >
          <FileText size={32} color={activeTab === 'invoice' ? 'var(--primary-color)' : 'var(--text-secondary)'} />
          <h3 style={{ fontSize: '1rem', textAlign: 'center', margin: 0, color: activeTab === 'invoice' ? 'var(--primary-color)' : 'var(--text-primary)' }}>Invoices</h3>
        </button>
      </div>

      <div className="card">
        {activeTab === "payment" && (
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>Add Payment Method</h3>
            <form className="flex-col gap-4" style={{ maxWidth: '500px' }} onSubmit={(e) => e.preventDefault()}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Payment Type</label>
                <select className="input">
                  <option>Credit Card</option>
                  <option>Bank Transfer</option>
                  <option>Cash</option>
                  <option>Mobile Wallet</option>
                </select>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Account Name / Holder Name</label>
                <input type="text" className="input" placeholder="e.g. John Doe" />
              </div>
              <div style={{ marginTop: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Details</label>
                <input type="text" className="input" placeholder="Card number or Account number" />
              </div>
              <button className="btn btn-primary" style={{ marginTop: '1.5rem', width: 'fit-content' }}>Save Payment Method</button>
            </form>
          </div>
        )}

        {activeTab === "stock" && (
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>Medicine Stock Information</h3>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Category</th>
                    <th>Current Stock</th>
                    <th>Reorder Level</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 500 }}>Amoxil 250mg</td>
                    <td>Capsules</td>
                    <td>20</td>
                    <td>50</td>
                    <td><span style={{ color: 'var(--danger-color)' }}>Low Stock</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500 }}>Panadol 500mg</td>
                    <td>Tablets</td>
                    <td>1500</td>
                    <td>200</td>
                    <td><span style={{ color: 'var(--secondary-color)' }}>In Stock</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "expire" && (
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>Medicine Expiry Information</h3>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Batch No</th>
                    <th>Stock</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 500 }}>Vitamin C 500mg</td>
                    <td>B-7845</td>
                    <td>150</td>
                    <td>Nov 15, 2023</td>
                    <td><span style={{ color: 'var(--danger-color)' }}>Expiring Soon</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500 }}>Ibuprofen</td>
                    <td>B-9021</td>
                    <td>340</td>
                    <td>Dec 20, 2025</td>
                    <td><span style={{ color: 'var(--secondary-color)' }}>Valid</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "invoice" && (
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>Supplier Invoice Management</h3>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Invoice No</th>
                    <th>Supplier</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 500 }}>INV-55012</td>
                    <td>PharmaCorp Ltd</td>
                    <td>Oct 12, 2023</td>
                    <td>$1,250.00</td>
                    <td><span style={{ color: 'var(--secondary-color)' }}>Paid</span></td>
                    <td><button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}>View</button></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500 }}>INV-55045</td>
                    <td>MediSupply Inc</td>
                    <td>Oct 15, 2023</td>
                    <td>$840.50</td>
                    <td><span style={{ color: 'var(--warning-color)' }}>Unpaid</span></td>
                    <td><button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}>Pay Now</button></td>
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
