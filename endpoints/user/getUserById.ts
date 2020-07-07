import User = Components.Schemas.User;
import { APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import { request } from '../../helpers/request';
import { ApiResponse } from '../../@types/ApiResponse';
import { Model } from 'sequelize';
import { DB } from '../../helpers/db';

export async function getUser(db: DB, id): Promise<Model<User>> {
    const client = await db.getInstance()
    return client.models.User.findOne({
        where: {
            id,
        }
    });
}

type GetUserByIdResponses =
    ApiResponse<200, Model<Paths.GetUserById.Responses.$200>>
    | ApiResponse<404, Paths.GetUserById.Responses.$404>;

export async function getUserById(_event, _context, db: DB): Promise<APIGatewayProxyResult> {
    const params: Paths.GetUserById.PathParameters = _event.pathParameters as any;

    return request<Paths.GetUserById.PathParameters, GetUserByIdResponses>(params, async (params) => {
        return {
            statusCode: 200,
            data: await getUser(db, params.id),
        }
    });
}