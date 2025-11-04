-- Create profiles table for user information
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Create team_members table
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  description text not null,
  phone text not null,
  salary decimal(10,2) not null,
  target_videos integer not null,
  progress_checks boolean[] not null,
  advertisement_type text not null,
  platform text not null,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on team_members
alter table public.team_members enable row level security;

-- Team members policies - users can manage their own team members
create policy "Users can view their own team members"
  on public.team_members for select
  using (auth.uid() = user_id);

create policy "Users can insert their own team members"
  on public.team_members for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own team members"
  on public.team_members for update
  using (auth.uid() = user_id);

create policy "Users can delete their own team members"
  on public.team_members for delete
  using (auth.uid() = user_id);

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Add updated_at triggers
create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_team_members_updated_at
  before update on public.team_members
  for each row execute procedure public.handle_updated_at();