import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`✅ MONGODB Connected  !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("❌ MONGODB Connection Error:", error);
        process.exit(1); // Fix: Corrected from 'exist' to 'exit'
    }
};

export default connectDB;