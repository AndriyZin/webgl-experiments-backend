import User = Components.Schemas.User;

export async function getUser(client, uuid): Promise<User> {
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


