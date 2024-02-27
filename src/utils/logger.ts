import pino from "pino";

const logger = pino({
  name: "TODD",
  level: "debug",
});

export default logger;
