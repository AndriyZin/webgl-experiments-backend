import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { getClient } from './helpers/db';
import { APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import { getUser } from './endpoints/user/getUserById';
import { request } from './helpers/request';
import { ApiResponse } from './@types/ApiResponse';

console.log('lambda Init');

const dbClient = getClient({
    host: process.env.POSTGRESQL_HOST,
    port: process.env.POSTGRESQL_PORT,
    database: process.env.DB_NAME,
    user: process.env.USERNAME,
    password: process.env.PASSWORD
})

dbClient.connect()


type GetUserByIdResponses =
    ApiResponse<200, Paths.GetUserById.Responses.$200>
    | ApiResponse<404, Paths.GetUserById.Responses.$404>;

export const getUserById: APIGatewayProxyHandler = async (_event, _context): Promise<APIGatewayProxyResult> => {
    const params: Paths.GetUserById.PathParameters = _event.pathParameters as any;

    return request<Paths.GetUserById.PathParameters, GetUserByIdResponses>(params, async (params) => {
        return {
            statusCode: 200,
            data: await getUser(dbClient, params.id)
        }
    });
}