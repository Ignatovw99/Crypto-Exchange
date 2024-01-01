const http = require('node:http');

const { connectDatabase } = require('./config/database');
const { port } = require('./config/config');

const app = require("./app");

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
