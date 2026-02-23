async function test() {
    const passwords = ['Admin@123', 'admin', 'password', '123456', 'google', '......'];
    for (const p of passwords) {
        const res = await fetch('http://localhost:3001/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'google@admin.com', password: p })
        });
        console.log(`Password: ${p} | Status: ${res.status}`);
        console.log(await res.text());
    }
}
test();
