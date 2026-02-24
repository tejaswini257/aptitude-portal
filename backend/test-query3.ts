import axios from 'axios';

async function main() {
    try {
        const loginRes = await axios.post('http://localhost:3001/auth/login', {
            email: 'admin@college.com',
            password: 'password123'
        });
        const token = loginRes.data.access_token;

        const testsRes = await axios.get('http://localhost:3001/tests?withAttemptCount=true', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log(JSON.stringify(testsRes.data, null, 2));
    } catch (err: any) {
        console.error('Error:', err.message);
    }
}

main();
