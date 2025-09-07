const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Generate k6 script
function generateK6Script(config) {
  const { url, method, headers, body, vus, duration, testType } = config;
  
  let script = `
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: ${vus},
  duration: '${duration}',
`;

  if (testType === 'spike') {
    script += `
  stages: [
    { duration: '10s', target: ${vus} },
    { duration: '1m', target: ${vus} },
    { duration: '10s', target: ${vus * 2} },
    { duration: '3m', target: ${vus * 2} },
    { duration: '10s', target: ${vus} },
    { duration: '3m', target: ${vus} },
    { duration: '10s', target: 0 },
  ],`;
  } else if (testType === 'stress') {
    script += `
  stages: [
    { duration: '2m', target: ${vus} },
    { duration: '5m', target: ${vus} },
    { duration: '2m', target: ${vus * 1.5} },
    { duration: '5m', target: ${vus * 1.5} },
    { duration: '2m', target: ${vus * 2} },
    { duration: '5m', target: ${vus * 2} },
    { duration: '10m', target: 0 },
  ],`;
  }

  script += `
};

export default function () {
  let params = {
    headers: ${JSON.stringify(headers || {})},
  };
  
  let payload = ${body ? JSON.stringify(body) : 'null'};
  
  let res = http.${method.toLowerCase()}('${url}', payload, params);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}`;

  return script;
}

// Run k6 test endpoint
app.post('/api/run-test', async (req, res) => {
  try {
    const config = req.body;
    const script = generateK6Script(config);
    
    // Write script to temporary file
    const scriptPath = path.join(__dirname, 'temp', `test-${Date.now()}.js`);
    await fs.promises.mkdir(path.dirname(scriptPath), { recursive: true });
    await fs.promises.writeFile(scriptPath, script);
    
    // Run k6 test
    exec(`k6 run --out json=${scriptPath}.json ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error('K6 execution error:', error);
        return res.status(500).json({ 
          error: 'Failed to run k6 test',
          details: error.message 
        });
      }
      
      try {
        // Parse k6 output
        const results = JSON.parse(stdout);
        
        // Clean up temporary files
        fs.unlinkSync(scriptPath);
        if (fs.existsSync(`${scriptPath}.json`)) {
          fs.unlinkSync(`${scriptPath}.json`);
        }
        
        res.json({
          success: true,
          metrics: results
        });
      } catch (parseError) {
        console.error('Parse error:', parseError);
        res.status(500).json({ 
          error: 'Failed to parse k6 results',
          details: parseError.message 
        });
      }
    });
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`API Perf Tester Backend running on port ${PORT}`);
});