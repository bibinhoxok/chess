---
description: Review current changes, commit them with a descriptive message, and push to GitHub
---

// turbo-all

1. Run `git status` to see changed files.
2. Run `git diff` to review specific changes.
3. Analyze the changes. **If the changes cover multiple distinct features or fixes, you MUST split them into separate commits.**
4. For each distinct feature/fix:
   a. Stage the relevant files (e.g., `git add <file1> <file2>`).
   b. Generate a concise, descriptive commit message for that specific change.
   c. Commit changes using `git commit -m "<GENERATED_MESSAGE>"`.
5. Once all changes are committed, push using `git push`.
