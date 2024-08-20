import React, { useEffect, useState} from 'react';

export default function HelloWorld(){
    const [message, setMessage] = useState(null);

    useEffect(() => {
        async function greetData(){
            const response = await fetch('http://localhost:8000/api/hello-world/');
            console.log("Request sent");
            if(!response.ok){
                throw new Error("Could not fetch Welcome");
            }
            const data = await response.json();
            setMessage(data);
            console.log(data);
        }
        greetData();
    },[]);

    if (!message){
        return <div>Loading...</div>;
    }
    return(
        <div>
            <h1> Hi from React  </h1>
            <p>{message.message}</p>
        </div>
    )
}