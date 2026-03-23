import axios from 'axios';

async function main() {
  try {
    const res = await axios.post('http://localhost:3000/api/auth/sessions', {
      email: 'pexpert@gmail.com',
      password: 'password123' 
    });
    console.log('Success:', res.data);
  } catch (err: any) {
    if (err.response) {
      console.log('Error Status:', err.response.status);
      console.log('Error Data:', err.response.data);
    } else {
      console.log('Error:', err.message);
    }
  }
}

main();
