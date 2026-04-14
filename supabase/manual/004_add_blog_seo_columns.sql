alter table public.blog_posts
add column if not exists meta_title text,
add column if not exists meta_description text,
add column if not exists keywords text[],
add column if not exists geo_location text,
add column if not exists author text;

update public.blog_posts
set author = coalesce(nullif(trim(author), ''), 'EVGuide AI Editorial')
where author is null or trim(author) = '';

update public.blog_posts
set geo_location = coalesce(nullif(trim(geo_location), ''), 'UK')
where geo_location is null or trim(geo_location) = '';

create index if not exists idx_blog_posts_slug on public.blog_posts (slug);
create index if not exists idx_blog_posts_published_at on public.blog_posts (published_at desc);
create index if not exists idx_blog_posts_geo_location on public.blog_posts (geo_location);
create index if not exists idx_blog_posts_keywords on public.blog_posts using gin (keywords);
