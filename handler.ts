import 'source-map-support/register';
import { DB } from './helpers/db';
import { getUserById } from './endpoints/user/getUserById';
import { login } from './endpoints/auth/login';
import { register } from './endpoints/auth/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { withPermissions } from './helpers/withPermissions';
import { genericError } from './helpers/error';

console.log('lambda Init');

const db = new DB({
    host: process.env.POSTGRESQL_HOST,
    port: process.env.POSTGRESQL_PORT,
    database: process.env.DB_NAME,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
});




export const _register = (_event, _context) => register(_event, _context, db);


export const _login = (_event, _context) => login(_event, _context, db);


export const _getUserById: APIGatewayProxyHandler = (_event, _context) => withPermissions(_event, _context, db, ["USER"])
    .then(() => getUserById(_event, _context, db))
    .catch(genericError)
