export default {
  port: process.env.PORT,
  dbUri: process.env.MONGO_URL,
  salt: parseInt(process.env.SALT),
  secretKey: process.env.SECRET_KEY
};