create table if not exists projects (
  id text primary key,
  user_id text not null,
  title text not null,
  canvas_json text not null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists projects_user_updated_idx on projects (user_id, updated_at desc);

create table if not exists subscriptions (
  user_id text primary key,
  plan text not null default 'free',
  status text not null default 'active',
  stripe_customer text,
  stripe_subscription text,
  updated_at timestamptz not null default now()
);

create table if not exists ai_usage (
  user_id text not null,
  day date not null default current_date,
  calls integer not null default 0,
  primary key (user_id, day)
);
