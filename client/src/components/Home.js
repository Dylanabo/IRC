import Storage from "localStorage"
import React, { Component } from "react";
import { io } from 'socket.io-client'
import Room from "./Room"
import UsersList from "./UsersList"
import './Home.css'

class Channel extends React.Component {

    click = () => {
        this.props.onClick(this.props.id);
    }

    render() {
        return (
            <div className='channel-item' onClick={this.click}>
                <div>{this.props.name} <span className="right">{this.props.participants}</span></div>
                
            </div>
        )
    }
}

class ChannelList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            NewRoom: '',
        };
        this.onChange = this.onChange.bind(this);
    }
    
    handleClick = id => {
        this.props.onSelectChannel(id);
    }

    onChange(event) {
        this.setState({ NewRoom: event.target.value });
        console.log(event.target.value);
    }

    /*
    @function Create a channel if the new channel's name is available.
    *  ? si et : sinon
    *  increments if exists
    */
    createChannel = (nameChannel) => {
        let ret = 0;
        this.props.channels.map(c => (c.name == nameChannel) ? ret += 1 : 0);
        console.log(">ret", nameChannel)

        if (ret == 0) {
            this.props.onCreateChannel(nameChannel);
            console.log(">TEST")
        }
    }

    onClick = async () => {
        this.createChannel(this.state.NewRoom)
    }

    render() {
        let list = <div className="no-content-message white ">Pas de channel</div>;
        if (this.props.channels && this.props.channels.map) {
            list = this.props.channels.map(c => <Channel key={c.id} id={c.id} name={c.name} participants={c.participants} onClick={this.handleClick} />);
        }
        return (
            <div className="leftside">
                <div className="channel-list">
                    {list}
                </div>
                <div className="roomaker">
                    <input type="text" value={this.state.NewRoom} onChange={this.onChange} />
                    <button type="submit" id="createButton" onClick={this.onClick}>Create Room</button>
                </div>
            </div>
            );
    }

}

class Home extends React.Component  {

    state = {
        channels: null,
        users: null,
        socket: null,
        channel: null,
        login: null,
        connect: false,
    }
    socket;
    componentDidMount() {
        this.setState({login: Storage.getItem("unique_id")});
        this.loadChannels();
        if (!this.state.connect) {
            this.loadSocket();
            this.setState({connect: true})
        }
    }

    loadChannels = async () => {
        fetch('http://localhost:8079/getChannels').then(async response => {
            let data = await response.json();
            this.setState({ channels: data.channels });
        })
    }
    
    loadSocket = () => {
        const socket = io.connect('http://localhost:8079', {reconnection:false})

        console.log("connect");
        socket.on('connect', () => {
            if (this.state.channel) {
                this.handleChannelSelect(this.state.channel.id);
            }
        });
        socket.on('connect_error', () => {
            setTimeout(() => socket.connect(), 5000)
        })
        socket.on('channel', channel => {
            let channels = this.state.channels;
            channels.forEach(c => {
                if (c.id === channel.id) {
                    c.participants = channel.participants;
                }
            });

            this.setState({ channels });
            let tmpChannel = this.state.channels.find(c => {
                return c.id === this.state.channel.id;
            });
            this.setState({ channel: tmpChannel });
        });
        socket.on('users', user => {
            console.log("users", user, this.state.channel.id)
            user.forEach(c => {
                if (this.state.channel.id) {
                    if (c.id === this.state.channel.id) {
                        this.setState({users: c.listParticipants});
                    }
                }
            });
        });
        socket.on('new_channel', channel => {
            let n_users = this.state.users;
            n_users.pushback(channel)
            this.setState({ users: n_users });
        });
        socket.on('message', message => {
            let channels = this.state.channels
            channels.forEach(c => {
                if (c.id === message.channel_id) {
                    if (!c.messages) {
                        c.messages = [message];
                    } else {
                        c.messages.push(message);
                    }
                }
            });
            this.setState({ channels });

        });
        socket.emit("connect_me", {user: this.state.login})

        this.socket = socket;
    }

    handleCreateChannel = (NewRoom) => {
        console.log("Channel", NewRoom)
        this.socket.emit("create-channel", {channel: NewRoom})
    }


    handleSendMessage = (channel_id, text) => {
        this.socket.emit('send-message', { channel_id, text, senderName: this.state.login, id: Date.now() });
    }

    handleChannelSelect = id => {
        let channel = this.state.channels.find(c => {
            return c.id === id;
        });
        this.setState({ channel });
        var data = {login: this.state.login, id: id};
        this.socket.emit('channel-join', data);
        console.log("chanel sele", channel)
    }

    render() {

        return (
            <div className="Home">
            <h1 id="welcome">Bienvenue {this.state.login}</h1>
            <div className="container" >
                <div className="roomlist">
                    <ChannelList channels={this.state.channels} onSelectChannel={this.handleChannelSelect} onCreateChannel={this.handleCreateChannel}/>
                </div>

                <div className="content">
                    <div className="bottom">
                    <Room onSendMessage={this.handleSendMessage} channel={this.state.channel} login={this.state.login} />
                    </div>
                </div>
                <div className="content">
                    <UsersList channel={this.state.channel} users={this.state.users} socket={this.state.socket}/>
                </div>
                
            </div>
        </div>
    )
    }
}

export default Home;
