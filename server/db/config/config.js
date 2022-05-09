module.exports = {
  development: {
    // username: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME,
    // host: process.env.DB_HOST,
    // dialect: 'postgres',
    use_env_variable: process.env.DATABASE_URL,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  },
  production: {
    // username: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME,
    // host: process.env.DB_HOST,
    // dialect: 'postgres',
    use_env_variable: process.env.DATABASE_URL,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  },
};
