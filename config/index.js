import dotenv from 'dotenv';

dotenv.config()

export default {
    port: process.env.PORT,
    mongoUri: process.env.MONGO,
    local_client_app: process.env.LOCAL_CLIENT_APP,
    remote_client_app: process.env.REMOTE_CLIENT_APP,
    allowedDomains: [process.env.REMOTE_CLIENT_APP, process.env.REMOTE_SERVER_APP],
    local_server_app: process.env.LOCAL_SERVER_APP,
    remote_server_app: process.env.REMOTE_SERVER_APP,
  };