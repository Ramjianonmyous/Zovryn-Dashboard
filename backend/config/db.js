const mongoose=require('mongoose');
const connectDB=async()=>{try{const c=await mongoose.connect(process.env.MONGODB_URI);console.log('MongoDB: '+c.connection.host)}catch(e){console.error('Database connection error: ' + e.message)}};
module.exports=connectDB;