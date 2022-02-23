require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
  GMAIL_USERNAME: process.env.GMAIL_USERNAME,
};
