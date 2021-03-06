const cluster = require("cluster");
const server = require("./server");


const {cpus} = require('os')
const process = require('process')

const numCPUs = cpus().length;
const WORKERS = process.env.WEB_CONCURRENCY || numCPUs;

if (cluster.isMaster) {
  for (var i = 0; i < WORKERS; i++) {
    cluster.fork();
  }
  cluster.on("online", (worker) => {
    console.log(`${worker.id}: ${worker.state}`);
  });
  cluster.on("exit", (worker) => {
    cluster.fork();
  });
} else {
  try {
    server.run(cluster.worker.process.pid);
  } catch (error) {
    console.log(error.code);
  }
}
