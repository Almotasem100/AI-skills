# Prompt to continue this work in a new session (any agent: Codex, Claude, Gemini…)

Paste everything below the line into the agent, started from the `AI-skills` folder.

---

We're continuing my AI-skills work from a previous session (with Claude, 2026-09-25). You are picking it up
on a different machine and possibly a different agent, so everything you need is in files, not in chat
history.

**Before doing anything:**
1. Read `AGENTS.md`, `docs/roadmap.md`, `README.md`, `GUIDE.md`, `docs/decisions.md` and `manifest.md` in
   full. `docs/roadmap.md` is the living to-do list; its section "Recommendations for the next sessions"
   explains the reasoning behind the order.
2. Read the "▶ START HERE" block at the top of
   `C:\Users\Mohamed\Downloads\HDC\HDC\documents\automation\Automation_Planning_Handoff.md` (current state and
   "Next"). The dated log of what was built and tested is in `Automation_Planning_History.md` next to it; read
   its latest entries (2026-09-26) only as needed.
3. Check the environment and tell me what you find, without changing anything: `git --version`,
   `node --version`, whether this folder is a git repo, and which skills folders exist
   (`~/.claude/skills`, `~/.agents/skills`, `~/.codex/skills`) and what is in them.
4. Then tell me briefly, in your own words: what this setup is for, the rules you'll follow, what's built and
   how it was tested, what is **not** yet tested, and the first "Next" item on the roadmap with the
   recommendation for it. **Don't change anything until I confirm your summary.**

**Rules that matter most** (they are in `AGENTS.md`; repeated here because breaking them has cost me before):
- Ask me before anything persistent or outward-facing: installing into user-level folders, changing agent
  config, git hooks, pushing, posting, creating files in a project repository. One clear question, then act.
- Never create a file in `cb379_hdc_pdc` or `cb379_dc_frontend` without my approval of the exact file list.
- Never edit `vendor/` silently: mark `LOCAL CHANGE`, record it in that repo's `UPSTREAM.md` and its
  `local-changes.patch`.
- **Every run handed to another CLI names the model and effort** (Codex: `gpt-6-luna` simple, `gpt-6-sol`
  hard). Never rely on a CLI's default model. See `GUIDE.md` §4.
- **Never touch anything inside the HDC repos** (`cb379_hdc_pdc`, `cb379_dc_frontend`): read-only. Repo-side
  steps are my own to-dos (HDC cleanup rule R1).
- Test for real and say exactly what was tested and how. Don't invent facts about my projects or tools; if
  something depends on my setup, ask.
- Push back when an idea is weak, and recommend the better option with its main tradeoff. Keep answers short.
- At the end of the session, update `docs/roadmap.md` and add a dated entry under "Setup progress" in
  `Automation_Planning_Handoff.md`.

**After I confirm:** start with the first step in the roadmap recommendations: confirm remote privacy, review and commit the migration, then run GUIDE.md §3 on this machine, asking me before installing. Continue with the first Next item.