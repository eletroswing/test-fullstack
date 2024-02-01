module.exports = {
    apps: [
      {
        name: 'app1',
        script: './dist/src/index.js',
        env: {
          PORT: 3000,
          CLERK_SECRET_KEY: '',
          MONGO_URL: '',
          NODE_ENV: 'DEVELOPMENT',
        }
      },
      {
        name: 'app2',
        script: './dist/src/index.js',
        env: {
          PORT: 3001,
          CLERK_SECRET_KEY: '',
          MONGO_URL: '',
          NODE_ENV: 'DEVELOPMENT',
        }
      },
      {
        name: 'app3',
        script: './dist/src/index.js',
        env: {
          PORT: 3002,
          CLERK_SECRET_KEY: '',
          MONGO_URL: '',
          NODE_ENV: 'DEVELOPMENT',
        }
      },
      {
        name: 'app4',
        script: './dist/src/index.js',
        env: {
          PORT: 3004,
          CLERK_SECRET_KEY: '',
          MONGO_URL: '',
          NODE_ENV: 'DEVELOPMENT',
        }
      },
    ]
  };
  