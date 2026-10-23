import { createApp } from './app.js';
import { ENV } from './config/env.js';

const app = createApp();

app.listen(ENV.PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 KosMate Backend Server running on port ${ENV.PORT}`);
  console.log(`📡 URL: http://localhost:${ENV.PORT}`);
  console.log(`🩺 Health check: http://localhost:${ENV.PORT}/api/v1/health`);
  console.log(`=======================================================`);
});
