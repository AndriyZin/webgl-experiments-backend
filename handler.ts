import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

const { Client } = require('pg');

async function init(client) {
    await client.query(`
    CREATE TABLE IF NOT EXISTS users
    (
        id serial not null PRIMARY KEY, 
        created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        uuid char(36) not null, 
        name varchar(100) not null
    );  
    `)

    await client.query(`
    CREATE TABLE IF NOT EXISTS posts
    (
        id serial not null PRIMARY KEY, 
        created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        uuid char(36) not null, 
        text varchar(100) not null, 
        user_id INT not null
    );  
    `)
}

async function getUser(client, uuid) {
    const user: any = {};
    const userFromDb = await client.query(`
    select id, uuid, name from users where uuid = $1 
    `, [uuid])
    if (userFromDb.rows.length == 0) {
        return null;
    }
    var postsFromDb = await client.query(`
    select uuid, text from posts where user_id = $1
    `, [userFromDb.rows[ 0 ].id])

    user.UUID = userFromDb.rows[ 0 ].uuid;
    user.Name = userFromDb.rows[ 0 ].name;

    if (postsFromDb.rows.length > 0) {
        user.Posts = postsFromDb.rows.map(function (x) {
            return { UUID: x.uuid, Text: x.text }
        });
    }

    return user;
}

console.log('lambda Init');

const client = new Client({
    host: process.env.POSTGRESQL_HOST,
    port: process.env.POSTGRESQL_PORT,
    database: process.env.DB_NAME,
    user: process.env.USERNAME,
    password: process.env.PASSWORD
})

client.connect()

export const getUserById: APIGatewayProxyHandler = async (_event, _context) => {

    await init(client)

    const resp = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
            data: await getUser(client, 1),
        }, null, 2),
    };

    return resp;
}
