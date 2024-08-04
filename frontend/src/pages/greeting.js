import React, { useEffect, useState} from 'react';

export default function HelloWorld(){
    const [message, setMessage] = useState('');
    useEffect(() => {
        async function greetData(){
            const response = await fetch('http://localhost:8000/api/hello-world/');
            console.log(response);
            if(!response.ok){
                console.log(response);
                throw new Error("Could not fetch Postcode");
            }
        
            setMessage(response.json().message); //TODO: Stringify
        }
        greetData();
    },[]);
    return(
        <div>
            <h1> Hi from React  </h1>
            <p>{message}</p>
        </div>
    )
}