-- Pages table for published Valentine pages.
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  template_id text not null,
  doc jsonb not null,
  status text not null default 'draft',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists pages_slug_idx on public.pages (slug);

alter table public.pages enable row level security;

-- Public read-only access to published pages.
create policy "public read published pages"
  on public.pages
  for select
  using (status = 'published');

-- Allow anonymous inserts for published pages only.
create policy "public insert published pages"
  on public.pages
  for insert
  with check (status = 'published');
