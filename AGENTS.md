<!-- BEGIN:nextjs-agent-rules -->

## 12 Golden Rules
1. **NEVER break existing working functionality.** Always test after changes.
2. **No business logic in `app/` folder.** It's routing ONLY.
3. **No business logic in `frontend/`.** Frontend = UI only.
4. **Controller NEVER touches database.** Always go through service → repository.
5. **Validate ALL input with Zod.** Never trust client data.
6. **No `any` type in TypeScript.** Type everything properly.
7. **No `setState` in Flutter.** Use BLoC for state management.
8. **No `useEffect` for data fetching.** Use TanStack Query (`@tanstack/react-query`).
9. **Every component has a single responsibility.** Split if it does more.
10. **Security first, features second.** Never skip validation or auth checks.
11. **Pagination is ALWAYS Server-Side.** Never fetch all records. Always use limit/offset/page in backend.
12. **Strict SEO Compliance.** All public Next.js pages MUST have dynamic metadata, JSON-LD schema markup, and semantic HTML tags.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
