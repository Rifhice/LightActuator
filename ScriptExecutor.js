var net = require("net");
const spawn = require("child_process").spawn;

sendAction = function(action) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python", [
      "./PythonBulbServer/BulbScript.py",
      action
    ]);
    console.log("Python script executing...");
    pythonProcess.stdout.on("data", data => {
      console.log(`child stdout => ${data}`);
      if (data == "error\n") {
        reject(data);
      } else {
        resolve(data /*give state of actuator ?*/);
      }
    });
  });
};

module.exports = { sendAction };
