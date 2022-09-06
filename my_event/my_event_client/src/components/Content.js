import React, { Component } from "react";

const list = ['a', 'b', 'c'];

class Content extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      DataisLoaded: false
    };
  }

  componentDidMount() { 
    fetch(
      "https://public.opendatasoft.com/api/records/1.0/search/?dataset=evenements-publics-cibul&q=&facet=tags&facet=placename&facet=department&facet=region&facet=city&facet=date_start&facet=date_end&facet=pricing_info&facet=updated_at&facet=city_district")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          items: json.records,
          DataisLoaded: true
        });
        console.log(json.records);
      })
  }

  render() {
    return (
      <div>
        <h2 className="my-5 text-center">Filtres</h2>
        <hr></hr>
      <div className="next-steps my-5">
        <h2 className="my-5 text-center">Events à venir</h2>
        <ul>
          {this.state.DataisLoaded &&
            this.state.items.map(item =>
              <li key={item.recordid}>
                <p className="title">{item.fields.title}</p>
                {item.fields.image_thumb && <img src={item.fields.image_thumb} className="icon"/>}
                {!item.fields.image_thumb && <img src={"./../assets/no_logo.png"} className="no-icon"/>}
                <p className="description">{item.fields.description}</p>
                <p className="end-date">Date de fin: {item.fields.date_end}</p>
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
    </div>
    );
  }
}

export default Content;
