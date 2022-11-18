import io from "socket.io-client";
import { useState, useEffect, FunctionComponentElement, use } from "react";
import React from "react";
import Head from 'next/head';



let socket;

type Message = {
  author: string;
  message: string;
};

type CustomForm = {
  title: string;
  input: number;
}

export default function Home() {

  const [username, setUsername] = useState("");
  const [chosenUsername, setChosenUsername] = useState("");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<Message>>([]);

  const [startSpill, startSpillet] = useState<Boolean>();

  const [form1, setForm1] = useState<number>();

  const [form2, setForm2] = useState<number>();

  const [form3, setForm3] = useState<number>();

  const [customFormTitle, setCustomFormTitle] = useState<CustomForm>();
  const [customFormInput, setCustomFormInput] = useState<string>();

  const [sentform = false, setSentForm] = useState<boolean>();


  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    
    await fetch("/api/socket");

    socket = io();

    socket.on("newIncomingMessage", (msg) => { 
      setMessages((currentMsg) => [
        ...currentMsg,
        { author: msg.author, message: msg.message },
      ]);

    });

     
    
    let startSpill = false;

    socket.on("game_started", (startSpill) => {
      startSpillet(startSpill = true)
      
      
    })

  };


  const sendMessage = async () => { 
    socket.emit("createdMessage", { author: chosenUsername}); 
    //   ...currentMsg,
    //   { author: chosenUsername, message },
    // ]);
    setMessage("");
  };

  const handleKeypress = (e) => {
    
    if (e.keyCode === 13) {
      if (message) {
        sendMessage();
      }
      
    }
  };


const joinedlobby = (username) => {
  socket.emit("user_joined", username);
}


const sendForm1 = (form1) => {
  socket.emit("form1_index", form1);
}

const sendForm2 = (form2) => {
  socket.emit("form2_index", form2);
}

const sendForm3 = (form3) => {
  socket.emit("form3_index", form3);

}

 return (

    <>
    <Head>
      <title>Kaboot!</title>
      <link rel="shortcut icon" href="kaboot.png"></link>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <div className="flex items-center p-4 mx-auto min-h-screen justify-center bg-purple-500">
      <main className="gap-4 flex flex-col items-center justify-center w-full h-full bg-purple-500">
        
        {!chosenUsername ? (
          <>
          <div className="w-md">
            <h1 className="text-xl lg:text-8xl text-left float-left">Velkommen til <span className="text-rose-500">Kaboot!</span></h1>
            </div>
            <h3 className="font-bold text-white text-xl">
              Hva er ditt navn?
            </h3>
            <input
              type="text"
              placeholder="Navnet ditt..."
              value={username}
              className="p-3 rounded-md outline-none"
              onChange={(e) => setUsername(e.target.value)} 
            />
            <button
              onClick={() => {
                setChosenUsername(username), joinedlobby(username);
              }}
              className="bg-white text-black rounded-md px-4 py-2 text-xl"
            >
              kjør!
            </button>
          </>
        ) : (
          <>
          
          </>
        )}

        {!startSpill ? (
        <>
          <p className="font-bold text-white text-6xl">
          Ditt navn: {username}
          </p>

          <div className="py-12">
            <h1 className="text-4xl">Venter på de andre spillerne...</h1>
            
          </div>
        </>
        ) : (
          <>
          {!sentform ? (
            <>
            <div className="mb-6 justify-center">
            <div>
          <label htmlFor="base-input" className="block mb-2 text-sm font-medium text-white text-8xl">Spørsmål: Hvor mye bruker du på klær pr mnd i KR</label> 
          </div>
        
          <div>
            <input type="number" 
            id="base-input"
            min={0} max={20000} 
            placeholder="KR" 
            onChange={(e) => setForm1(e.target.valueAsNumber)}
            value={form1}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            </div>
            <div className="pt-6">

          <label htmlFor="base-input" className="block mb-2 text-sm font-medium text-white text-8xl">Spørsmål: Hvor mye bruker du på lunsj pr mnd i KR</label> 
          </div>
          <div>

            <input type="number" 

            id="base-input" 
            min={0} max={20000} 
            placeholder="KR" 
            value={form2}
            onChange={(e) => setForm2(e.target.valueAsNumber)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />

            </div>
            <div className="pt-6">

            </div>

            <div>
          <label htmlFor="base-input" className="block mb-2 text-sm font-medium text-white text-8xl">Spørsmål: Hvor mye bruker du på drikke pr mnd i KR</label> 
          </div>
          <div>
            <input type="number" 
            id="base-input" 
            min={0} max={20000} 
            placeholder="KR" 
            value={form3} 
            onChange={(e) => setForm3(e.target.valueAsNumber)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            </div>
            


            <div className="pt-6 justify-center align-center">
            <button className="bg-white text-black rounded-md text-2xl py-4 px-4" onClick={() => {
              sendForm1([form1, form2, form3]), setSentForm(true);
            }}>
              Send inn svar
            </button>
            </div>


          </div>

            </>
          ) : (
            <>
            <h1 className="text-8xl text-white">Svaret ditt er sendt inn.</h1>
            <h1 className="text-4xl text-white">Følg med på skjermen til admin</h1>
            </>
          )}

          </>
        )}

      </main>
    </div>
    </>
  );

}
