import 'source-map-support/register';
import { getClient } from './helpers/db';
import { getUserById } from './endpoints/user/getUserById';

console.log('lambda Init');

const dbClient = getClient({
    host: process.env.POSTGRESQL_HOST,
    port: process.env.POSTGRESQL_PORT,
    database: process.env.DB_NAME,
    user: process.env.USERNAME,
    password: process.env.PASSWORD
})

dbClient.connect()

export const _getUserById = (_event, _context) => getUserById(_event, _context, dbClient);

