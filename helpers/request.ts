import { APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import { ApiResponse } from '../@types/ApiResponse';

export async function request<T, K>(params: T, resolver: (params: T, auth?: any) => Promise<K>): Promise<APIGatewayProxyResult> {

    const { statusCode, data } = (await resolver(params)) as any as ApiResponse<any, any>;

    return {
        statusCode,
        body: data && JSON.stringify(data, null, 2),
    };
}