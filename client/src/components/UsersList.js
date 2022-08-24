import React from 'react'
import './Home.css'

import { Message } from './Message';

class UsersList extends React.Component {
    state = { 
        input_value: '',
        id: '',
        listParticipants: null,
    }

    // TO DONE : MP une personne
    // send = () => {
    //     if (this.state.input_value && this.state.input_value !== '') {
    //         this.props.onSendMessage(this.props.channel.id, this.state.input_value);
    //         this.setState({ input_value: ''});
    //     }
    // }

    componentDidMount() {
        this.handleUserLists();
    }

    handleUserLists = () => {
       
    }

    render() {

       let users = <div className="no-content-message white">No users</div>;
        console.log(this.props.channel);
        if (this.props.users) {
            users = this.props.users.map(m => <div key={m.id} > <span>{m.login}</span>  <hr/></div>);
        }
        return (
            <div className='users-panel'>
                <div className='users-list'>
                    list :
                    <hr />
                    {users}
                </div>
            </div>);
    }
}

export default UsersList;