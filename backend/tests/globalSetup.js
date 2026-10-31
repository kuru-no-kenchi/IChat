const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async () => {
  const mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI_TEST = mongod.getUri('samar_test');
  global.__MONGOD__ = mongod;
};