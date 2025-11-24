export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  databaseService: {
    baseUrl: process.env.DATABASE_SERVICE_URL,
  },
});