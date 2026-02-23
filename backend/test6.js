const fs = require('fs');
async function test() {
    const passwords = ['Admin@123', 'admin', 'password', '123456', 'google', '......'];
    let log = "";
    for (const p of passwords) {
        const res = await fetch('http://localhost:3001/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'google@admin.com', password: p })
        });
        log += `Password: ${p} | Status: ${res.status}\n`;
        log += await res.text() + "\n";
    }
    fs.writeFileSync('output.log', log);
}
test();
