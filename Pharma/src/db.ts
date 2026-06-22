import Database from '@tauri-apps/plugin-sql';

let dbInstance: Database | null = null;

export async function getDb(): Promise<Database> {
  if (dbInstance) return dbInstance;
  
  dbInstance = await Database.load('sqlite:pharma.db');
  await initializeDb(dbInstance);
  return dbInstance;
}

async function initializeDb(db: Database) {
  // Create generic table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS generics (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'Active'
    )
  `);

  // Create medicine table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS medicines (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      generic_name TEXT,
      category TEXT NOT NULL,
      stock INTEGER DEFAULT 0,
      price REAL DEFAULT 0.0
    )
  `);

  // Create supplier table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS suppliers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      contact_person TEXT,
      phone TEXT,
      email TEXT,
      address TEXT
    )
  `);
}

// --- Generics ---
export async function addGeneric(name: string, category: string, description: string) {
  const db = await getDb();
  const id = `GEN-${Math.floor(Math.random() * 10000)}`;
  await db.execute(
    'INSERT INTO generics (id, name, category, description, status) VALUES ($1, $2, $3, $4, $5)',
    [id, name, category, description, 'Active']
  );
  return id;
}

export async function updateGeneric(id: string, name: string, category: string, description: string) {
  const db = await getDb();
  await db.execute(
    'UPDATE generics SET name = $1, category = $2, description = $3 WHERE id = $4',
    [name, category, description, id]
  );
}

export async function getGenerics() {
  const db = await getDb();
  return await db.select('SELECT * FROM generics');
}

export async function deleteGeneric(id: string) {
  const db = await getDb();
  await db.execute('DELETE FROM generics WHERE id = $1', [id]);
}

// --- Medicines ---
export async function addMedicine(name: string, genericName: string, category: string, price: number, stock: number) {
  const db = await getDb();
  const id = `MED-${Math.floor(Math.random() * 10000)}`;
  await db.execute(
    'INSERT INTO medicines (id, name, generic_name, category, price, stock) VALUES ($1, $2, $3, $4, $5, $6)',
    [id, name, genericName, category, price, stock]
  );
  return id;
}

export async function updateMedicine(id: string, name: string, genericName: string, category: string, price: number, stock: number) {
  const db = await getDb();
  await db.execute(
    'UPDATE medicines SET name = $1, generic_name = $2, category = $3, price = $4, stock = $5 WHERE id = $6',
    [name, genericName, category, price, stock, id]
  );
}

export async function getMedicines() {
  const db = await getDb();
  return await db.select('SELECT * FROM medicines');
}

export async function deleteMedicine(id: string) {
  const db = await getDb();
  await db.execute('DELETE FROM medicines WHERE id = $1', [id]);
}

// --- Suppliers ---
export async function addSupplier(name: string, contactPerson: string, phone: string, email: string, address: string) {
  const db = await getDb();
  const id = `SUP-${Math.floor(Math.random() * 10000)}`;
  await db.execute(
    'INSERT INTO suppliers (id, name, contact_person, phone, email, address) VALUES ($1, $2, $3, $4, $5, $6)',
    [id, name, contactPerson, phone, email, address]
  );
  return id;
}

export async function updateSupplier(id: string, name: string, contactPerson: string, phone: string, email: string, address: string) {
  const db = await getDb();
  await db.execute(
    'UPDATE suppliers SET name = $1, contact_person = $2, phone = $3, email = $4, address = $5 WHERE id = $6',
    [name, contactPerson, phone, email, address, id]
  );
}

export async function getSuppliers() {
  const db = await getDb();
  return await db.select('SELECT * FROM suppliers');
}

export async function deleteSupplier(id: string) {
  const db = await getDb();
  await db.execute('DELETE FROM suppliers WHERE id = $1', [id]);
}

