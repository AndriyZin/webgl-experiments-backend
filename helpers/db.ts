import { DataTypes, Sequelize } from 'sequelize';

export class DB {
    client: Sequelize;
    isSynced: boolean = false;
    syncPromise$: Promise<Sequelize>;


    constructor(config) {
        const { host, port, database, user, password } = config;
        this.client = new Sequelize(database, user, password, {
            host,
            port,
            dialect: 'postgres',
            logging: false
        });
    }

    getInstance(): Promise<Sequelize> {
        if (this.isSynced) return Promise.resolve(this.client);
        if (this.syncPromise$) return this.syncPromise$;
        this.syncPromise$ = init(this.client).then(db => {
            this.isSynced = true;
            return db;
        });
        return this.syncPromise$;
    };
}


export function init(sequelize: Sequelize) {
    sequelize.define(
        'User',
        {
            login: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            permissions: {
                type: DataTypes.JSON,
                defaultValue: {}
            },
            password: {
                type: DataTypes.STRING
            },
            name: {
                type: DataTypes.STRING,
            },
        },
        {
            tableName: 'users'
        },
    );
    return sequelize.sync({ alter: true });
}
