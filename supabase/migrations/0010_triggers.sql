-- updated_at を自動更新する function と trigger を追加

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- profiles
create trigger profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- papers
create trigger papers_updated_at
  before update on papers
  for each row execute function set_updated_at();

-- comments
create trigger comments_updated_at
  before update on comments
  for each row execute function set_updated_at();
