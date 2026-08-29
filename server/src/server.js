import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/db.js';

const port = Number(process.env.PORT) || 5000;
const start = async () => {
  await connectDatabase();
  const server = app.listen(port, () => console.info(`FreshBasket API listening on port ${port}`));
  const shutdown = () => server.close(() => process.exit(0));
  process.on('SIGINT', shutdown); process.on('SIGTERM', shutdown);
};
start().catch((error) => { console.error('Unable to start API:', error.message); process.exit(1); });
