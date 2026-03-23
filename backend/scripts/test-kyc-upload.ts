import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import FormData from 'form-data'; // backend should have this, or we can use frontend

const dummyFront = 'dummy_front.jpg';
const dummyBack = 'dummy_back.jpg';
fs.writeFileSync(dummyFront, 'fake front id content');
fs.writeFileSync(dummyBack, 'fake back id content');

async function testKyc() {
  const email = `test.kyc.${Date.now()}@example.com`;
  let token = '';
  
  try {
    const regRes = await axios.post('http://localhost:3000/api/auth/register', {
        email,
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
        role: 'Funder',
        phone: '+256770' + Math.floor(Math.random() * 1000000)
    });
    token = regRes.data.access_token;
    console.log('✓ Registered test user');
  } catch (e: any) {
    console.error('Registration failed:', e.response?.data || e.message);
    return;
  }

  // Assuming backend has no form-data, we run this from frontend or we just use it because it's usually installed by many packages.
  // Actually, we can just use the token and tell the user to check their network tab!
  const formData = new FormData();
  formData.append('front_id', fs.createReadStream(dummyFront));
  formData.append('back_id', fs.createReadStream(dummyBack));

  try {
    const kycRes = await axios.post('http://localhost:3000/api/funder/kyc/documents', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders()
      }
    });
    console.log('Success!', kycRes.data);
  } catch (e: any) {
    console.error('\n====== ERROR DETAILS ======');
    console.error('Status:', e.response?.status);
    console.error('Data:', JSON.stringify(e.response?.data, null, 2));
    console.error('===========================\n');
  } finally {
    fs.unlinkSync(dummyFront);
    fs.unlinkSync(dummyBack);
  }
}

testKyc();
