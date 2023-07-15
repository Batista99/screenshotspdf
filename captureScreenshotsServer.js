const express = require('express');
const { spawn } = require('child_process');

const app = express();

app.use(express.static('public')); // Serve the HTML file

app.get('/execute-script', (req, res) => {
  try {
    const scriptProcess = spawn('node', ['captureScreenshotsPDF-urlsPRDPreviewOrLiveL0L1v2.js']);

    scriptProcess.stdout.on('data', (data) => {
      console.log(`Script output: ${data}`);
    });

    scriptProcess.stderr.on('data', (data) => {
      console.error(`Script error: ${data}`);
    });

    scriptProcess.on('close', (code) => {
      console.log(`Script process exited with code ${code}`);
      res.sendStatus(200);
    });
  } catch (error) {
    console.error('Error executing script:', error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
