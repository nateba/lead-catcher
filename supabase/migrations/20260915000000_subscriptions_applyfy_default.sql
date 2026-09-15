-- Payment gateway is Applyfy, not Kirvano as originally planned.
alter table public.subscriptions
  alter column provider set default 'applyfy';
