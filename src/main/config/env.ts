export default {
  port: process.env.PORT || 5050,
  dbUri: process.env.MONGO_URL || "mongodb+srv://jeanfraga:admin@cluster0.tivsig0.mongodb.net/?retryWrites=true&w=majority",
  salt: parseInt(process.env.SALT) || 12 ,
  secretKey: process.env.SECRET_KEY || 'secret-key-test'
};
