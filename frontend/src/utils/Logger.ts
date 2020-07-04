const log = require('loglevel');
const prefix = require('loglevel-plugin-prefix');
const chalk = require('chalk');

const colors = {
    TRACE: chalk.hex("#0022ff"),
    DEBUG: chalk.hex("#19ff00"),
    INFO: chalk.hex("#ffffff"),
    WARN: chalk.hex("#ff8100"),
    ERROR: chalk.hex("#ff0000"),
};

prefix.reg(log);

prefix.apply(log, {
    format(level: string, name: string, timestamp: any) : string {
        // @ts-ignore
        return `${chalk.gray(`[${timestamp}]`)} ${colors[level.toUpperCase()](level)} ${chalk.green(`${name}:`)}`;
    },
});

prefix.apply(log.getLogger('critical'), {
    format(level: any, name: any, timestamp: any) {
        return chalk.red.bold(`[${timestamp}] ${level} ${name}:`);
    },
});

log.setLevel(process.env.LOG_LEVEL || "debug");
log.info("Current logging level", log.getLevel());
export default log;
