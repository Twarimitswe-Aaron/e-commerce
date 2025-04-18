import mongoose from 'mongoose';

function connectDatabase() {
    mongoose.connect(process.env.DB_URL)
    .then((data) => {
        console.log('MongoDB connected successfully with Server:', data.connection.host);
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
}

export default connectDatabase;