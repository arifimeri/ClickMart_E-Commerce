import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fqaybdpfubkpwxhzfrvq.supabase.co';
const supabaseAnonKey = 'sb_publishable_NJXuRPMktN0Wcq-BATGoKg_a8sF6I4F';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);