import axios from 'axios';

async function checkOpp() {
  const email = `test.opp.${Date.now()}@example.com`;
  let token = '';
  
  try {
    const regRes = await axios.post('http://localhost:3000/api/auth/registrations', {
        email,
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
        role: 'Funder',
        phone: '+256770' + Math.floor(Math.random() * 1000000)
    });
    token = regRes.data.data?.access_token || regRes.data.access_token;
  } catch (e: any) {
    console.error('Registration failed:', e.response?.data || e.message);
    return;
  }

  try {
    const res = await axios.get('http://localhost:3000/api/funder/opportunities', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Success! Data:', JSON.stringify(res.data, null, 2));
  } catch (e: any) {
    console.error('Error:', e.response?.status, e.response?.data);
  }
}

checkOpp();
