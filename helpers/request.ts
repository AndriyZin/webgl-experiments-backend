import { APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import { ApiResponse } from '../@types/ApiResponse';

export async function request<T, K>(params: T, resolver: (params: T) => Promise<K>): Promise<APIGatewayProxyResult> {

    const { statusCode, data } = (await resolver(params)) as any as ApiResponse<any, any>;

    const resp = {
        statusCode,
        body: JSON.stringify(data, null, 2),
    };
    return resp;
}