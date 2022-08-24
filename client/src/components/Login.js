import Storage from "localStorage"
import React from "react";
import { Navigate } from "react-router-dom"


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: '',
        };
        this.onChange = this.onChange.bind(this);
        this.pressLogin = this.pressLogin.bind(this);
    }

    componentDidMount() {
        if (Storage.getItem('unique_id')) {
            console.log("Storage.getItem('unique_id')")
            window.location.assign("/home");
        }
    }

    onChange(event) {
        this.setState({ login: event.target.value });
    }

    pressLogin = (login) => {
        console.log("dza", this.state.login);
        Storage.setItem('unique_id', this.state.login);
       
        window.location.assign("/home");
    }

    render() {
        return (
            <div>
                <p>LOGIN</p>
                    <label>
                        Pseudo :
                        <input type="text" value={this.state.login} onChange={this.onChange} />
                    </label>
                    <button type="submit" onClick={this.pressLogin}>LOGIN</button>
            </div>
        )
    }


}

export default Login;