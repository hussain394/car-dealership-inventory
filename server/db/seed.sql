
INSERT INTO users (email, password_hash, role)
VALUES ('admin@dealership.com', '<PASTE_BCRYPT_HASH_HERE>', 'admin');


INSERT INTO vehicles (make, model, category, price, quantity) VALUES
  ('Toyota', 'Camry', 'Sedan', 28500.00, 5),
  ('Ford', 'F-150', 'Truck', 42000.00, 3),
  ('Honda', 'CR-V', 'SUV', 31500.00, 0),
  ('Tesla', 'Model 3', 'Electric', 39990.00, 2);
