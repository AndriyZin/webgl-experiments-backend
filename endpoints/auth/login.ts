import { ApiResponse } from '../../@types/ApiResponse';
import { DB } from '../../helpers/db';
import { APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import { request } from '../../helpers/request';
import tryCatch from 'try-catch';

type LoginResponses =
    | ApiResponse<200, Paths.Login.Responses.$200>
    | ApiResponse<400, Paths.Login.Responses.$400>;



export async function login(_event, _context, db: DB): Promise<APIGatewayProxyResult> {

    const [error, body]: [any, Paths.Login.RequestBody] = tryCatch(JSON.parse, _event.body);

    return request<Paths.Login.RequestBody, LoginResponses>(body, async (body) => {

        return {
            statusCode: 200,
            data: {
                token: 'testToken',
            },
        };
    });
}
