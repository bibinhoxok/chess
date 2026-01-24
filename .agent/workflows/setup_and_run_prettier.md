---
description: Configure Prettier with tabs and no semicolons, then format the project
---

1. Create a .prettierrc file in the root directory with the following content:
   ```json
   {
     "useTabs": true,
     "tabWidth": 4,
     "semi": false
   }
   ```
2. Run Prettier to format all files
// turbo
3. npx prettier --write .
