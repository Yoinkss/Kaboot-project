import { Server } from "socket.io";
import { createServer } from "http";


export default function SocketHandler(req, res) {
  // It means that socket server was already initialised
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }
  
  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  // Define actions inside
    io.on("connection", socket => {
        messageHandler(io, socket);
        socket.emit('testing', "Jeg elsker sockets")
        console.log("Socket.tsx funker ")

        socket.on("user_joined", username => {
            console.log(`Socket.on (user_joined) funker og har sendt ut (put_user_on_screen) + ${username}`)
            io.emit("put_user_on_screen", username)
        })

        socket.on("start_game", (startSpill) => {
          
          socket.broadcast.emit("game_started", startSpill)
          console.log(startSpill);
        })

        socket.on("form1_index", (form1) => {
          socket.broadcast.emit("form1_nodeserver", form1);
          console.log(form1 + " Dette er form1 i socket.tsx");
        })

        socket.on("form2_index", (form2) => {
          socket.broadcast.emit("form2_nodeserver", form2);
          console.log(form2 + " dette er form2 fra socket.tsx");
        });

        socket.on("form3_index", (form3) => {
          socket.broadcast.emit("form3_nodeserver", form3);
          console.log(form3 + " Dette er form3 i socket.tsx");
        })
        
    });

  console.log("Setting up socket");
  res.end();

}
