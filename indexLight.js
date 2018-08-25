const net = require("net");
const JsonSocket = require("json-socket");
const fs = require("fs");
const config = require("./config.json");
const ScriptExecutor = require("./ScriptExecutor");

const registration_data = require("./registration.json");

var socket = new JsonSocket(new net.Socket());
socket.connect(
  config.Server_Port,
  config.Server_Ip
);

const action = {
  registration: onRegistration,
  connection: onConnection,
  disconnection: onDisconnection,
  execute: onExecute
};

function onExecute(data) {
  console.log("Execute action => " + data.executable);
  ScriptExecutor.sendAction(data.executable)
    .then(res => {
      console.log("Sending update");
      socket.sendMessage({
        action: "execute",
        result: "success",
        actuatorId: data.actuatorId,
        data: data.data,
        actionKey: data.actionKey
      });
    })
    .catch(err => {
      socket.sendMessage({
        action: "execute",
        result: "error"
      });
      console.log(err);
    });
}

function onRegistration(data) {
  if (data.result === "success") {
    console.log("Registration success");
    config.id = data.id;
    fs.writeFile("./config.json", JSON.stringify(config), err => {
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
  if (!err) {
    socket.connect(
      config.Server_Port,
      config.Server_Ip
    );
  }
});

socket.on("error", err => {
  console.log("Error");
  socket.connect(
    config.Server_Port,
    config.Server_Ip
  );
});
