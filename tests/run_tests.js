const fs = require('fs');
const path = require('path');

const BASE = process.env.TEST_BASE || 'http://localhost:5001/api/users';

async function run() {
  const outDir = path.join(__dirname);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const now = Date.now();
  const email = `alice.${now}@example.com`;

  try {
    // POST
    const postRes = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: 'Alice', lastName: 'Smith', email, age: 30, role: 'user' })
    });
    const postJson = await postRes.json();
    fs.writeFileSync(path.join(outDir, 'post.json'), JSON.stringify({ status: postRes.status, body: postJson }, null, 2));

    if (!postJson.data || !postJson.data._id) {
      console.log('POST failed or did not return id. See tests/post.json');
      process.exit(1);
    }

    const id = postJson.data._id;

    // GET all
    const getAllRes = await fetch(BASE);
    const getAllJson = await getAllRes.json();
    fs.writeFileSync(path.join(outDir, 'get_all.json'), JSON.stringify({ status: getAllRes.status, body: getAllJson }, null, 2));

    // GET one
    const getOneRes = await fetch(`${BASE}/${id}`);
    const getOneJson = await getOneRes.json();
    fs.writeFileSync(path.join(outDir, 'get_one.json'), JSON.stringify({ status: getOneRes.status, body: getOneJson }, null, 2));

    // PUT update
    const putRes = await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: 'Alicia', lastName: 'Smith', email, age: 31, role: 'admin' })
    });
    const putJson = await putRes.json();
    fs.writeFileSync(path.join(outDir, 'updated.json'), JSON.stringify({ status: putRes.status, body: putJson }, null, 2));

    // DELETE
    const delRes = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
    let delBody;
    try { delBody = await delRes.json(); } catch(e) { delBody = null }
    fs.writeFileSync(path.join(outDir, 'deleted.json'), JSON.stringify({ status: delRes.status, body: delBody }, null, 2));

    // Final GET
    const finalRes = await fetch(BASE);
    const finalJson = await finalRes.json();
    fs.writeFileSync(path.join(outDir, 'final.json'), JSON.stringify({ status: finalRes.status, body: finalJson }, null, 2));

    console.log('TESTS_COMPLETED');
    console.log(`Saved: ${Object.keys(fs.readdirSync(outDir)).join(', ')}`);
  } catch (err) {
    console.error('TEST_ERROR', err.message);
    process.exit(1);
  }
}

run();
