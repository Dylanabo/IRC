import React, { Component } from "react";
import "./css/Content.css"

const list = ['a', 'b', 'c'];

class Content extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
    
    onChange(event) {
      // this.setState({categorie: event.target.value})
      // console.log(event.target.value)
    }

  componentDidMount() {
    this.getEvents();
  }

  handleChange (event) {
    this.setState({ filtre_input_cat: event.target.value })
  }

  render() {
    return (
      <div style={{display: "flex", flexDirection: "row"}}>
      <div style={{display: "flex", flexDirection: "column"}}>
        <h2 className="my-5 text-center">Filtres</h2>
          <select value={this.state.filtre_input_cat} onChange={this.handleChange}>
            <option value={"default"} hidden> Ville</option>
          </select>
      </div>
      <hr></hr>
      <div className="next-steps my-5">
        <h2 className="my-5 text-center">Events à venir</h2>
        <ul>
            {this.state.DataisLoaded &&
              this.state.items.map(item =>
              <li key={item.recordid}>
                <p className="title">{item.fields.title_fr}</p>
                  {item.fields.thumbnail && <img src={item.fields.thumbnail} className="icon" />}
                  {!item.fields.thumbnail && <img src={"./../assets/no_logo.png"} className="no-icon" />}
                <p className="description">{item.fields.description_fr}</p>
                <p className="end-date">Date de fin: {item.fields.lastdate_begin}</p>
                  {/* <button> En savoir +</button> */}
              </li>)
            }
            {!this.state.DataisLoaded &&
              <div>
                Fetching
              </div>

            }
          </ul>
        </div>
      </div >
    );
  }
}

export default Content;
