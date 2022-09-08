import React, { Component } from "react";
import Storage from 'localStorage'
import Event from "./Event";
import "./css/Content.css"

import { useAuth0 } from "@auth0/auth0-react";

const list = ['a', 'b', 'c'];

class Content extends Component {
  constructor(props) {
    super(props);

    this.state = {
      connected: false,
      items: [],
      DataisLoaded: false,
      categorie: 'select',
      lieu: null,
      filtre_input_cat: false,
    };
    this.handleChange = this.handleChange.bind(this);

  }

  getEvents() {
    fetch(
      "https://public.opendatasoft.com/api/records/1.0/search/?dataset=evenements-publics-openagenda&q=&facet=keywords_fr&facet=location_city&facet=location_department&facet=location_region&facet=location_countrycode&facet=title&facet=date_end&refine.location_region=La+R%C3%A9union")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          items: json.records,
          DataisLoaded: true
        });
        console.log(json.records);
      })
  }

  componentDidMount() {
    this.getEvents();
      }

  handleChange(event) {
    this.setState({ filtre_input_cat: event.target.value })
  }

  render() {
    return (
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h2 className="my-5 text-center">Filtres</h2>
          <select value={this.state.filtre_input_cat} onChange={this.handleChange}>
            <option value={"default"} hidden> Ville</option>
          </select>
        </div>
        <div className="eventcontainer">
          <h2 className="my-5 text-center">Events à venir</h2>
          <div className="" >
            {this.state.DataisLoaded &&
              this.state.items.map(item => 
                <li key={item.fields.recordid} style={{listStyle: "none"}}>
                  <Event ev={item}/>
                </li>)}
            {!this.state.DataisLoaded &&
              <div>
                Fetching
              </div>

            }
          </div>
        </div>
      </div >
    );
  }
}

export default Content;
