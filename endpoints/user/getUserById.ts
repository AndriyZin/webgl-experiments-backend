import User = Components.Schemas.User;
import { APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import { request } from '../../helpers/request';
import { ApiResponse } from '../../@types/ApiResponse';

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



type GetUserByIdResponses =
    ApiResponse<200, Paths.GetUserById.Responses.$200>
    | ApiResponse<404, Paths.GetUserById.Responses.$404>;

export async function getUserById(_event, _context, dbClient): Promise<APIGatewayProxyResult> {
    const params: Paths.GetUserById.PathParameters = _event.pathParameters as any;

    return request<Paths.GetUserById.PathParameters, GetUserByIdResponses>(params, async (params, auth) => {
        console.log(auth);
        return {
            statusCode: 200,
            data: await getUser(dbClient, params.id)
        }
    });
}