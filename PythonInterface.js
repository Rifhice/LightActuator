var net = require("net");
const spawn = require("child_process").spawn;
const pythonProcess = spawn("python", ["./PythonBulbServer/main.py"]);
var socket = new net.Socket();
var webSocket;
socket.connect(
  1111,
  "127.0.0.1"
);
/*
var on = true;
setInterval(function() {
  on ? sendAction("set on") : sendAction("set off");
  on = !on;
}, 3000);
*/
var isBulbConnected = false;
var updateState;
onStateChange = function(Pfunc) {
  updateState = Pfunc;
};

socket.on("connect", function() {
  socket.setEncoding("utf8");
  isBulbConnected = true;
  socket.on("data", function(data) {
    //Response from the python server
    console.log("Python server response => " + data);
    if (data === "success") {
      console.log("Command success !");
    } else if (data === "reconnected") {
      isBulbConnected = true;
      updateState(isBulbConnected);
      console.log("Bulb is now reconnected !");
    } else if (data === "disconnected") {
      isBulbConnected = false;
      updateState(isBulbConnected);
      console.log("Bulb is now disconnected !");
    }
    console.log("_______________________");
  });
});

socket.on("close", function(err) {
  console.log("Connection closed");
  isBulbConnected = false;
  if (!err) {
    socket.connect(
      1111,
      "127.0.0.1"
    );
  }
});

socket.on("error", err => {
  console.log("Error");
  socket.connect(
    1111,
    "127.0.0.1"
  );
});

sendAction = function(action) {
  if (isBulbConnected) {
    console.log("Sending " + action + " to python server !");
    socket.write(action);
  }
};

module.exports = { sendAction, onStateChange };
