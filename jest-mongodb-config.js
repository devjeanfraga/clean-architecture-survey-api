module.exports = {
  mongodbMemoryServerOptions: {
    mongodbMemoryServer: {
      version: 'latest'
    },
    binary: {
      version: '4.2.0',
      skipMD5: true,
    },
    instance: {
      dbName: 'jest',
    },
    autoStart: false,
    useSharedDBForAllJestWorkers: false,
  },
};