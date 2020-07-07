import 'source-map-support/register';
import { getUserById } from './endpoints/user/getUserById';
import { DB } from './helpers/db';

console.log('lambda Init');

const db = new DB({
    host: process.env.POSTGRESQL_HOST,
    port: process.env.POSTGRESQL_PORT,
    database: process.env.DB_NAME,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
});


export const _getUserById = (_event, _context) => getUserById(_event, _context, db);
