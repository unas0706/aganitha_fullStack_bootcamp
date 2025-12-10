# conflicts.md

## Handling Merge Conflicts in Git

1. **Identify a conflict**

   * Git will show conflicts during a merge or rebase.
   * Example:

   ```
   CONFLICT (content): Merge conflict in <filename>
   ```

2. **Open the conflicting file**

   * Conflicts are marked with:

   ```
   <<<<<<< HEAD
   your code
   =======
   incoming branch code
   >>>>>>> branch-name
   ```

3. **Resolve the conflict**

   * Decide what code to keep.
   * Remove conflict markers.

4. **Stage and commit**

   ```
   git add <file>
   git commit
   ```

5. **Continue your workflow**

   * After resolving conflicts, continue with your normal Git workflow.

