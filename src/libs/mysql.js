import mysql from 'serverless-mysql';

export const connection = mysql ({
    config: {
        host: 'localhost',
        user: 'arthur',
        password: '25355',
        port: 3306,
        database: 'healthyfocus'
    }
})