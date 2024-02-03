module.exports = {
    apps: [
      {
        name: 'app1',
        script: './dist/src/index.js',
        env: {
          PORT: 3000,
          MONGO_URL: 'mongodb+srv://guardiao3301:uPgvdRyU2RxF1hy6@cluster0.nxhcsas.mongodb.net/db?retryWrites=true&w=majority',
          NODE_ENV: 'PRODUCTION',
          REDIS: 'redis://default:amjNR7LYEKjLbxGr1TUL8PLWq0yHMJCc@redis-13009.c289.us-west-1-2.ec2.cloud.redislabs.com:13009',
          CLERK_SECRET_KEY: 'sk_test_vLcwR2JhrsUfUxHA88Gn9uI92mmLb4zt8J7qmPtdsR',
          OPENAI_API_KEY: ''
        }
      }
    ]
  };
  