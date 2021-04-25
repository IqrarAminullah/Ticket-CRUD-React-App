import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './Login.css';
import axios from 'axios';
import { Row, Col, Button } from 'reactstrap';


export default function Login({ setToken }) {
  const [login, setLogin] = useState(true);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [username, setUsername] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    var userData = {
        'email':email,
        'password':password
    }
    axios.post(process.env.REACT_APP_API_URL+"/api/User/auth",userData)
    .then(json =>{
        console.log(json.data);
        setToken(json.data);
    })
  }

  const handleRegister = (e) =>{
      e.preventDefault();
      var userData = {
          'email':email,
          'username':username,
          'password':password
      }
      var validity = checkValidity(userData);
      if(validity.valid){
        axios.post(process.env.REACT_APP_API_URL+"/api/User",userData)
        .then(response =>{
            axios.post(process.env.REACT_APP_API_URL+"/api/User/auth",userData)
            .then(json =>{
                console.log(json.data);
                setToken(json.data);
            })
        });
      }else{
        alert(validity.errMsg);
      }
  }

  const checkValidity =(d) =>{
    var errCheck = {
        valid : true,
        errMsg : ''
    }

    if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(d.password)){
        errCheck.valid = false;
        errCheck.errMsg = "Password not valid";
    }    

    if(!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(d.email)){
        errCheck.valid =false;
        errCheck.errMsg = "Email string not valid";
    }

    return errCheck;
  }

  if(login)
  {
      return(
        <div className="login-wrapper">
          <h1>Log In or Register</h1>
          <form onSubmit={handleSubmit}>
            <Row>
            <label>
              <p>Email</p>
              <input type="text" onChange={e => setEmail(e.target.value)} />
            </label>
            </Row>
            <Row>
            <label>
              <p>Password</p>
              <input type="password" onChange={e => setPassword(e.target.value)} />
            </label>
            </Row>
            <Row>
              <Col>
              <div>
                <Button color="secondary" onClick={()=>setLogin(false)}>Register</Button>
              </div>
              </Col>
              <Col>
              <div>
                <Button color="primary">Submit</Button>
              </div>
              </Col>
            </Row>
          </form>
        </div>
      );
  }else{
    return(
        <div className="login-wrapper">
          <h1>Log In or Register</h1>
          <form onSubmit={handleRegister}>
            <Row>
            <label>
              <p>Email</p>
              <input type="text" onChange={e => setEmail(e.target.value)} />
            </label>
            </Row>
            <Row>
            <label>
              <p>Username</p>
              <input type="text" onChange={e => setUsername(e.target.value)} />
            </label>
            </Row>
            <Row>
            <label>
              <p>Password</p>
              <input type="password" onChange={e => setPassword(e.target.value)} />
            </label>
            </Row>
            <Row>
              <Col>
              <div>
                <Button color="danger" onClick={()=>setLogin(true)}>Cancel</Button>
              </div>
              </Col>
              <Col>
              <div>
                <Button color="primary">Submit</Button>
              </div>
              </Col>
            </Row>
          </form>
        </div>
      )
  }
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};