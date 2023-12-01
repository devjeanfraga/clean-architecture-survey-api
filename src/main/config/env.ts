export default {
  port: process.env.PORT || 5050,
  dbUri: process.env.MONGO_URL,
  salt: parseInt(process.env.SALT) || 12 ,
  secretKey: process.env.SECRET_KEY || 'secret-key-test'
};
