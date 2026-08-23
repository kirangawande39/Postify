const { userSocket } = require("./userSocket");
const chatSocket = require("./chatSocket");
const postSocket = require("./postSocket");
const groupSocket = require("./groupSocket");
const callSocket = require("./callSocket");


const initSocket = (io) => {

    io.on("connection", (socket) => {

        // console.log("user connected")

        userSocket(io, socket);

        chatSocket(io, socket);

        postSocket(io, socket);

        groupSocket(io, socket);

        callSocket(io, socket);

    });

};


module.exports = {
    initSocket
};