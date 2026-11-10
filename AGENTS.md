<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Brand/contact config lives in src/config/site.ts and content in src/content/*; empty fields must stay hidden, never filled with fake data (owner confirms real info).
- The assistant uses one user-scoped persisted conversation, AI Elements rendering and a server-verified streaming Gateway route; this keeps account history private and model credentials server-only.
- Keep the owner-photo cover full-bleed with CSS overlays and breakpoint-specific framing; this preserves legibility without placing the primary image inside a decorative card.
- Results videos use CDN pointers and lazy posters; mount video sources only after a play click and pause offscreen/other players to avoid unnecessary downloads and simultaneous audio.
