const fs = require('fs');
const file = 'c:/Users/USER/Documents/RENTFLOWINSIGHT/frontend-lovable/src/hooks/useAuthForm.ts';
let content = fs.readFileSync(file, 'utf8');

const startMarker = `    // Normalize phone to last 9 digits (strips country code / leading zeros)`;
const endMarker = `    if (loginSuccess) {`;

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `    let loginSuccess = false;
    let lastError: Error | null = null;
    let accountExists = false;

    try {
      // By posting the raw phone variable, our global Proxy Interceptor
      // properly maps it natively to /api/auth/login, skipping flawed Lovable email resolution
      const { error } = await signIn(phone, password);
      
      if (!error) {
        loginSuccess = true;
      } else {
        lastError = error;
        if (error.message && (error.message.includes('Invalid') || error.message.includes('Incorrect'))) {
          accountExists = true;
        }
      }
    } catch (e: any) {
      lastError = e;
    }

`;
  content = content.substring(0, startIdx) + replacement + content.substring(endIdx);
  fs.writeFileSync(file, content);
  console.log('Successfully replaced useAuthForm.ts');
} else {
  console.log('Markers not found', startIdx, endIdx);
}
