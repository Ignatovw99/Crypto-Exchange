const http = require('node:http');

const app = require("./src/app");
const { connectDatabase } = require('./src/config/database');

const { port } = require('./src/config/properties').server;

const server = http.createServer(app);

async function startServer() {
    try {
        await connectDatabase();
        server.listen(port, () => console.log(`Server is running on port ${port}`));
    } catch (error) {
        console.log('The application cannot be started', error);
    }
}

startServer();
