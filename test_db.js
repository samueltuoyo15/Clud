const postgres = require('postgres');
require('dotenv').config({ path: 'server/.env' });
const sql = postgres(process.env.DATABASE_URL);
async function run() {
  const res = await sql`SELECT code FROM otps WHERE email='test@clud.dev' ORDER BY created_at DESC LIMIT 1`;
  console.log(res[0].code);
  const code = res[0].code;
  
  const r2 = await fetch('http://localhost:8080/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@clud.dev', code })
  });
  const data = await r2.json();
  console.log('Verify:', data);
  
  const token = data.accessToken;
  const h = { 'Authorization': `Bearer ${token}` };
  
  const r3 = await fetch('http://localhost:8080/auth/me', { headers: h });
  console.log('Me:', await r3.json());
  
  const r4 = await fetch('http://localhost:8080/projects', { headers: h });
  console.log('Projects:', await r4.json());
  
  const r5 = await fetch('http://localhost:8080/workspaces', { headers: h });
  console.log('Workspaces:', await r5.json());
  
  const r6 = await fetch('http://localhost:8080/integrations', { headers: h });
  console.log('Integrations:', await r6.json());

  process.exit(0);
}
run();
