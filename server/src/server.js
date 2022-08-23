const express = require('express')
const app = express()
const cors = require('cors');

const http = require('http');
const server = http.createServer(app);
const  Server = require("socket.io");
const io = Server(server,{ 
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

// app.get('/', (req, res) => {
//     res.send('SERVEUR my_irc => SERVER ON')
// })

// app.post('/login', (request, response) => {
//     response.setHeader('Content-Type', 'text/plain');
//     let username = request.body.username;
//     let password = request.body.password;
//     sequelize.query("SELECT * FROM user WHERE name = '" + username + "' AND password = '" + password + "'").then(([results, metadata]) => {
//         console.log(results);
//         console.log(results.length);
//         if (results.length > 0) {
//             // Authenticate the user
//             //            request.session.username = username;
//             // Redirect to home page
//             return response.send('Connected');
//         } else {
//             response.send('Incorrect Username and/or Password!');
//         }
//     })
// })

server.listen(8079, () => {
    console.log("Server up and running to port 8079")
})


/* IO */
var STATIC_CHANNELS = [{
    name: 'Global chat 1',
    participants: 0,
    id: 1,
    sockets: []
}, {
    name: 'Global chat 2',
    participants: 0,
    id: 2,
    sockets: []
}];

io.on('connection', (socket) => {
    console.log('a user connected');
    //socket.join('lobby');
    socket.on('channel-join', id => {
        console.log('channel join', id);
        STATIC_CHANNELS.forEach(c => {
            if (c.id === id) {
                if (c.sockets.indexOf(socket.id) == (-1)) {
                    c.sockets.push(socket.id);
                    c.participants++;
                    io.emit('channel', c);
                }
            } else {
                let index = c.sockets.indexOf(socket.id);
                if (index != (-1)) {
                    c.sockets.splice(index, 1);
                    c.participants--;
                    io.emit('channel', c);
                }
            }
        });

        return id;
    });

    socket.on('send-message', message => {
        console.log("message received ", message);
        io.emit('message', message);
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

setInterval(()=>{
    io.to('lobby').emit('time', new Date())
},1000)


app.get('/getChannels', (req, res) => {
    res.json({
        channels: STATIC_CHANNELS
    })
});