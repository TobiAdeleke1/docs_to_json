import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';


function CsvUploader(){
    const [file, setFile] = useState(null);
    const [email, setEmail] = useState(' ');

    const handleFileChange = (e)=>{
        if(e.target.files){
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async() =>{
        if(file){
            const formData = new FormData(); // what is this
            formData.append('file', file);

            try{
                const result = await fetch('http://localhost:8000/api/upload/',{
                    method:'POST',
                    body:formData
                });
                const data = await result.json();
                console.log(data);
     

            }catch(err){
                console.log(err);

            }
        }
    }
    
    const handleEmailInput = (e)=>{
      setEmail(e.target.value);
      console.log(email);
  }
 
  const handleEmailSubmit = (e) => {
    // e.preventDefault();
    if (email) {
        console.log('Submitted email:', email);
        // TODO: sending the email to a backend server
    }
    console.log('Submitted email:', '');
};
    
    const ToggleEmail = ({children , eventKey})=>{
      const decortedOnClick = useAccordionButton(eventKey, 
        ()=> console.log("user want the file emailed "));

        return (
          <Button
          type="button"
          variant="success"
          onClick={decortedOnClick}
          >
          {children}

          </Button>
        );
    }

    return (
     <Card className="text-center">
        <Card.Header>CSV2JSON Converter</Card.Header>
       
        <Form.Group controlId="formFile" className="mb-3">
            <Form.Label></Form.Label>
            <Form.Control type="file" as="input" onChange={handleFileChange}/>
      </Form.Group>

      <Card.Body>
        <Card.Title>Upload a CSV file, to continue ... </Card.Title>
        <Card.Text>
            {file && (
                <section>
                File details:
                <ul>
                    <li>Name: {file.name}</li>
                    <li>Type: {file.type}</li>
                    <li>Size: {file.size} bytes</li>
                </ul>
                </section>
            )}
            

        </Card.Text>
        {file && (
            
            <Button 
             variant="primary"  
             onClick={handleUpload}
             type="submit"
             >
             Upload a file

             </Button>
            )}

      </Card.Body>
    <Card.Footer className="text-muted">
       <Row>
       <Col>
          <Button
            type="button"
            variant="success">
            Download
            </Button>
        </Col>
        <Col>
          <Accordion defaultActiveKey="0">
            <ToggleEmail eventKey="1">Email me </ToggleEmail>
            <Accordion.Collapse eventKey='1'>
            <InputGroup className="mb-3 mt-3">
            <Form.Label></Form.Label>
            <Form.Control
              type="email" 
              placeholder="name@example.com"
              aria-label="name@example.com"
              aria-describedby="basic-addon2"
              onChange={handleEmailInput} 
            />
            <Button 
            variant="outline-secondary" 
            id="button-addon2"
            onClick={handleEmailSubmit}>
            Send
            </Button>
          </InputGroup>    
            </Accordion.Collapse>
          </Accordion>
        </Col> 
       </Row> 
    </Card.Footer>
  </Card>);
};


  
export default CsvUploader;