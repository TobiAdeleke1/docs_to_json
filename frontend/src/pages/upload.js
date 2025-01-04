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
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [fileID, setFileId] = useState(null);
    
    const MAX_FILE_SIZE = 50*1024*1024; // 50 MB in bytes

    const handleFileChange = (e)=>{
        if(e.target.files){
            const addedFile = e.target.files[0];
            // setFile(e.target.files[0]);
            const isValidFileType = addedFile.name.endsWith('.csv') || addedFile.type === 'text/csv';

            if(!isValidFileType){ //Validate file type
              setFile(null);
              setError("Please upload a valid csv file.");
              return;
            }

            if(addedFile.size > MAX_FILE_SIZE){ // Validate file size
               setFile(null);
               setError('File Size exceeds 50MB Limit. Please upload a smaller file.')
            }

            setFile(addedFile);
            setError(""); //clear previous error 
        }
    };

    const handleUpload = async(e) =>{
        e.preventDefault();
        if(file){
            const formData = new FormData();
            formData.append('file', file);

            try{
                const response = await fetch('http://localhost:8000/api/upload/',{
                    method:'POST',
                    body:formData
                });

                if (!response.ok){
                  throw new Error(`Response status: ${response.status}`);
                }

                const data = await response.json();
                setMessage(`${data.message}`);
                setFileId(data.fileID);
                
            }catch(err){
                console.log(err);
                setMessage('File upload failed');
            }
        }
    };

    const handleDownload = async(e) =>{
      e.preventDefault();
  
      if(fileID){
         try{
            const response = await fetch(`http://localhost:8000/api/download/${fileID}/`);

            if (!response.ok){
              throw new Error(`Response status: ${response.status}`);
            }
        
            const data_blob = await response.blob();

            // A default name 
            let fileName = 'download_file.json'
            // Filename 
            const contentDisposition = response.headers.get('Content-Disposition');
            if (contentDisposition && contentDisposition.includes('filename=')){
               //replace default 
               fileName = contentDisposition.split('filename=')[1].trim().replace(/["']/g, '');
            }
            
            const url = window.URL.createObjectURL(data_blob);
            const a = document.createElement('a');
            a.href = url; 
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove(); 
            // Free Memory 
            window.URL.revokeObjectURL(url);

         }catch(err){
            console.log(err);
            setMessage('Error Loading file From Server');
         }
      };
      console.log('No file uploaded to download');

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
    };

    return (
     <Card className="text-center">
        <Card.Header>CSV2JSON Converter</Card.Header>
       
        <Form.Group controlId="formFile" className="mb-3">
            <Form.Label></Form.Label>
            <Form.Control
             type="file" 
             as="input" 
             onChange={handleFileChange}
             accept='.csv'
             />
      </Form.Group>

      <Card.Body>
        <Card.Title>Upload a CSV file, to continue ... </Card.Title>
        <div>
            {file && (
                <div>
                File details:
                
                <ul>
                   <Card.Text><li>Name: {file.name}</li></Card.Text>
                   <Card.Text><li>Type: {file.type}</li></Card.Text>
                   <Card.Text><li>Size: {file.size} bytes</li></Card.Text>
                </ul>
                </div>
            )}
             
          {error && <p style={{color:'red'}}>{error}</p>} 

        </div>

        {file && (
            
            <Button 
             variant="primary"  
             onClick={handleUpload}
             type="submit"
             >
             Upload a file

             </Button>
            )}
            {message && <p style={{color:'red'}}>{message}</p>} 

      </Card.Body>
    <Card.Footer className="text-muted">
       <Row>
       <Col>
          <Button
            type="button"
            variant="success"
            onClick={handleDownload}
            >
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