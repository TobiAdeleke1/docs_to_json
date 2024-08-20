import React, {useState} from 'react';

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
                const result = await fetch('',{
                    method:'POST',
                    body:formData
                })
                const data = await result.json();
                console.log(data);
                setStatus('success');

            }catch(err){
                console.log(err);
                setStatus('fail');

            }
        }
    }

    return (<>
    <div>
        <label>
            Choose a file
        </label>
        <input id="file" type="file" onChange={handleFileChange}/>
    </div>
    <div>
    {file && (
        <button className='submit' onClick={handleUpload}>
            Upload a file
        </button>
    )}
    </div>
    <Result status={status}/>

    </>);
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