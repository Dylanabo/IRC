import React from 'react';
import './Home.css'


export class Message extends React.Component {

    render() {
        return (
            <div className='message-item'>
                <div className='message-item-cell'>
                <br />
                <div><b>{this.props.login}</b></div>
                <span id="size">{this.props.text}</span>
                </div>
            </div>
        )
    }
}