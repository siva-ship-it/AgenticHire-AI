import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';

connectDatabase()
  .then(() => app.listen(env.PORT, () => console.log(`AgenticHire API listening on http://localhost:${env.PORT}`)))
  .catch((error) => {
    console.error(`Unable to start server [${error.code || 'STARTUP_ERROR'}]: ${error.message}`);
    if (error.code === 'MONGODB_UNAVAILABLE') {
      console.error('Local setup: from the project root run "docker compose up -d", then restart this server.');
      console.error('Atlas setup: create server/.env and set MONGODB_URI to your Atlas connection string.');
    }
    process.exit(1);
  });
