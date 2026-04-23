// Initialize MongoDB collections and indexes
db = db.getSiblingDB("nodejs_app_db");

// Create users collection
db.createCollection("users");
db.users.createIndex({ email: 1 }, { unique: true });

// Create products collection
db.createCollection("products");
db.products.createIndex({ name: 1 });

// Create orders collection
db.createCollection("orders");
db.orders.createIndex({ userId: 1, createdAt: -1 });

// Insert sample data
db.users.insertMany([
  {
    _id: ObjectId(),
    name: "John Doe",
    email: "john@example.com",
    createdAt: new Date(),
  },
  {
    _id: ObjectId(),
    name: "Jane Smith",
    email: "jane@example.com",
    createdAt: new Date(),
  },
]);

db.products.insertMany([
  {
    _id: ObjectId(),
    name: "Laptop",
    price: 999.99,
    stock: 10,
    createdAt: new Date(),
  },
  {
    _id: ObjectId(),
    name: "Mouse",
    price: 29.99,
    stock: 50,
    createdAt: new Date(),
  },
]);

print("MongoDB initialization completed!");
