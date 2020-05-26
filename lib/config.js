const convict = require('convict');
const path = require('path');

const config = convict({
    service: {
        host: {
            doc: 'The service host name',
            format: 'String',
            default: 'localhost',
            env: 'HOST',
            arg: 'host'
        },
        port: {
            doc: 'Service port',
            format: 'port',
            default: 80,
            env: 'PORT',
            arg: 'port'
        },
        securePort: {
            doc: 'Service secure port',
            format: 'port',
            default: 443,
            env: 'SECURE_PORT',
            arg: 'secure-port'
        },
        portForwarding: {
            doc: 'Service port forwarding',
            format: 'port',
            default: 15089,
            env: 'FORWARDING_PORT',
            arg: 'forwarding-port'
        },
        logFile: {
            doc: 'The log file',
            format: 'String',
            default: path.join(process.env.PROJECT_ROOT, 'babyphone.log'),
            env: 'LOG_FILE',
            arg: 'log-file'
        },
        storagePath: {
            doc: 'The storage path',
            format: 'String',
            default: "G:/crash_log_resolver",
            env: 'STORAGE_PATH',
            arg: 'storage-path'
        },
        ssl: {
            key: {
                doc: 'The SSL key path',
                format: 'String',
                default: "ssl/privkey.pem",
                env: 'SSL_KEY',
                arg: 'ssl-key'
            },
            cert: {
                doc: 'The SSL cert path',
                format: 'String',
                default: "ssl/fullchain.pem",
                env: 'SSL_CERT',
                arg: 'ssl-cert'
            }
        }
    },
    db: {
        host: {
            doc: 'Hostname',
            format: 'String',
            default: 'localhost',
            env: 'DB_HOST',
            arg: 'db-host'
        },
        port: {
            doc: 'DB Port',
            format: 'port',
            default: 27017,
            env: 'DB_PORT',
            arg: 'db-port'
        },
        name: {
            doc: 'DB name',
            format: 'String',
            default: 'babyphone',
            env: 'DB_NAME',
            arg: 'db-name'
        },
        user: {
            doc: 'DB user',
            format: 'String',
            default: 'root',
            env: 'DB_USER',
            arg: 'db-user'
        },
        password: {
            doc: 'DB password',
            format: 'String',
            default: 'test',
            env: 'DB_PASSWORD',
            arg: 'db-password'
        }
    }
});

config.loadFile(path.join(process.env.PROJECT_ROOT, 'config', 'config.json'));
config.validate({allowed: 'strict'});

module.exports = config;