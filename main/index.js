// pm2
// process.env.UV_THREADPOOL_SIZE = 1;
// const cluster = require("cluster");

// // Is the file being executes in master mode
// if (cluster.isMaster) {
// 	// Cause index.js to be executed *again* in child mode.
// 	cluster.fork();
// 	cluster.fork();

// } else {
// 	// I am a child
// 	// I am going to act like a sever and do nothing else
// 	const express = require("express");
// 	const crypto = require("crypto");
// 	const app = express();

// 	function doWork(duration) {
// 		const start = Date.now();

// 		while (Date.now() - start < duration) {}
// 	}

// 	app.get("/", (req, res) => {
// 		crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
// 			res.send("Hi there!");
// 		});
// 	});

// 	app.get("/fast", (req, res) => {
// 		res.send("This was fast");
// 	});

// 	app.listen(3000, () => {
// 		console.log("App listening on port 3000");
// 	});
// }

// Worker threads
const express = require("express");
const crypto = require("crypto");
const { Worker } = require("worker_threads");

const app = express();

app.get("/", (req, res) => {
	const worker = new Worker("./worker.js");

	worker.on("message", function (message) {
		console.log(message);
		res.send("" + message);
	});

	worker.postMessage("start!");
});

app.get("/fast", (req, res) => {
	res.send("This was fast");
});

app.listen(3000, () => {
	console.log("App listening on port 3000");
});
