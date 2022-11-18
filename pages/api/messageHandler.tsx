export default (io, socket) => {
    const createdMessage = (msg) => {
      socket.broadcast.emit("newIncomingMessage", msg);
    };
  
    socket.on("createdMessage", ({author, message}) => {
        console.log("created_message " ,author, message);
        io.emit("newIncomingMessage", {author, message})
    });
  };