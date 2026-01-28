-- Pages table for published Valentine pages.
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  template_id text not null,
  doc jsonb not null,
  status text not null default 'draft',
  entitlement_session_id text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists pages_slug_idx on public.pages (slug);
create index if not exists pages_entitlement_session_idx on public.pages (entitlement_session_id);

alter table public.pages enable row level security;

-- Public read-only access to published pages.
create policy "public read published pages"
  on public.pages
  for select
  using (status = 'published');

drop policy if exists "public insert published pages" on public.pages;

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  customer_email text,
  session_id text unique not null,
  plan text not null,
  status text not null default 'active',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  expires_at timestamp with time zone
);

create index if not exists entitlements_session_idx on public.entitlements (session_id);

alter table public.entitlements enable row level security;

create table if not exists public.pending_publishes (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique not null,
  template_id text not null,
  plan text not null,
  doc jsonb not null,
  created_at timestamp with time zone default now(),
  paid_at timestamp with time zone
);

create index if not exists pending_publishes_session_idx on public.pending_publishes (stripe_session_id);

alter table public.pending_publishes enable row level security;

create table if not exists public.publish_usage (
  client_id text primary key,
  publish_count int not null default 0,
  updated_at timestamp with time zone not null default now()
);

alter table public.publish_usage enable row level security;

create function public.increment_publish_count_if_under_limit(
  p_client_id text,
  p_limit int
) returns table (publish_count int, allowed boolean) language plpgsql as $$
begin
  insert into public.publish_usage (client_id)
    values (p_client_id)
    on conflict (client_id) do nothing;

  update public.publish_usage
  set publish_count = publish_count + 1,
      updated_at = now()
  where client_id = p_client_id and publish_count < p_limit
  returning publish_count into publish_count;

  if found then
    allowed := true;
    return;
  end if;

  select publish_count into publish_count
  from public.publish_usage
  where client_id = p_client_id;

  allowed := false;
  return;
end;
$$;
