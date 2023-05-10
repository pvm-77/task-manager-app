import http from 'http'
import app from './app.js'
import logger from './utils/logger.js';
import config from './utils/config.js';
const server=http.createServer(app);
server.listen(config.PORT,()=>{
    logger.info(`🚀 Server listening on http://localhost:${config.PORT}`);
})

