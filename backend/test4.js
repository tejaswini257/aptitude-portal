async function test() {
    const req = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'google@admin.com', password: 'admin' })
    });
    console.log("Status:", req.status);
    console.log("Body:", await req.text());
}
test();
