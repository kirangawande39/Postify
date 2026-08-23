const emitter = require('../events/emitter');


emitter.on('postLiked', async(data)=>{
    console.log("Post like event received", data)
});







