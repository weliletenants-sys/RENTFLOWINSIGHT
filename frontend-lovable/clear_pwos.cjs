const fs = require('fs');
const envLines = fs.readFileSync('.env', 'utf8').split('\n');
let url='', key='';
envLines.forEach(l => {
  if(l.startsWith('VITE_SUPABASE_URL=')) url=l.split('=')[1].trim().replace(/['"]/g, '');
  if(l.startsWith('VITE_SUPABASE_PUBLISHABLE_KEY=')) key=l.split('=')[1].trim().replace(/['"]/g, '');
});

url = url.trim().replace(/\r/g, '');
key = key.trim().replace(/\r/g, '');

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(url, key);

async function run() {
  const { data: pwos, error } = await supabase
    .from('pending_wallet_operations')
    .select('id, amount, status, target_wallet_user_id, created_at, linked_party')
    .eq('status', 'approved')
    .in('category', ['roi_payout', 'supporter_platform_rewards']);

  if (error) {
    console.error('Error fetching PWOs:', error);
    return;
  }
  
  console.log('Found', pwos.length, 'PWOs');
  for (const pwo of pwos) {
     console.log('Marking as processed:', pwo.id);
     await supabase.from('pending_wallet_operations').update({status: 'processed'}).eq('id', pwo.id);
  }
  console.log('Done.');
}

run();
