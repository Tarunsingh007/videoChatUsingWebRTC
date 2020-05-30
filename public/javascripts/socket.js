module.exports=(io)=>{
  let c=0;
  io.on('connection', (socket) => {
    console.log("connected")
    socket.on("newClient",()=>{
      c++;
      console.log(c)
      if(2){
        if(1)
        socket.emit("createPeer")
      }
      // else{
      //   socket.emit("sessionActive")
      //   c++;
      // }
    })
    socket.on("offer",sendOffer);
    socket.on("answer",sendAnswer);
    socket.on("disconnect",disconnect);
  });  
  function disconnect(){
    this.broadcast.emit("removeVideo");
    console.log("disconnect",c)
  }
  function sendOffer(offer){
    this.broadcast.emit("signalOffer",offer)
  }
  function sendAnswer(data){
    this.broadcast.emit("signalAnswer",data)
  }
}