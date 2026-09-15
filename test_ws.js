async function run() {
  const r = await fetch('http://localhost:8080/workspaces');
  console.log('Status:', r.status);
  const text = await r.text();
  console.log('Body:', text.substring(0, 100));
}
run();
