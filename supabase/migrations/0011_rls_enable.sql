-- RLS を各テーブルで有効化（ポリシーは 0012 で設定）
alter table profiles enable row level security;
alter table papers    enable row level security;
alter table submissions enable row level security;
alter table reviews   enable row level security;
alter table threads   enable row level security;
alter table comments  enable row level security;
