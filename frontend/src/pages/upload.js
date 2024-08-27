import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function CsvUploader(){
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('initial');
    
    const handleFileChange = (e)=>{
        if(e.target.files){
            setStatus('initial');
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async() =>{
        if(file){
            setStatus('uploading');

            const formData = new  FormData(); // what is this
            formData.append('file', file);

            try{
                const result = await fetch('http://localhost:8000/api/upload/',{
                    method:'POST',
                    body:formData
                });
                const data = await result.json();
                console.log(data);
                setStatus('success');

            }catch(err){
                console.log(err);
                setStatus('fail');

            }
        }
    }

    return (
     <Card className="text-center">
        <Card.Header>CSV2JSON Converter</Card.Header>
       
        <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Choose a file</Form.Label>
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
        <Result status={status}/>
    </Card.Footer>

  </Card>);
};

const Result = ({ status }) => {
    if (status === "success") {
      return <p>✅ File uploaded successfully!</p>;
    } else if (status === "fail") {
      return <p>❌ File upload failed!</p>;
    } else if (status === "uploading") {
      return <p>⏳ Uploading selected file...</p>;
    } else {
      return null;
    }
  };
  
export default CsvUploader;