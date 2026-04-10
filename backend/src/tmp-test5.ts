import axios from 'axios';

async function test() {
  try {
    const res = await axios.post('http://localhost:3000/api/admin/auth/login', {
      phone: 'admin@welile.com',
      password: 'admin'
    }, {
      headers: {
        'Origin': 'http://admin.localhost:5173'
      }
    });
    console.log('Login successful');
    const token = res.data.data.access_token;
    
    console.log('Making CFO request');
    const cfoRes = await axios.get('http://localhost:3000/api/admin/cfo/statistics/overview', {
      headers: { 
        Authorization: `Bearer ${token}`,
        Origin: 'http://admin.localhost:5173'
      }
    });
    console.log('CFO API Response:', cfoRes.status);
    console.log('CFO Data:', cfoRes.data);
  } catch (err: any) {
    if (err.response) {
      console.log('Error Status:', err.response.status);
      console.log('Error Data:', err.response.data);
    } else {
      console.log('Error:', err.message);
    }
  }
}
test();
