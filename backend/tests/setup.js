const mongoose = require('mongoose');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
    await Promise.all(Object.values(mongoose.models).map((m) => m.init()));
});

afterEach(async () => {
    for (const collection of Object.values(mongoose.connection.collections)) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.disconnect();
});