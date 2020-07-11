import { ApiResponse } from "../../@types/ApiResponse";
import { DB } from "../../helpers/db";
import { APIGatewayProxyResult } from "aws-lambda/trigger/api-gateway-proxy";
import tryCatch from "try-catch";
import { request } from "../../helpers/request";
import { User } from "../../@types/User";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

type RegisterResponses = ApiResponse<200, Paths.Register.Responses.$200>;

async function createUser(data: Paths.Register.RequestBody, db: DB): Promise<User> {
    const salt = await bcrypt.genSalt();
    return (await db.getInstance()).models.User.create({
        login: data.login,
        password: await bcrypt.hash(data.password, salt),
    }).then((response) => response.toJSON() as User);
}

function validateUserData(data: Paths.Login.RequestBody): boolean {
    return true;
}

export async function register(_event, _context, db: DB): Promise<APIGatewayProxyResult> {
    const [error, body]: [any, Paths.Register.RequestBody] = tryCatch(JSON.parse, _event.body);

    if(error) throw error;

    return request<Paths.Register.RequestBody, RegisterResponses>(body, async (body) => {
        const isValid = validateUserData(body);
        if (!isValid) console.error("user is invalid");

        const user = await createUser(body, db);

        return {
            statusCode: 200,
            data: {
                token: jwt.sign({ id: user.id }, process.env.SECRET),
            },
        };
    });
}
