import { APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import { request } from '../../helpers/request';
import { ApiResponse } from '../../@types/ApiResponse';
import { DB } from '../../helpers/db';
import User = Components.Schemas.User;
import { getUser } from '../../helpers/withPermissions';

export async function getUserFromDb(db: DB, id): Promise<User> {
    return getUser(db, id).then(user => {
        return {
            id: user.id,
            name: user.name
        }
    })
}

type GetUserByIdResponses =
    ApiResponse<200, Paths.GetUserById.Responses.$200>
    | ApiResponse<404, Paths.GetUserById.Responses.$404>;

export async function getUserById(_event, _context, db: DB): Promise<APIGatewayProxyResult> {
    const params: Paths.GetUserById.PathParameters = _event.pathParameters as any;

    return request<Paths.GetUserById.PathParameters, GetUserByIdResponses>(params, async (params) => {

        return {
            statusCode: 200,
            data: await getUserFromDb(db, params.id),
        }
    });
}