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

        socket.on('join-room', ({ room, username }) => {
            socket.join(room);
            console.log(`User ${username} has joined room ${room}`);
            socket.to(room).emit("user_joined", `${username} joined room`)
        });

        socket.on('message', ({ room, message, sender }) => {
            console.log(`Message from ${sender} in room ${room}:${message}`);
            socket.to(room).emit("message", { sender, message })
        })


        // If the user disconnects
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        })
    });


    httpServer.listen(port, () => {
        console.log(`Server running at http://${hostname}:${port}`);
    });
});