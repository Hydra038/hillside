import { Client } from 'pg';

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_uUSKwP17ZhfH@ep-green-bush-adlh0whf-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

client.connect();

client.query(
  "SELECT column_name FROM information_schema.columns WHERE table_name = 'products'",
  (err, res) => {
    if (err) throw err;
    console.log('Products table columns:', res.rows.map(r => r.column_name));
    client.end();
  }
);
