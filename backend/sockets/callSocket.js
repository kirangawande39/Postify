const { onlineUsers } = require("./userSocket");


module.exports = (io, socket) => {


    socket.on("call-user", ({ to, offer, username }) => {


        const socketId = onlineUsers.get(to);

        if (!socketId) {

            socket.emit(
                "user-not-available",
                {
                    message: "offline"
                });

            return;

        }

        io.to(socketId)
            .emit(
                "incoming-call",
                {
                    from: socket.id,
                    offer,
                    username
                });


    });



    socket.on("answer-call", ({ to, answer }) => {


        io.to(to)
            .emit(
                "call-answered",
                {
                    answer,
                    from: socket.id
                });


    });



    socket.on("ice-candidate", ({ to, candidate }) => {


        if (!to || !candidate)
            return;


        io.to(to)
            .emit(
                "ice-candidate",
                candidate
            );


    });



    socket.on("call-rejected", ({ to }) => {


        io.to(to)
            .emit("call-rejected");


    });



    socket.on("end-call", ({ to }) => {


        io.to(to)
            .emit("call-ended");


    });


};