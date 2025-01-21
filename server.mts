import { createServer } from 'node:http';
import next from 'next';
import { Server } from 'socket.io';


const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port })
const handel = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handel);
    const io = new Server(httpServer);
    io.on('connection', (socket) => {
        console.log(`A user connected : ${socket.id}`)
    });

    httpServer.listen(port, () => {
        console.log(`Server running at http://${hostname}:${port}`);
    });
});