const express = require('express');
const { spawn } = require('child_process');

const app = express();

app.use(express.static('public')); // Serve the HTML file

app.post('/execute-script', (req, res) => {
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

app.get('/trigger-build', (req, res) => {
  // Send an HTTP POST request to the Netlify build hook URL
  const { spawn } = require('child_process');
  const curlProcess = spawn('curl', ['-X', 'POST', 'https://api.netlify.com/build_hooks/64b327bf29229957db067a13']);

  curlProcess.stdout.on('data', (data) => {
    console.log(`Build hook response: ${data}`);
  });

  curlProcess.stderr.on('data', (data) => {
    console.error(`Build hook error: ${data}`);
  });

  curlProcess.on('close', (code) => {
    console.log(`Build hook process exited with code ${code}`);
    res.sendStatus(200);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
