export default {
  port: process.env.PORT || 5050,
  dbUri: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-survey-api',
  salt: parseInt(process.env.SALT) || 12 ,
  secretKey: process.env.SECRET_KEY || 'secret-key-test'
};