export default {
    // db: {
    //     url: process.env.DB_URL || 'mongodb://localhost:27017/myapp',
    // },
    // jwt: {
    //     secret: process.env.JWT_SECRET || 'mysecret',
    // },
    database: {
        // host: 'localhost',
        // user: 'root',
        // password: 'password',
        // database: 'my_database'
        path: 'db.json'
    },
    server: {
        host: 'localhost',
        port: '3000'
    }
};