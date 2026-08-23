module.exports=(io,socket)=>{


socket.on("join-chat",(chatId)=>{

 socket.join(chatId);

});



socket.on("typing",({chatId,senderId})=>{

console.log("user typing")
 socket.to(chatId)
 .emit("typing",{senderId});


});


socket.on("stop-typing",({chatId,senderId})=>{


 socket.to(chatId)
 .emit("stop-typing",{senderId});


});

socket.on("delete-message",({chatId,msgId})=>{


 socket.to(chatId)
 .emit("delete-message",{msgId});


});


};