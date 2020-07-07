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
        });
    }

    getInstance(): Promise<Sequelize> {
        if (this.isSynced) return Promise.resolve(this.client);
        if (this.syncPromise$) return this.syncPromise$;
        return init(this.client).then(db => {
            this.isSynced = true;
            return db;
        });
    };
}


export function init(sequelize: Sequelize) {
    sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.INTEGER,
                unique: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
            },
        },
        {
            tableName: 'users'
        },
    );
    return sequelize.sync();
}
