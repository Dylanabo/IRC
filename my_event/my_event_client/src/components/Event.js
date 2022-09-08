import React, { Component } from 'react';
import "./css/Content.css"

class Event extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
      return(
        <div className='event' style={{ display: "flex", flexDirection: "row" }}>
            {this.props.ev.fields.thumbnail && <img src={this.props.ev.fields.thumbnail} className="icon" />}
            {!this.props.ev.fields.thumbnail && <img src={"./../assets/no_logo.png"} className="no-icon" />}
            <div style={{ display: "flex", flexDirection: "column"}}>
                <strong className="title">{this.props.ev.fields.title_fr}</strong>
                <p className="description">{this.props.ev.fields.description_fr}</p>
                <p className="end-date">Date de fin: {this.props.ev.fields.lastdate_begin}</p>
            </div>
            {/* <button> En savoir +</button> */}
        </div>
    )
}

}

export default Event;