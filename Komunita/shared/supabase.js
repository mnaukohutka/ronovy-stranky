import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js'

const supabaseUrl = 'https://dnidjzrljwlpifyhftwt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuaWRqenJsandscGlmeWhmdHd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NzczNDMsImV4cCI6MjA2ODM1MzM0M30.L2-Jl5Ob0cMDAr-n0_KcOdaEr-87kWCb7c0QcXy3_Hw'

export const supabase = createClient(supabaseUrl, supabaseKey)
