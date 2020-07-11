export class User implements Components.Schemas.User {
    id: string;
    name: string;
    password?: string;
    permissions?:  { [key: string]: boolean; };
}