CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  weight DECIMAL(10,2),
  dimensions JSONB,
  moisture DECIMAL(5,2),
  season TEXT,
  features JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
