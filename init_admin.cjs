
const http = require('http');

const data = JSON.stringify({
    username: 'admin',
    password: 'admin123'
});

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/auth/init',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
        responseData += chunk;
    });

    res.on('end', () => {
        console.log(`Status Code: ${res.statusCode}`);
        console.log('Response Body:', responseData);
    });
});

req.on('error', (error) => {
    console.error('ERROR:', error);
});

req.write(data);
req.end();
