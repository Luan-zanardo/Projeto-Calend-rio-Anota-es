import { createClient } from "@supabase/supabase-js";

// Pega as variáveis do .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cria o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);