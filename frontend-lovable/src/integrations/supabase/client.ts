// Intercepted Native Client
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:3000';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'fake-key';

// Create base instance with a Native Fetch Interceptor purely for Data queries
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: async (url, options) => {
      const urlStr = url.toString();
      let targetUrl = urlStr;
      
      // We only intercept mutating requests ensuring they pass through Zero-Trust backend.
      // Safe reads (GET) can utilize direct Supabase CDN/Edge for speed.
      const method = options?.method?.toUpperCase() || 'GET';
      const isMutation = ['POST', 'PATCH', 'PUT', 'DELETE'].includes(method);

      if (isMutation) {
        // Detour PostgREST REST mutating endpoints
        if (urlStr.includes('/rest/v1/')) {
          // EXCEPTION: Let the legacy Supabase Auth Email Lookups hit Live Supabase properly to map Live user credentials!
          if (urlStr.includes('/rest/v1/rpc/get_email_by_phone')) {
               return fetch(urlStr, options);
          }
          targetUrl = urlStr.replace(SUPABASE_URL + '/rest/v1/', 'http://localhost:3000/api/rest/');
        } 
        // Detour PostgREST RPC endpoints
        else if (urlStr.includes('/rest/v1/rpc/')) {
          targetUrl = urlStr.replace(SUPABASE_URL + '/rest/v1/rpc/', 'http://localhost:3000/api/rpc/');
        }
      }

      // The raw supabase-js auth client completely governs token injections naturally into 'options' 
      return fetch(targetUrl, options);
    }
  }
});