const env = require('./config/env');
const { connectDB } = require('./config/database');
const app = require('./app');

const start = async () => {
  try {
    await connectDB();
    app.listen(env.port, () => {
      console.log(`Server listening on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

start();
