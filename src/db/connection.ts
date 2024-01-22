import { createConnection, ConnectionOptions } from 'typeorm';

import { Item } from '../entities/item.entity';

const connectionOptions: ConnectionOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT || 0),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [Item],
    synchronize: true,
    logging: true,
};

createConnection(connectionOptions);
