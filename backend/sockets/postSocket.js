module.exports=(io,socket)=>{


socket.on("join-post",(postId)=>{

 socket.join(postId);

});



socket.on("new-comment",(comment)=>{


 const {postId}=comment;


 if(postId){

 socket.to(postId)
 .emit(
 "new-comment",
 comment
 );

 }


});



socket.on("delete-comment",({commentId,postId})=>{


 socket.to(postId)
 .emit(
 "delete-comment",
 {
  commentId
 }
 );


});


};