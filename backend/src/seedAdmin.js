import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model.js';
// import colors from 'colors';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(`${process.env.MONGO_URI}`)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  });

// Admin user data
const adminData = {
  name: '',
  email: '',
  password: '',  // This will be hashed by the pre-save hook
  isAdmin: true,
  subscriptionStatus: 'premium',
  subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),  // 1 year from now
};

// Function to seed admin user
const seedAdmin = async () => {
  try {
    console.log('Checking for existing admin user...');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('Admin user already exists, updating...');
      
      // Update existing admin - don't modify password if it exists
      existingAdmin.name = adminData.name;
      existingAdmin.isAdmin = true;
      existingAdmin.subscriptionStatus = adminData.subscriptionStatus;
      existingAdmin.subscriptionExpiry = adminData.subscriptionExpiry;
      
      await existingAdmin.save();
      console.log('Admin user updated successfully');
    } else {
      console.log('Creating new admin user...');
      
      // Create new admin user
      await User.create(adminData);
      console.log('Admin user created successfully');
    }
    
    console.log('\nAdmin User Details:');
    console.log(`Name: ${adminData.name}`);
    console.log(`Email: ${adminData.email}`);
    console.log(`Password: ${adminData.password} (used only for new user creation)`);
    console.log(`Admin Status: ${adminData.isAdmin}`);
    console.log(`Subscription: ${adminData.subscriptionStatus}`);
    
    console.log('\nYou can now log in with these credentials.');
    
    // Close the connection
    mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error(`Error seeding admin user: ${error.message}`);
    mongoose.disconnect();
    process.exit(1);
  }
};

// Run the seeding function
seedAdmin();