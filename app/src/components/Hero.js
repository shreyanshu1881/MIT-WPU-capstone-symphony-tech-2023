import React, { useEffect,useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Img from '.././assets/img5.png';
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import { useSignIn } from "react-auth-kit";

function Hero() {

  const history = useNavigate();
  const signIn = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitForm = (e) => {
    e.preventDefault();
    try {
      axios.post("http://localhost:4000/", {email, password})
      .then( res => {
        if (res.status == 201) {
          signIn({
            token: res.data.token,
            expiresIn: 3600,
            tokenType: "Bearer",
            authState: { email: email },
          });
          history("/home");
        }
        else if (res.data.message == "User not registered") {
          alert("There is no account with this email Id. Please Signup");
        }
        else if (res.data.message == "Password didn't match") {
          alert("Inncorrect Password. Please try again.");
        }
      })
      .catch( e => {
        console.log(e);

      })
     }
    catch(e) {
      console.log(e);
    }

  }

  return (
    <Container>
      <Row className="hero-main-row">
        <Col sm={12} md={12} lg={6} className="hero-col">
          {/*<p class="grey-font">hkjSHD WEGHKJFG WK WKEG FWGFBVMBMS JWRR HG SKJBVMNSDGRY  RHGFSDABA Bbdjsmvhbjhsvbjhsvbdjhb bdafhcbkajdbc</p>*/}
          <h1 className="hero-heading">Speech-To-Text DocEditor</h1>
          <img src={Img} alt="" className="hero-img"/>
        </Col>
        <Col sm={12} md={12} lg={6} className="hero-col">
          <Row>
            <Col sm={0} md={0} lg={4}>
            </Col>
            <Col sm={12} md={12} lg={8}>
              <form className="hero-login-form" onSubmit={submitForm}>
                <h2 className="form-heading white-font">Login Form</h2>
                <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3 black-font">
                  <Form.Control type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)}/>
                </FloatingLabel>
                <FloatingLabel controlId="floatingPassword" label="Password"  className="mb-3 black-font">
                  <Form.Control type="password" placeholder="Password" value={password} onChange={e=> setPassword(e.target.value)}/>
                </FloatingLabel>
                {/*<div className="green-font form-forgot-password cursor-pointer">Forgot password?</div>*/}
                <button className="form-button">Login</button>
                <div className="white-font form-footer-text">Not a member? <Link to="/signup" className="green-font cursor-pointer">Signup now</Link></div>
              </form>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Hero;
