const net = require("net");
const JsonSocket = require("json-socket");
const fs = require("fs");
const config = require("./config.json");
const PythonInterface = require("./PythonInterface");

const registration_data = require("./registration.json");

var socket = new JsonSocket(new net.Socket());
socket.connect(
  1337,
  "192.168.0.24"
);

const action = {
  registration: onRegistration,
  connection: onConnection,
  disconnection: onDisconnection,
  execute: onExecute
};

function onExecute(data) {
  console.log("Received action => " + data.executable);
  PythonInterface.sendAction(data.executable);
}

function onRegistration(data) {
  if (data.result === "success") {
    console.log("Registration success");
    fs.writeFile("./config.json", JSON.stringify({ id: data.id }), err => {
      if (err) return console.log(err);
      console.log("The file was saved!");
      config.id = data.id;
    });
  }
}

function onConnection(data) {
  if (data.result === "success") {
    console.log("Connection success");
  }
}

function onDisconnection(data) {
  if (data.result === "success") {
    console.log("Disconnection success");
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
PythonInterface.onStateChange(isConnected => {
  if (!isConnected) {
    socket.sendMessage({
      action: "disconnection",
      data: [config.id, registration_data]
    });
  } else {
    socket.sendMessage({
      action: "connection",
      data: [config.id, registration_data]
    });
  }
  console.log("Is Light bulb connected :  " + isConnected);
});
socket.on("connect", function() {
  onSocketConnection();

  socket.on("message", function(data) {
    if (data) {
      const func = action[data.action];
      func ? func(data) : unknowAction(data);
    }
  });
});

socket.on("close", function(err) {
  console.log("Connection closed");
  isBulbConnected = false;
  if (!err) {
    socket.connect(
      1337,
      "192.168.0.24"
    );
  }
});

socket.on("error", err => {
  console.log("Error");
  socket.connect(
    1337,
    "192.168.0.24"
  );
});
