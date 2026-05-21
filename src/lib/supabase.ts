import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://crntapnmiqsczamrjjwp.supabase.co'
const SUPABASE_KEY = 'sb_publishable_mGBYat9A9U9yjYY7GNiGKQ_CJcLhb-k'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
