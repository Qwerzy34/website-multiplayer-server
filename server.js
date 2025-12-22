const http = require('http').createServer();
const io = require('socket.io')(http, {
    cors: {origin: "*"}
});

let users = {};

io.on('connection', (socket) => {
    users[socket.id] = {x: 0 , y:(174/200)/2, z:0, ry:0}
    console.log(`A user connected!, Users now online: ${Object.keys(users).length}.`);
    console.log(users);
    io.emit('addPlayer', {
        id: socket.id,
        x: users[socket.id].x, 
        y: users[socket.id].y, 
        z: users[socket.id].z});

    socket.on('message', (message) => {
        console.log(message);
        io.emit('message', message);
    });

    socket.on('sendPosition', (data) => {

        users[socket.id] = {x: data.x, y: data.y, z: data.z, ry: data.ry}; 
    })


    socket.on('disconnect', (reason) => {
        io.emit('removePlayer',socket.id);
        delete users[socket.id]
        console.log(`Someone disconnected for reason: "${reason}", Users now online: ${Object.keys(users).length}.`)
        console.log(users);
    });
});

setInterval(() => {
    io.emit('updatePositions', users);
}, 50);

const port = process.env.PORT || 8080;
http.listen(8080, () => console.log(`Server running on ${port}`))