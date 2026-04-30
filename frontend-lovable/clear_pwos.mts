import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing URL or KEY");
  process.exit(1);
}

const supabase = createClient(url, key);

async function clearPWOs() {
  // The user wants to clear the PWOs for the currently logged in agent.
  // We can fetch the PWOs that are 'approved' and in the categories.
  // We will mark them as 'processed' or add a metadata flag to clear them.
  const { data, error } = await supabase
    .from('pending_wallet_operations')
    .select('id, metadata')
    .eq('status', 'approved')
    .in('category', ['roi_payout', 'supporter_platform_rewards'])
    // We update them to 'expired' or just update the metadata
    .limit(100);
    
  if (error) {
    console.error(error);
    return;
  }
  
  console.log("Found", data.length, "PWOs to clear");
  for (const pwo of data) {
    console.log("Clearing PWO:", pwo.id);
    const newMetadata = { ...(pwo.metadata || {}), is_proxy_cleared: true };
    await supabase.from('pending_wallet_operations').update({ metadata: newMetadata, status: 'processed', description: 'Cleared by proxy agent - expired' }).eq('id', pwo.id);
  }
  console.log("Done.");
}

clearPWOs();
