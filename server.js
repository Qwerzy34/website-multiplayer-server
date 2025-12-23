const http = require('http').createServer();
const io = require('socket.io')(http, {
    //cors: {origin: "*"}
    cors: {origin: "https://qwerzy34.neocities.org/"}
});

let users = {};

io.on('connection', (socket) => {
    users[socket.id] = {x: 0 , y:(174/200)/2, z:0, ry:0}
    console.log(`A user connected!, Users now online: ${Object.keys(users).length}.`);
    io.emit('addPlayer', {
        id: socket.id,
        scene: "/3D/multiplayer-test/scene.js",
        x: users[socket.id].x, 
        y: users[socket.id].y, 
        z: users[socket.id].z,
        ry: users[socket.id].ry    
    });
    console.log(users);

    socket.on('message', (message) => {
        console.log(message,users[socket.id].scene);
        io.emit('message', {scene: users[socket.id].scene, message: message});
    });

    socket.on('sendPosition', (data) => {

        users[socket.id] = {scene: data.scene, x: data.x, y: data.y, z: data.z, ry: data.ry}; 
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

const PORT = process.env.PORT || 3000;

http.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});