const http = require('node:http');

const { connectDatabase } = require('./src/providers/database');
const { port } = require('./src/config/server');

const app = require("./src/app");

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
