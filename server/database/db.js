import mongoose  from 'mongoose';

const Connection = async (username = 'dabral', password = '9541246292') => {
    const URL = `mongodb://${username}:${password}@real-time-doc-shard-00-00.zsmnx.mongodb.net:27017,real-time-doc-shard-00-01.zsmnx.mongodb.net:27017,real-time-doc-shard-00-02.zsmnx.mongodb.net:27017/REAL-TIME-DOCS?ssl=true&replicaSet=atlas-75wsm2-shard-0&authSource=admin&retryWrites=true&w=majority`;

    try {
        await mongoose.connect(URL, { useUnifiedTopology: true, useNewUrlParser: true });
        console.log('Database connected successfully');
    } catch (error) {   
        console.log('Error while connecting with the database ', error);
    }
}

export default Connection;