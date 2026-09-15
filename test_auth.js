async function test() {
  const r1 = await fetch('http://localhost:8080/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@clud.dev', firstName: 'T', lastName: 'T', country: 'US' })
  });
  console.log('Signup:', await r1.json());
}
test();
