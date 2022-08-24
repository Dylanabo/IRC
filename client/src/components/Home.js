import Storage from "localStorage"
import React, { Component } from "react";
import { io } from 'socket.io-client'
import Room from "./Room"
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

    handleClick = id => {
        this.props.onSelectChannel(id);
    }

    render() {
        let list = <div className="no-content-message white ">Pas de channel</div>;
        if (this.props.channels && this.props.channels.map) {
            list = this.props.channels.map(c => <Channel key={c.id} id={c.id} name={c.name} participants={c.participants} onClick={this.handleClick} />);
        }
        return (
            <div className='channel-list'>
                {list}
            </div>);
    }

}

class Home extends React.Component  {
    // const [time, setTime] = React.useState('fetching')
    // const [socket, setSocket] = React.useState('fetching')
    // const [channel, setRoom] = React.useState('fetching')
    // const [list_channels, setChannels] = React.useState([])
    // const login = Storage.getItem("unique_id");
    // const [msg, setMsg] = React.useState("Message");

    state = {
        channels: null,
        socket: null,
        channel: null,
        login: null,
    }
    socket;
    componentDidMount() {
        this.setState({login: Storage.getItem("unique_id")});
        this.loadChannels();
        this.loadSocket();
    }

    loadChannels = async () => {
        fetch('http://localhost:8079/getChannels').then(async response => {
            let data = await response.json();
            this.setState({ channels: data.channels });
        })
    }
    
    loadSocket = () => {
        const socket = io('http://localhost:8079')
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
        this.socket = socket;
    }

    handleSendMessage = (channel_id, text) => {
        this.socket.emit('send-message', { channel_id, text, senderName: this.socket.id, id: Date.now() });
    }

    handleChannelSelect = id => {
        let channel = this.state.channels.find(c => {
            return c.id === id;
        });
        this.setState({ channel });
        this.socket.emit('channel-join', id, ack => {
        });
        console.log("chanel sele", channel)
    }

    render() {

        return (
            <div className="Home">
            <h1>Bienvenue {this.state.login}</h1>
            <div className="container" >
                <div className="roomlist">
                    <ChannelList channels={this.state.channels} onSelectChannel={this.handleChannelSelect} />
                </div>

                <div className="content">
                    <div className="bottom">
                    <Room onSendMessage={this.handleSendMessage} channel={this.state.channel} />
                    </div>
                </div>
            </div>
        </div>
    )
    }
}

export default Home;
