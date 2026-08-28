const app = require("./src/app");
const { connectDB } = require("./src/config/db");
const logger = require("./src/config/logger");
const { nodeEnv, port } = require("./src/config/env");

connectDB().then(() => {
  app.listen(port, () => {
    logger.info(`BeYuumi API server running in ${nodeEnv} mode on port ${port}`);
  });
});
