-- Create contact_messages table
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  subject text,
  message text not null,
  status text not null default 'unread' check (status in ('unread', 'read', 'archived')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create index for queries
create index if not exists idx_contact_messages_status on public.contact_messages(status);
create index if not exists idx_contact_messages_created_at on public.contact_messages(created_at);

-- Enable RLS
alter table public.contact_messages enable row level security;

-- RLS Policies
-- Allow anyone (unauthenticated) to insert contact messages
create policy "contact_messages_insert_public"
  on public.contact_messages for insert
  with check (true);

-- Allow only authenticated admin to select, update, and delete
create policy "contact_messages_select_authenticated"
  on public.contact_messages for select
  using (auth.role() = 'authenticated');

create policy "contact_messages_update_authenticated"
  on public.contact_messages for update
  using (auth.role() = 'authenticated');

create policy "contact_messages_delete_authenticated"
  on public.contact_messages for delete
  using (auth.role() = 'authenticated');

-- Updated_at trigger
drop trigger if exists contact_messages_updated_at on public.contact_messages;
create trigger contact_messages_updated_at
  before update on public.contact_messages
  for each row execute function public.handle_updated_at();
