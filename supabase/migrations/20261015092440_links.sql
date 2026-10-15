-- Kids' links website: pages, sections and links.
-- Lives in the "Bancos Family Database" Supabase project, next to unrelated tables, hence the links_ prefix.
-- Accounts are the same Supabase Auth accounts the platformer game uses.
--
-- A page belongs to one account (Luke's page) or to nobody (the home page everyone sees).
-- A section is a row of links, and can be on several pages: most are on everybody's.
--
-- Who can do what (enforced by Row Level Security):
--   anyone, even signed out -> the list of pages; the sections and links on pages with no owner
--   signed in               -> also the sections and links on your own page
--   the admin               -> everything, and the only one who can change anything
-- The admin is whoever owns a page with is_admin set (Claudiu).

create table public.links_page (
  slug text primary key check (slug ~ '^[a-z0-9-]+$'), -- the address: /luke. "home" is the page at /
  name text not null,  -- short, for the admin's list of pages: "Luke"
  title text not null, -- the heading: "Luke's Links"
  owner_id uuid unique references auth.users (id) on delete set null, -- null: everyone's page
  is_admin boolean not null default false,
  sort integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.links_section (
  id uuid primary key default gen_random_uuid(),
  title text, -- null: no heading, always open. With a heading it can be collapsed
  collapsed boolean not null default false, -- starts closed (until someone opens it on their computer)
  created_at timestamptz not null default now()
);

-- Which sections are on which page, in what order.
create table public.links_page_section (
  page_slug text not null references public.links_page (slug) on update cascade on delete cascade,
  section_id uuid not null references public.links_section (id) on delete cascade,
  sort integer not null, -- left out on insert: goes at the end
  primary key (page_slug, section_id)
);

create index links_page_section_section_id_idx on public.links_page_section (section_id);

create table public.links_link (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.links_section (id) on delete cascade,
  title text not null,
  url text not null,
  image text not null default '', -- a path under the site's images/ folder, or a full URL (Storage uploads)
  style text check (style in ('br-5', 'br-10', 'br-20')), -- rounded corners on the picture
  sort integer not null, -- left out on insert: goes at the end
  created_at timestamptz not null default now()
);

create index links_link_section_id_idx on public.links_link (section_id);

-- New rows without a sort go at the end of their page or section.
create function public.links_sort_last() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.sort is null then
    if tg_table_name = 'links_link' then
      select coalesce(max(sort) + 1, 0) into new.sort from public.links_link where section_id = new.section_id;
    else
      select coalesce(max(sort) + 1, 0) into new.sort from public.links_page_section where page_slug = new.page_slug;
    end if;
  end if;
  return new;
end;
$$;

create trigger links_link_sort_last before insert on public.links_link
  for each row execute function public.links_sort_last();
create trigger links_page_section_sort_last before insert on public.links_page_section
  for each row execute function public.links_sort_last();

-- Whether the signed-in account is the admin. links_page is readable by everyone, so this needs no special rights.
create function public.links_is_admin() returns boolean
language sql
stable
set search_path = ''
as $$
  select exists (select 1 from public.links_page where owner_id = (select auth.uid()) and is_admin);
$$;

-- Row Level Security --------------------------------------------------------

alter table public.links_page enable row level security;
alter table public.links_section enable row level security;
alter table public.links_page_section enable row level security;
alter table public.links_link enable row level security;

revoke all on public.links_page, public.links_section, public.links_page_section, public.links_link from anon, authenticated;
grant select on public.links_page, public.links_section, public.links_page_section, public.links_link to anon, authenticated;
grant insert, update, delete on public.links_page, public.links_section, public.links_page_section, public.links_link to authenticated;

create policy "Anyone can see the list of pages"
  on public.links_page for select to anon, authenticated
  using (true);

create policy "Page sections on everyone's page or your own"
  on public.links_page_section for select to anon, authenticated
  using (
    exists (
      select 1 from public.links_page p
      where p.slug = links_page_section.page_slug and (p.owner_id is null or p.owner_id = (select auth.uid()))
    )
    or (select public.links_is_admin())
  );

create policy "Sections on a page you can see"
  on public.links_section for select to anon, authenticated
  using (
    exists (select 1 from public.links_page_section ps where ps.section_id = links_section.id) -- filtered by its own policy
    or (select public.links_is_admin())
  );

create policy "Links in a section you can see"
  on public.links_link for select to anon, authenticated
  using (
    exists (select 1 from public.links_page_section ps where ps.section_id = links_link.section_id)
    or (select public.links_is_admin())
  );

create policy "The admin changes pages"
  on public.links_page for all to authenticated
  using ((select public.links_is_admin())) with check ((select public.links_is_admin()));

create policy "The admin changes page sections"
  on public.links_page_section for all to authenticated
  using ((select public.links_is_admin())) with check ((select public.links_is_admin()));

create policy "The admin changes sections"
  on public.links_section for all to authenticated
  using ((select public.links_is_admin())) with check ((select public.links_is_admin()));

create policy "The admin changes links"
  on public.links_link for all to authenticated
  using ((select public.links_is_admin())) with check ((select public.links_is_admin()));
