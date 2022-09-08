import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import Storage from 'localStorage'
import Highlight from "../components/Highlight";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import "./css/Profile.css";

const axios = require('axios');


export const ProfileComponent = () => {
  const { isAuthenticated, user } = useAuth0();
  const [user_t, setUsers] = useState({"name" : "fetch", "email" : "fetch", "desc" : "fetch", "pseudo" : "fetch"})
  const [pseudo, setPseudo] = useState("Null")
  const [desc, setDesc] = useState("Null")

  const GetUserInfo = async (user) => {
    const rep = await axios.get('http://localhost:3001/getUserInfo' + user.email)
    console.log("rep: ", rep.data)
    setUsers(rep.data);
    setPseudo(rep.data.pseudo);
    setDesc(rep.data.desc);
  }



  useEffect(() => {
    GetUserInfo(user)
    console.log("user", user_t);
  }, [])

  const [isEdit, setEdit] = useState(false);
  const handleChange = () => {
    console.log("savce", pseudo, desc)
    setEdit(!isEdit);
  }

  const saveChange = () => {
    setEdit(!isEdit);
    const res = axios.put('http://localhost:3001/putUserInfo', {email: user.email, desc: desc, pseudo: pseudo});
  }

  return (
    <div className="row gutters-sm">
      <div className="col-md-4 mb-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex flex-column align-items-center text-center">
              <img src={user.picture} alt="Admin" className="rounded-circle" width="150" />
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-8">
        <div className="card mb-3">
        {!isEdit && 
          <div className="card-body">
            <div className="row">
              <div className="col-sm-3">
                <h6 className="mb-0">Full Name</h6>
              </div>
              <div className="col-sm-9 text-secondary">
                {user.nickname}
              </div>
            </div>
            <hr>
            </hr>
            <div className="row">
              <div className="col-sm-3">
                <h6 className="mb-0">Email</h6>
              </div>
              <div className="col-sm-9 text-secondary">
                {user.email}
              </div>
            </div>
            <hr>
            </hr>

            <div className="row">
              <div className="col-sm-3">
                <h6 className="mb-0">Pseudo</h6>
              </div>
              <div className="col-sm-9 text-secondary">
                {pseudo}
              </div>
            </div>
            <hr>
            </hr>

            <div className="row">
              <div className="col-sm-3">
                <h6 className="mb-0">Description</h6>
              </div>
              <div className="col-sm-9 text-secondary">
                {desc}
              </div>
            </div>
            <hr>
            </hr>

            <div className="row">
              <div className="col-sm-12">
                <button className="btn btn-info" onClick={handleChange}>Edit</button>
              </div>
            </div>
          </div>
        }
         {/* Edit Platorm  */}
        {isEdit && 
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Pseudo</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <input type="text" className="form-control" value={pseudo} onChange={(e) =>setPseudo(e.target.value)}/>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Description</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <input type="text" className="form-control" value={desc} onChange={(e) =>setDesc(e.target.value)}/>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3"></div>
                <div className="col-sm-9 text-secondary">
                  <button className="btn btn-primary px-4" onClick={saveChange} value="Save Changes"> Save</button>
                </div>
              </div>
            </div>
        }
        </div>
      </div>

    </div>
  );
};

export default withAuthenticationRequired(ProfileComponent, {
  onRedirecting: () => <Loading />,
});
