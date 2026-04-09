import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '')

const ROW_ID = 'main'

export async function loadData() {
  try {
    const { data, error } = await supabase
      .from('app_data')
      .select('*')
      .eq('id', ROW_ID)
      .single()

    if (error) {
      console.error('Load error:', error)
      return null
    }

    return {
      campaigns: data.campaigns || [],
      clickers: data.clickers || [],
      emailVisuals: data.email_visuals || [],
      notes: data.notes || {},
      aiConfig: data.ai_config || { provider: 'anthropic', apiKey: '', ollamaUrl: 'http://localhost:11434', ollamaModel: 'llama3' },
      uploadLog: data.upload_log || [],
    }
  } catch (err) {
    console.error('Load error:', err)
    return null
  }
}

export async function saveData(d) {
  try {
    const { error } = await supabase
      .from('app_data')
      .update({
        campaigns: d.campaigns || [],
        clickers: d.clickers || [],
        email_visuals: d.emailVisuals || [],
        notes: d.notes || {},
        ai_config: d.aiConfig || {},
        upload_log: d.uploadLog || [],
        updated_at: new Date().toISOString(),
      })
      .eq('id', ROW_ID)

    if (error) {
      console.error('Save error:', error)
    }
  } catch (err) {
    console.error('Save error:', err)
  }
}

export async function clearAllData() {
  try {
    const { error } = await supabase
      .from('app_data')
      .update({
        campaigns: [],
        clickers: [],
        email_visuals: [],
        notes: {},
        updated_at: new Date().toISOString(),
      })
      .eq('id', ROW_ID)

    if (error) console.error('Clear error:', error)
  } catch (err) {
    console.error('Clear error:', err)
  }
}
