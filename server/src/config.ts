import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Try multiple relative paths for .env loading
const envPaths = [
  path.resolve(process.cwd(), '../.env'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../.env')
];

for (const p of envPaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    break;
  }
}

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  elevenlabsApiKey: process.env.ELEVENLABS_API_KEY || 'sk_6865432e992cc22a22e4e74bd1e8950f2843f3d0d51712f3',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  supabaseUrl: process.env.SUPABASE_URL || 'https://ekzazizbxpnphcuvxkub.supabase.co',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  pexelsApiKey: process.env.PEXELS_API_KEY || 'apgXE1l2VxkBi6wB074XbzCR0eFqGd8b5BUyTC7gGf9pAlMPiuhqLlxX'
};
