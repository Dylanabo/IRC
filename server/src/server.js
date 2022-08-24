const express = require('express')
const app = express()
const cors = require('cors');

const http = require('http');
const server = http.createServer(app);
const Server = require("socket.io");
const io = Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}


// const user = [];

// const room = [];

// /* App */

app.use(cors(corsOptions));

app.use(express.json());

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

server.listen(8079, () => {
    console.log("Server up and running to port 8079")
})


/* IO */
var STATIC_CHANNELS = [{
    name: 'Global chat 1',
    participants: 0,
    id: 1,
    listParticipants: [],
    sockets: []
}, {
    name: 'Global chat 2',
    participants: 0,
    id: 2,
    listParticipants: [],
    sockets: []
}];

var users = [{}];

io.on('connection', (socket) => {
    console.log(socket.id, 'a user connected');
    
    socket.on('connect_me', username => {
        let room = (0)
        let user = {name: username, id_user: socket.id, channel: room};
        users.push(user);
    })

    //socket.join('lobby');
    //    if (socket.id != )
    socket.on('channel-join', data => {
        let id = data.id
        console.log('channel join', id);
        console.log('user join', data);
// function quand le mec join, on dit a la list d'user qu'il a join un channel


        
        STATIC_CHANNELS.forEach(c => {
            if (c.id === id) {
                if (c.sockets.indexOf(socket.id) == (-1)) {
                    c.sockets.push(socket.id);
                    c.participants++;
                    let user = {login : data.login};
                    c.listParticipants.push(user);
                    console.log(c)
                    io.emit('channel', c);
                    io.emit('users', STATIC_CHANNELS);
                }
            } else {
                let index = c.sockets.indexOf(socket.id);
                if (index != (-1)) {
                    c.sockets.splice(index, 1);
                    c.participants--;
                    console.log("DEBUF", c.listParticipants);
                    c.listParticipants = c.listParticipants.filter(c => c.login != data.login);
                    console.log("DEBUF 2 ", c.listParticipants);

                    io.emit('channel', c);
                    io.emit('users', STATIC_CHANNELS);
                }
            }
        });

        return id;
    });

    socket.on('send-message', message => {
        console.log("message received ", message);
        io.emit('message', message);
    });

    socket.on('get-user-room', channel => {
        console.log("Info Room user received ", channel.channel);
        io.emit('new_channel', new_chan);
    });

    socket.on('create-channel', channel => {
        console.log("Channel received ", channel.channel);
        let new_chan = {
            name: channel.channel,
            participants: 0,
            id: ((STATIC_CHANNELS.length) + 1),
            listParticipants: [],
            sockets: []
        }
        STATIC_CHANNELS.push(new_chan);
        io.emit('new_channel', new_chan);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        STATIC_CHANNELS.forEach(c => {
            let index = c.sockets.indexOf(socket.id);
            if (index != (-1)) {
                c.sockets.splice(index, 1);
                c.participants--;
                io.emit('channel', c);
            }
        });
    });
});

setInterval(() => {
    io.to('lobby').emit('time', new Date())
}, 1000)


app.get('/getChannels', (req, res) => {
    res.json({
        channels: STATIC_CHANNELS
    })
});