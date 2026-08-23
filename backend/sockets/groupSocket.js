module.exports = (io, socket) => {


    socket.on("join-group", (groupId) => {
    //    console.log("join group")
        socket.join(groupId);

    });


socket.on("group-typing", ({ groupId, user }) => {
    // console.log("user icon :", user.icon)
    socket.to(groupId).emit("user-typing", {
        userId: user._id,
        username: user.username,
        icon: user.icon
    });
});



    socket.on("stop-group-typing", ({ groupId, userId }) => {

        socket.to(groupId)
            .emit(
                "user-stop-typing",
                {
                    userId
                });


    });


};