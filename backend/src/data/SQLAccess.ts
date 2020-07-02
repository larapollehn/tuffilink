const Pool = require('pg').Pool;
import log from "../log/Logger";

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DB || 'tinylink',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    port: 5432
});

log.debug("Using SQL's pool with following information:", pool.options.host, pool.options.database, pool.options.user);

export default pool;