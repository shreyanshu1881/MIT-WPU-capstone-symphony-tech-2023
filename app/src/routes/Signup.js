import React, { useState } from 'react';
import '../style/Style.css';
import Footer from '.././components/Footer';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';

function Signup() {

  const history = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const submitForm = (e) => {
    e.preventDefault();
    try {
      axios.post("http://localhost:4000/signup", {name, email, phoneNumber ,password})
      .then( res => {
        if (res.data === "exist") {
          alert("User already exists.");
        }
        else if (res.status === 201) {
          alert("Signup succesful. Login to proceed to the Document Editor");
          history("/");
        }
      })
      .catch( e => {
        alert("Error in signing youu up . Please try again.")
        console.log(e);

      })
    }
    catch(e) {
      console.log(e);
    }
  }

  return (
    <Container className="bg-signup">
      <div className="signup-box-row">
        <Col sm={6} md={6} lg={4} className="signup-box">
          <form onSubmit={submitForm}>
            <h2 className="form-heading white-font">Signup Form</h2>
            <FloatingLabel controlId="floatingInput" label="Name"  className="mb-3 black-font">
              <Form.Control type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)}/>
            </FloatingLabel>
            <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3 black-font">
              <Form.Control type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)}/>
            </FloatingLabel>
            <FloatingLabel controlId="floatingInput" label="Phone number"  className="mb-3 black-font">
              <Form.Control type="number" placeholder="Phone number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}/>
            </FloatingLabel>
            <FloatingLabel controlId="floatingPassword" label="Password"  className="mb-3 black-font">
              <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
            </FloatingLabel>
            <button className="form-button">Signup</button>
            <div className="white-font form-footer-text">Already a member? <Link to="/" className="green-font cursor-pointer">Login now</Link></div>
          </form>
        </Col>
      </div>
      <Footer />
    </Container>
  );
}

export default Signup;
