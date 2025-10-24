import mongoose from "mongoose";

const connectDB = async () => {
    console.log("Connecting to MongoDB...");
    try {
        await mongoose.connect(process.env.DB_URL || "mongodb+srv://harman:harman@ticketbook.oxlckbw.mongodb.net/?retryWrites=true&w=majority&appName=ticketBook");
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}

export default connectDB;