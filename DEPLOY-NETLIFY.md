# Publicar o site da Emyli na Netlify

Este projeto está em `emyli-site/` dentro do repositório. **Não publique o ZIP original:** ele contém `.env`.

1. Na Netlify, crie um projeto conectado ao repositório Git e defina o **Base directory** como `emyli-site`. O arquivo `netlify.toml` define o build e a pasta de publicação; a aplicação precisa do servidor SSR da Netlify, não de hospedagem estática por arrastar arquivos.
2. Configure as variáveis de ambiente no painel da Netlify, com os valores do **seu** projeto Supabase: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (os pares URL e chave têm os mesmos valores). Nunca copie `.env` para Git. O assistente de IA depende ainda do serviço/créditos do Lovable e pode exigir configuração adicional fora do Lovable.
3. No Supabase associado a essas variáveis, execute `supabase/migrations/20261107000000_site_admin.sql` no SQL Editor. Crie/confirme uma conta da proprietária (pode usar cadastro/login por email no site) e depois execute, **substituindo o email**:

   ```sql
   insert into public.site_admins (user_id)
   select id from auth.users where email = 'EMAIL_DA_PROPRIETARIA';
   ```

   A conta precisa existir antes. Somente usuários dessa tabela têm permissão de escrita; visitantes nunca podem enviar ou excluir fotos. O painel fica em `/admin`.
4. No Supabase Auth, configure a **Site URL** como `https://emyligiseliestetica.site` e inclua os endereços de redirecionamento da Netlify e `https://emyligiseliestetica.site/**` (e `https://www.emyligiseliestetica.site/**` se usar `www`).
5. Primeiro teste o endereço `*.netlify.app`. Só depois adicione `emyligiseliestetica.site` na Netlify em **Domain management**. No painel DNS atual, siga os valores que a Netlify mostrar. Para DNS externo padrão, o registro `A` do `@` deve substituir `2.57.91.91` por `75.2.60.5`; o CNAME `www` deve apontar para o subdomínio `*.netlify.app` específico do projeto. Se houver registros de email (MX/TXT), preserve-os. Espere HTTPS e propagação.

O painel permite escolher temas, trocar/remover foto de capa ou retrato, enviar fotos autorizadas e ocultar/restaurar fotos originais. As imagens novas ficam no bucket `site-photos` do Supabase (até 5 MB, JPG/PNG/WebP); excluir uma foto enviada remove também seu arquivo. Fotos originais vêm do código: **Excluir do site** as oculta, sem apagar o arquivo original do projeto.
