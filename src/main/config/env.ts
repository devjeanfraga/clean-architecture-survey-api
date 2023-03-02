export default {
  port: process.env.PORT || 5050,
  dbUri: global.__MONGO_URI__ ||'mongodb://localhost:27017/clean-survey-api'
};