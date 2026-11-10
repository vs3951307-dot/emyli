CREATE TABLE public.assistant_messages (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, message_id text NOT NULL, role text NOT NULL CHECK (role IN ('user','assistant')), parts jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(user_id,message_id));
GRANT SELECT,INSERT,DELETE ON public.assistant_messages TO authenticated;
GRANT ALL ON public.assistant_messages TO service_role;
ALTER TABLE public.assistant_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own conversation" ON public.assistant_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Write own conversation" ON public.assistant_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Clear own conversation" ON public.assistant_messages FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX assistant_messages_user_created ON public.assistant_messages(user_id,created_at);