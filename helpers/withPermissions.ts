import { DB } from "./db";
import { User } from "../@types/User";
import * as jwt from "jsonwebtoken";

export async function getUser(db: DB, id): Promise<User> {
    return (await db.getInstance()).models.User.findOne({
        where: {
            id,
        },
    })
        .then((user) => {
            if (!user) throw "user not found";
            return user;
        })
        .then((response) => response.toJSON() as User);
}

export async function withPermissions(
    _event,
    _context,
    db: DB,
    permissions: Array<string>,
): Promise<User> {
    const token = (_event.headers["Authorization"] || _event.headers["authorization"])!.split(
        " ",
    )[1];
    const tokenData = jwt.decode(token);
    const user = await getUser(db, tokenData["id"]);
    const hasPermissions = permissions.every((permission) => !!user.permissions[permission]);
    if (!hasPermissions) throw "permissionsError";
    return user;
}
