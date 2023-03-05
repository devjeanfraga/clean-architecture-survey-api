module.exports = {
  mongodbMemoryServerOptions: {
    mongodbMemoryServer: {
      version: 'latest'
    },
    binary: {
      version: '4.0.3',
      skipMD5: true,
    },
    instance: {
      dbName: 'jest',
    },
    autoStart: false,
    useSharedDBForAllJestWorkers: false,
  },
};