import '../style/Style.css';
import React, { useEffect, useState } from 'react';
import NavBar from '.././components/NavBar';
import Footer from '.././components/Footer';
import DocumentCard from '.././components/DocumentCard';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {useAuthHeader} from 'react-auth-kit';
import axios from 'axios';
import jwt_decode from "jwt-decode";
var Link = require('react-router-dom').Link

function Home() {
  const [docs, setDocs] = useState([]);
  const authHeader = useAuthHeader()
  // const [ownerId, setownerId] = useState([]);

  // const token_buff = authHeader.token;
  // console.log(token_buff);
  // console.log(authHeader)

  // const decodedToken = jwt_decode(token_buff);
  // console.log(decodedToken)
  // const ownerId = dec

  useEffect(() => {
    fetch('/api/docs')
      .then(response => response.json())
      .then(data => setDocs(data))
      .catch(error => console.error('Error fetching docs:', error));
  }, []);

  // useEffect(() => {

  //   var token = authHeader();
  //   console.log(token);
  //   // var decoded = jwt_decode(token);
  // }, []);


  const handleDelete = (documentId ) => {
    console.log(documentId);
    axios.delete(`/api/deletedocuments/${documentId}`)
      .then(response => {
        console.log('Document deleted successfully');
        // Perform any necessary actions after successful deletion
      })
      .catch(error => {
        console.error('Error deleting document:', error);
        // Handle error scenarios
      });

      window.location.reload(true);
  };
  
 

  return (
    <div className="bg-main">
      <NavBar />
      {/* <Container className="upload-box">
        <div className="upload-button">
          <input type="file" />
        </div>
      </Container> */}
      {/* <div>
            Hello {authHeader()}
        </div> */}
      <Container className="cards-container">
        <Row>
        {docs.map(doc => (
          <Col sm={6} md={3} lg={2}>
            
            
  
            <Card className="doc-card">
              <Card.Body>
                <Card.Title key={doc.title}>{doc.title}</Card.Title>
                <Link to={`/documents/${doc._id}`} className="btn btn-primary">Open</Link>
                <Button variant="dark card-button" onClick={()=>handleDelete(doc._id)}>Delete</Button>
              </Card.Body>
            </Card>
          </Col>
          ))}
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default Home;
