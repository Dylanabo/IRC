import React from 'react'
import './Home.css'
import '../assets/css/userList.css'

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
            users = this.props.users.map(m =>
                <div className="list-wrapper" ng-app="app" ng-controller="MainCtrl as ctrl">
                    <ul className="list">
                        <li key={m.id} ng-repeat="user in ctrl.users" className="list-item">
                            <div>
                                <img src={require('../assets/img/profil.png')} className="list-item-image" />
                            </div>
                            <div className="list-item-content">
                                <h4>{m.login}</h4>
                                <p>{m.login}</p>
                            </div>
                        </li>
                    </ul>
                </div>
            );
        }
        return (
            <div className='users-panel'>
                <div className='users-list'>
                    <div class="designwrap">
                        <h1 class="design">Utilisateur connecté :</h1>
                    </div>
                    <hr />
                    {users}
                </div>
            </div>);
    }
}

export default UsersList;