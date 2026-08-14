import { readFileSync } from 'fs';
import { join } from 'path';
import { query, initializeDatabase, testConnection } from './connection';

/**
 * Run SQL schema file
 */
export async function runSchema(schemaPath: string): Promise<void> {
  console.log('Running schema from:', schemaPath);
  const schema = readFileSync(schemaPath, 'utf-8');
  
  // Split by semicolon and execute each statement
  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const statement of statements) {
    try {
      await query(statement);
    } catch (error) {
      console.error('Error executing statement:', statement.substring(0, 100));
      throw error;
    }
  }
  
  console.log('Schema executed successfully');
}

/**
 * Run SQL seed file
 */
export async function runSeed(seedPath: string): Promise<void> {
  console.log('Running seed from:', seedPath);
  const seed = readFileSync(seedPath, 'utf-8');
  
  // Split by semicolon and execute each statement
  const statements = seed
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const statement of statements) {
    try {
      await query(statement);
    } catch (error) {
      // Ignore duplicate key errors in seed data
      if (error instanceof Error && !error.message.includes('duplicate key')) {
        console.error('Error executing statement:', statement.substring(0, 100));
        throw error;
      }
    }
  }
  
  console.log('Seed data executed successfully');
}

/**
 * Setup database (schema + seed)
 */
export async function setupDatabase(): Promise<void> {
  try {
    console.log('Starting database setup...');
    
    // Initialize connection
    initializeDatabase();
    
    // Test connection
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Failed to connect to database');
    }
    
    // Run schema
    const schemaPath = join(__dirname, 'schema.sql');
    await runSchema(schemaPath);
    
    // Run seed (optional - can be skipped in production)
    const seedPath = join(__dirname, 'seed.sql');
    await runSeed(seedPath);
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  }
}

/**
 * Reset database (drop and recreate)
 */
export async function resetDatabase(): Promise<void> {
  try {
    console.log('Resetting database...');
    
    // Drop all tables
    const tables = [
      'audit_logs',
      'notifications',
      'kyc_verifications',
      'payment_transactions',
      'disputes',
      'security_deposits',
      'rent_payments',
      'leases',
      'applications',
      'properties',
      'users'
    ];
    
    for (const table of tables) {
      await query(`DROP TABLE IF EXISTS ${table} CASCADE`);
    }
    
    console.log('Tables dropped');
    
    // Re-run setup
    await setupDatabase();
    
    console.log('Database reset completed successfully');
  } catch (error) {
    console.error('Database reset failed:', error);
    throw error;
  }
}
