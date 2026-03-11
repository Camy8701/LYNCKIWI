# Database Setup for Messages Feature

This document explains how to set up the messages table in your Supabase database.

## Messages Table Setup

The messages table stores contact form submissions from website visitors. Follow these steps to create it:

### Step 1: Run the Migration SQL

1. Log in to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor** from the left sidebar
4. Create a new query
5. Copy the contents of `/supabase/migrations/create_messages_table.sql`
6. Paste it into the SQL editor
7. Click **Run** to execute the migration

### Step 2: Verify the Table

After running the migration, verify the table was created:

```sql
SELECT * FROM public.messages LIMIT 1;
```

You should see the messages table with these columns:
- `id` (UUID, primary key)
- `name` (TEXT, required)
- `email` (TEXT, required)
- `subject` (TEXT, required)
- `message` (TEXT, required)
- `status` (TEXT, default: 'unread')
- `created_at` (TIMESTAMPTZ, auto-generated)
- `updated_at` (TIMESTAMPTZ, auto-updated)
- `read_at` (TIMESTAMPTZ, nullable)
- `read_by` (UUID, nullable, foreign key to auth.users)
- `notes` (TEXT, nullable)

### Step 3: Test the Setup

1. Navigate to `/contact` on your website
2. Fill out and submit the contact form
3. Check your Supabase dashboard under **Table Editor** → **messages**
4. You should see your test submission

### Step 4: View Messages in Admin Panel

1. Log in to the admin panel at `/admin/login`
2. Navigate to **Messages** from the sidebar (✉️ icon)
3. You'll see all contact form submissions
4. Click on a message to view details, reply, archive, or delete

## Row Level Security (RLS) Policies

The migration automatically sets up these security policies:

1. **Public Insert**: Anyone can submit messages (contact form)
2. **Admin Read**: Only authenticated users (admins) can view messages
3. **Admin Update**: Only authenticated users (admins) can update messages
4. **Admin Delete**: Only authenticated users (admins) can delete messages

## Email Notifications

Currently, the contact form uses a `mailto:` link approach which opens the user's default email client. This is a temporary solution.

### Upgrading to Automated Emails (Recommended)

For production, you should implement automated email notifications using one of these services:

#### Option 1: Supabase Edge Functions + Resend

1. Install Resend: https://resend.com
2. Create a Supabase Edge Function to send emails
3. Trigger the function when a new message is inserted

#### Option 2: SendGrid

1. Install SendGrid: https://sendgrid.com
2. Add SendGrid API key to environment variables
3. Create an API endpoint to send emails

#### Option 3: Supabase Database Webhooks

1. Set up a webhook in Supabase
2. Point it to your email service
3. Trigger on INSERT to messages table

## Message Status Workflow

Messages have three statuses:

1. **Unread** (default): New submissions
2. **Read**: Admin has viewed the message
3. **Archived**: Message has been handled and archived

## Database Indexes

The migration creates these indexes for better performance:

- `idx_messages_created_at`: Fast sorting by date
- `idx_messages_status`: Fast filtering by status
- `idx_messages_email`: Fast lookup by email address

## Troubleshooting

### Issue: RLS Policy Error

If you get "Row Level Security" errors:

1. Ensure you're logged in as an admin
2. Check that auth policies are properly configured
3. Verify your user role in Supabase Auth

### Issue: Foreign Key Error

If you get foreign key constraint errors:

1. Ensure the auth.users table exists
2. Update the foreign key constraint if using a different auth setup

### Issue: Emails Not Sending

The current implementation uses `mailto:` links which:
- Require the user to have an email client installed
- Open the user's email client but don't auto-send
- Are not suitable for production

**Solution**: Implement one of the automated email options listed above.

## Next Steps

1. Run the migration SQL in Supabase
2. Test the contact form submission
3. Verify messages appear in the admin panel
4. Set up automated email notifications (recommended)
5. Configure email templates for professional communications

## Support

For issues or questions:
- Check Supabase documentation: https://supabase.com/docs
- Review error logs in Supabase dashboard
- Contact support: support@lynckservices.com
