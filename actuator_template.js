const net = require("net");
const JsonSocket = require("json-socket");
const fs = require("fs");
const config = require("./config.json");

const registration_data = require("./registration.json");

var socket = new JsonSocket(new net.Socket());
socket.connect(
  1337,
  "127.0.0.1"
);

const action = {
  registration: onRegistration,
  connection: onConnection,
  execute: onExecute
};

function onExecute(data) {
  //TO IMPLEMENT
  console.log(data.executable);
}

function onRegistration(data) {
  if (data.result === "success") {
    console.log("Registration success");
    fs.writeFile("./config.json", JSON.stringify({ id: data.id }), err => {
      if (err) return console.log(err);
      console.log("The file was saved!");
    });
  }
}

function onConnection(data) {
  if (data.result === "success") {
    console.log("Connection success");
  }
}

function unknowAction(data) {
  console.log("Unknown action");
}

function onSocketConnection() {
  if (config.id == null) {
    socket.sendMessage({
      action: "registration",
      data: registration_data
    });
  } else {
    socket.sendMessage({
      action: "connection",
      data: [config.id, registration_data]
    });
  }
}

socket.on("connect", function() {
  onSocketConnection();

  socket.on("message", function(data) {
    if (data) {
      const func = action[data.action];
      func ? func(data) : unknowAction(data);
    }
  });

  socket.on("close", function() {
    console.log("Connection closed");
  });
});
