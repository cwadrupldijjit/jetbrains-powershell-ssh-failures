import { Knex } from 'knex';

export const development: Knex.Config = {
    client: 'mysql2',
    connection: {
        host: 'jetbrains-remote-poc-mysql-1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'project'
    },
};
