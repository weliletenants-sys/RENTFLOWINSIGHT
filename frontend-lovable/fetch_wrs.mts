import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const envLines = fs.readFileSync('.env', 'utf8').split('\n');
let url = '', key = '';
for (const line of envLines) {
  if (line.startsWith('VITE_SUPABASE_URL=')) url = line.split('=')[1].trim().replace(/['"]/g, '');
  if (line.startsWith('VITE_SUPABASE_PUBLISHABLE_KEY=')) key = line.split('=')[1].trim().replace(/['"]/g, '');
}

const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase
    .from('withdrawal_requests')
    .select('id, status, amount, linked_party, user_id, reason')
    .order('created_at', { ascending: false })
    .limit(30);
  
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}
run();
