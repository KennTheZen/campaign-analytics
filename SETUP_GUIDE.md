# Email Campaign Analytics - Setup Guide

## What You're Deploying

A Mailchimp campaign analytics dashboard with:
- Persistent cloud database (data stays forever)
- Accessible from any device via a URL
- Free hosting and storage

## Accounts Needed (all free)

1. **GitHub** - github.com (you have this)
2. **Supabase** - supabase.com (you have this)
3. **Vercel** - vercel.com (you have this)

---

## Step 1: Set Up Supabase (5 minutes)

1. Go to **supabase.com** and log in
2. Click **"New Project"**
3. Give it a name like `campaign-analytics`
4. Choose a strong database password (save it somewhere)
5. Select the **free tier** and a region close to you
6. Wait for the project to finish creating (~1 minute)

### Create the database table:

1. In your Supabase project, click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Paste this entire SQL block and click **"Run"**:

```sql
-- Create the main data storage table
CREATE TABLE IF NOT EXISTS app_data (
  id TEXT PRIMARY KEY DEFAULT 'main',
  campaigns JSONB DEFAULT '[]'::jsonb,
  clickers JSONB DEFAULT '[]'::jsonb,
  email_visuals JSONB DEFAULT '[]'::jsonb,
  notes JSONB DEFAULT '{}'::jsonb,
  ai_config JSONB DEFAULT '{"provider":"anthropic","apiKey":"","ollamaUrl":"http://localhost:11434","ollamaModel":"llama3"}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the initial empty row
INSERT INTO app_data (id) VALUES ('main') ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security but allow all access (simple setup)
ALTER TABLE app_data ENABLE ROW LEVEL SECURITY;

-- Allow anyone with the anon key to read and write
CREATE POLICY "Allow all access" ON app_data
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

4. You should see "Success" message

### Get your Supabase keys:

1. Click **"Settings"** (gear icon) in the left sidebar
2. Click **"API"** under Configuration
3. You need TWO values:
   - **Project URL** - looks like `https://abcdefgh.supabase.co`
   - **anon/public key** - a long string starting with `eyJ...`
4. Copy both and save them - you'll need them in Step 3

---

## Step 2: Push Code to GitHub (3 minutes)

1. Go to **github.com** and click **"New Repository"** (the + icon top-right)
2. Name it `campaign-analytics`
3. Keep it **Public** or **Private** (your choice)
4. **Don't** check "Add README" or any other options
5. Click **"Create Repository"**

### Upload the project files:

**Option A - Simple upload (no terminal needed):**
1. On your new empty repo page, click **"uploading an existing file"** link
2. Drag the entire contents of the project folder I give you
3. Click **"Commit changes"**

**Option B - Using terminal (if comfortable):**
```bash
cd campaign-analytics
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/campaign-analytics.git
git push -u origin main
```

---

## Step 3: Deploy on Vercel (3 minutes)

1. Go to **vercel.com** and log in
2. Click **"Add New Project"**
3. Click **"Import"** next to your `campaign-analytics` repo
4. In the **"Configure Project"** screen:
   - Framework Preset: **Vite** (should auto-detect)
   - Expand **"Environment Variables"** section
   - Add these two variables:

   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | Your Supabase Project URL |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

5. Click **"Deploy"**
6. Wait ~1 minute. Vercel will give you a URL like `campaign-analytics-abc.vercel.app`

**That's it! Your dashboard is live.**

---

## How It Works After Setup

- Open your Vercel URL on any device
- Upload campaign reports - data saves to Supabase automatically
- Open the same URL on your phone, laptop, or share with a colleague - same data everywhere
- Data stays forever unless you manually delete it from the dashboard

## Updating the Dashboard

If you ever need to update the code:
1. Edit files in your GitHub repo
2. Vercel automatically redeploys within ~30 seconds

## Troubleshooting

**Blank screen after deploy?**
- Check Vercel's deployment logs for errors
- Verify environment variables are set correctly (Settings > Environment Variables)

**Data not saving?**
- Check Supabase: go to Table Editor > app_data and see if the row exists
- Verify the SQL was run successfully

**Need to reset all data?**
- In Supabase SQL Editor, run: `UPDATE app_data SET campaigns='[]', clickers='[]', email_visuals='[]', notes='{}' WHERE id='main';`
