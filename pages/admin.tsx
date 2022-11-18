import io from "socket.io-client";
import { useState, useEffect, FunctionComponentElement } from "react";
import React from "react";
import Head from 'next/head';
import Chart from 'chart.js/auto';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend);

Chart.register(ChartDataLabels);

let socket;

type Message = {
  author: string;
  message: string;
};

type BrukerPenger = {
  label: string;
  total: number;
  votes: number;
}

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [chosenUsername, setChosenUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [userCards, setUserCards] = useState<Array<string>>([]);
  let [adminStatus = false, spilletErStartet] = useState<Boolean>();
  let [gameEnded = false, spilletErSlutt] = useState<Boolean>();

  const [brukerPenger, setBrukerPenger] = useState<Array<BrukerPenger>>([]);

  let [klær, setKlær] = useState<number>();
  let [lunsj, setLunsj] = useState<number>();
  let [drikke, setDrikke] = useState<number>();

  let [klærPercentage, setKlærpercentage] = useState<number>();
  let [lunsjPercentage, setLunsjPercentage] = useState<number>();
  let [drikkePercentage, setDrikkePercentage] = useState<number>();
  let [total, setTotal] = useState<number>();

  let [answered = 0, setAnswered] = useState<number>();





  useEffect(() => {
    socketInitializer();
  }, []);

  
  let adminUsername = "admin (skal ikke være med)";



  
  const socketInitializer = async () => {
    
    await fetch("/api/socket");

    socket = io();
    
    socket.on("newIncomingMessage", (msg) => { 
        setMessages((currentMsg) => [
          ...currentMsg,
          { author: msg.author, message: msg.message },
        ]);
        
      });
      
      socket.on("put_user_on_screen", username => {
        
          setUserCards((cur) => [
          ...cur,
          username
        ])
        
      })

     

      socket.on("form1_nodeserver", (vals ) => {
        setAnswered(answered += 1)
        
        if (!brukerPenger.length) {
          brukerPenger.push({
            label: 'Klær',
            total: 0,
            votes: 0
          });
          brukerPenger.push({
            label: 'Kantina',
            total: 0,
            votes: 0
          })
          brukerPenger.push({
            label: 'Energidrikk',
            total: 0,
            votes: 0
          })
        }
        vals.forEach((val, i) => {
          brukerPenger[i].total += val;
          brukerPenger[i].votes++;
        });
        

      })

      socket.on("form2_nodeserver", (form2) => {
        
      })

      socket.on("form3_nodeserver", (form3) => {
        
      })

    };      
      



    let startSpill = false; 
    

const startGame = (startSpill) => {
    adminStatus = true; 
     startSpill = true; 
    socket.emit("start_game", startSpill); 
}



    const sendMessage = async () => { 
      socket.emit("createdMessage", { author: chosenUsername}); 
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



const stopGame = () => {
  gameEnded = true;
}


const data = { 
  labels: ['Klær (rød)', 
  'Lunsj (Blå)', 
  'Drikke (Gul)'],  
  datasets: [
    {
      data: brukerPenger.map((b) => b.total),
      percentage: 255,
      backgroundColor: [
        'rgba(238, 75, 43)',
        'rgba(0, 0, 255)',
        'rgba(255,255,0)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
      ],
      label: '# of Votes',
      borderWidth: 1,
    },
  ],
};


const Percentage = () => {
 klær = brukerPenger[0].total;
 lunsj = brukerPenger[1].total;
 drikke = brukerPenger[2].total;

  total = klær + lunsj + drikke;

  klærPercentage = klær / total * 100;
  lunsjPercentage = lunsj / total * 100; 
  drikkePercentage = drikke / total * 100;
};

    return (
      <>
      <Head>
        <title>admin page</title>
        <link rel="shortcut icon" href="kaboot.png"></link>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="flex items-center p-4 mx-auto min-h-screen justify-center bg-purple-500">
        <main className="gap-4 flex flex-col items-center justify-center w-full h-full bg-purple-500">

        {!adminStatus ? (
              <>
                <div className="pt-8">
                <h1 className="text-4xl text-black bg-white rounded-md justify-center py-4 px-4">Spillet er ikke startet! </h1>
                </div>
                </>

            ) : (
              <>
              
              {!gameEnded ? (
                <>
                <h1 className="text-4xl text-rose-500 bg-white rounded-md py-4 px-4">Spillet er STARTET!!!!</h1>
                </>
              ) : (
                <>
                <h1 className="text-4xl bg-white text-black rounded-md py-4 px-4">Spillet er slutt se resultatene nedenfor :) </h1>
                </>

              )}
            </>
            )}
                <div className="h-fit flex flex-col items-center justify-center text-black bg-white px-4 py-4 rounded-md">
                  <h1 className="text-6xl font-bold">Hvor mange som har svart:</h1> 
                  <h1 className="text-4xl font-bold items-center justify-center">{answered} svar</h1>
                </div>
                
        
        {adminUsername ? (
            <>
            
                <div>
                    <button className="text-8xl bg-rose-400 text-black rounded-md w-full top-0 py-4 px-4" onClick={() => {startGame(startSpill), spilletErStartet(true);}}
                    >Start Spillet!</button>
                </div>

                <div>
                    <button className="text-8xl bg-green-500 text-black rounded-md w-full top-0 py-4 px-4" onClick={() => {stopGame(), spilletErSlutt(true), Percentage(), setKlær(brukerPenger[0].total), setLunsj(brukerPenger[1].total), setDrikke(brukerPenger[2].total), setTotal(klær + lunsj + drikke), setKlærpercentage(klær / total * 100), setLunsjPercentage(lunsj / total * 100), setDrikkePercentage(drikke / total * 100);}}
                    >Avslutt spillet.</button>
                </div>
            
            <div>
              <p className="font-bold text-white text-6xl">
                Ditt navn: {adminUsername}
              </p>
            </div>

            {!gameEnded ? (
            <div className="pt-12 pb-6">
                <h1 className="text-4xl ">Venter på spillerne...</h1>      
            </div>
            ) : (
            <div className="pt-12 pb-6">
              <h1 className="text-4xl ">spillet sluttet se resultatene nedenfor  </h1>
          </div>
            )}
  
              <div className="h-full last:border-b-0 overflow-y-auto">
                  {userCards.map(username => {
                    return (
                      <div
                        className="w-full px-4 py-2 bg-white text-black text-xl rounded-full"
                        key={username}
                      >
                        {username} er med!
                      </div>
                    );
                  })}
                </div>
              </>
              
          ) : (
            <>
  
            </>
          )}

          {!gameEnded ? (
            <>
            <h1 className="text-2xl bg-white text-black rounded-md px-4 py-4 ">Resultatene kommer her etter at du har avsluttet spillet... </h1>
            </>

          ) : ( 

            <>
            <div className="w-96 h-96">
            <Pie data={data} />  
            </div>
            
            <div className="px-4 py-4 text-4xl font-bold">
              <h1>Spillerne har svart:</h1>
            </div>

            <div className="text-4xl font-bold">
              <h1>Det ble brukt {klærPercentage.toFixed(2)}% på klær ("rød").</h1>
            </div>
            
            <div className="text-4xl font-bold pt-4">
              <h1>Det ble brukt {lunsjPercentage.toFixed(2)}% på lunsj ("blå").</h1>
            </div>

            <div className="text-4xl font-bold pt-4 pb-24">
              <h1>Det ble brukt {drikkePercentage.toFixed(2)}% på drikke ("gul").</h1>
            </div>

            </>
            )}
        </main>
      </div>
      </>
    );
  
}