import React from 'react'
import './Home.css'

import { Message } from './Message';

class Room extends React.Component {
    state = { 
        input_value: '',
    }
    send = () => {
        if (this.state.input_value && this.state.input_value !== '') {
            // normalement ca devrait marcher mais j'obtiens une erreur
            //"Cannot assign to read only property 'login' of object"
            //changer de nom avec la commande /nick
            if (this.state.input_value[0] == "/") {
                let command = this.state.input_value.split(" ");
                if (command[0] == "/nick") {
                    command.unshift();
                    if (command.length > 1)
                    command.join();
                    console.log(command);
                    this.props.login = command;
                }
            } else {
                this.props.onSendMessage(this.props.channel.id, this.state.input_value);
                this.setState({ input_value: ''});
            }
        }
    }

    handleInput = e => {
        this.setState({ input_value: e.target.value });
    }

    render() {

        let list = <div className="no-content-message white">There is no messages to show</div>;
        if (this.props.channel && this.props.channel.messages) {
            list = this.props.channel.messages.map(m => <Message key={m.id} id={m.id} senderName={m.senderName} text={m.text} login={this.props.login}/>);
        }
        return (
            <div className='messages-panel'>
                <div className="meesages-list">
                    {list}
                </div>
                {this.props.channel &&  
                    <div className="messages-input">
                        <input type="text" id="chat" onChange={this.handleInput} value={this.state.input_value} />
                        <button onClick={this.send} id="send">Send</button>
                    </div>
                }
            </div>);
    }
}

export default Room;