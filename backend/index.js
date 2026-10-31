require('dotenv').config(); // must run before the app's modules read process.env
const connectDB = require('./db');

for (const name of ['JWT_SECRET', 'MONGODB_URI', 'LLM_API_KEY', 'CLIENT_ORIGIN']) {
  if (!process.env[name]) throw new Error(`${name} is not set in .env`);
}

const app = require('./app');
const PORT = process.env.PORT || 5000;
connectDB().then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)));