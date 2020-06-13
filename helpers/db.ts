const { Client } = require('pg');


export function getClient(config) {
    return new Client(config)
}

export async function init(client) {
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

