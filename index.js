'use strict';
const cluster = require('cluster');
const app = require('./app');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  cluster.on('exit', worker => {
    console.log(`${worker.process.pid} died - ${Object.keys(cluster.workers).length} running`);  
    cluster.fork();
  });
  cluster.on('online', worker => {
    console.log(`${Object.keys(cluster.workers).length} Worker running - ${worker.process.pid}`);
  });

  for (let i = 0; i < numCPUs; i++) cluster.fork();
} else {
  app();  
}

process.on('uncaughtException', err => {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
  console.error(err.stack);
  process.exit(1);
});