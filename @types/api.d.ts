declare namespace Components {
    namespace Schemas {
        export interface Body {
            login?: string;
            password?: string;
        }
        export interface Body1 {
            login?: string;
            password?: string;
        }
        export interface InlineResponse200 {
            token?: string;
        }
        export interface User {
            /**
             * example:
             * d290f1ee-6c54-4b01-90e6-d701748f0851
             */
            id: string; // uuid
            /**
             * example:
             * Johnny Depps
             */
            name: string;
        }
    }
}
declare namespace Paths {
    namespace GetUserById {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export type $200 = Components.Schemas.User;
            export interface $404 {
            }
        }
    }
    namespace Login {
        export type RequestBody = Components.Schemas.Body1;
        namespace Responses {
            export type $200 = Components.Schemas.InlineResponse200;
            export interface $400 {
            }
        }
    }
    namespace Register {
        export type RequestBody = Components.Schemas.Body;
        namespace Responses {
            export type $200 = Components.Schemas.InlineResponse200;
        }
    }
}