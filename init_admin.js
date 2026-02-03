
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
        if (res.statusCode === 200 || res.statusCode === 201) {
            console.log('SUCCESS: Admin initialized.');
        } else if (res.statusCode === 403) {
            console.log('NOTE: Admin already exists.');
        }
    });
});

req.on('error', (error) => {
    console.error('ERROR:', error);
});

req.write(data);
req.end();
