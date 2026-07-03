const http = require('http');

function req(method, path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      host: 'localhost',
      port: 3000,
      path,
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    const r = http.request(options, (res) => {
      let d = '';
      res.on('data', (c) => (d += c));
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    r.on('error', reject);
    if (body) r.write(JSON.stringify(body));
    r.end();
  });
}

(async () => {
  try {
    console.log('Creating permission...');
    const p = await req('POST', '/api/permissions', {
      actionName: 'deleteUser',
      description: 'Can delete a user',
      method: 'DELETE',
      baseUrl: '/api/users',
      path: '/:id',
    });
    console.log('Permission create:', p.status, p.body);
    const perm = JSON.parse(p.body);

    console.log('Creating role with proper array...');
    const r = await req('POST', '/api/roles', {
      roleName: 'tempRole',
      permissions: [perm._id],
    });
    console.log('Role create:', r.status, r.body);
    const role = JSON.parse(r.body);

    console.log('Updating role with stringified permissions...');
    const u = await req('PUT', '/api/roles/' + role._id, {
      roleName: 'superadmin',
      permissions: JSON.stringify([perm._id]),
    });
    console.log('Role update:', u.status, u.body);
  } catch (e) {
    console.error('Test error:', e);
  }
})();
