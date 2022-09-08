import React, { Fragment } from "react";
import Hero from "../components/Hero";
import Content from "../components/Content";
import { useAuth0 } from "@auth0/auth0-react";


const Home = () => {
  const {isAuthenticated, user} = useAuth0();
  
  if (isAuthenticated) {
    const requestOption = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name: user.name, email: user.email})
    }
    console.log("isauth", requestOption.body);
    fetch('http://localhost:3001/connected', requestOption)
      .then(rep => console.log(rep));
  }

  return (
    <Fragment>
    <Content />
  </Fragment>
  )
};

export default Home;
