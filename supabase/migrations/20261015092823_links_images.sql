-- Kids' links website: a public Storage bucket for link pictures uploaded from the admin panel.
-- Anyone can look at the pictures (by their public URL); only the links admin can add, replace or remove them.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('links-images', 'links-images', true, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'])
on conflict (id) do nothing;

create policy "The links admin sees uploaded pictures"
  on storage.objects for select to authenticated
  using (bucket_id = 'links-images' and (select public.links_is_admin()));

create policy "The links admin uploads pictures"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'links-images' and (select public.links_is_admin()));

create policy "The links admin replaces pictures"
  on storage.objects for update to authenticated
  using (bucket_id = 'links-images' and (select public.links_is_admin()))
  with check (bucket_id = 'links-images' and (select public.links_is_admin()));

create policy "The links admin removes pictures"
  on storage.objects for delete to authenticated
  using (bucket_id = 'links-images' and (select public.links_is_admin()));
