var socket=io()
let p=require('simple-peer');
localVideo=document.querySelector(".localVideo");
var client={};

navigator.mediaDevices.getUserMedia({
  video:true,
  audio:false
})
.then((stream)=>{
  socket.emit('newClient')
  localVideo.srcObject=stream;
  localVideo.play()

  function initPeer(type){
    let peer=new p({initiator:(type=="init")?true:false,stream:stream,trickle:false})
    peer.on('stream',(stream)=>{
      createVideo(stream);
    })
    peer.on("close",()=>{
      var s=document.querySelector(".remoteVideo");
      s.remove();
      peer.destroy()
    })
    return peer
  }

  function  removeVideo(){
    var s=document.querySelector(".remoteVideo");
    s.remove();
  }

  function createPeer(){
    client.gotAnswer=false;
    let peer=initPeer("init")
    peer.on("signal",(data)=>{
      if(!client.gotAnswer){
        socket.emit("offer",data);
      }
    })
    client.peer=peer;
  }

  function signalOffer(offer){
    let peer=initPeer('notInit')
    peer.on("signal",(data)=>{
      socket.emit("answer",data);
    })
    peer.signal(offer)
  }

  function signalAnswer(answer){
    client.gotAnswer=true;
    let peer=client.peer;
    peer.signal(answer);
  }

  function createVideo(stream){
    console.log("video")
    let video=document.createElement('video');
    video.className="remoteVideo";
    video.srcObject=stream;
    document.querySelector(".videoContainer").appendChild(video);
    video.play();
  }

  function sessionActive(){
    document.write("session active")
  }

  socket.on("signalOffer",signalOffer)
  socket.on("signalAnswer",signalAnswer)
  socket.on("sessionActive",sessionActive)
  socket.on("createPeer",createPeer)
  socket.on("removeVideo",removeVideo)
})
.catch(err=>{
  console.log(err);
})