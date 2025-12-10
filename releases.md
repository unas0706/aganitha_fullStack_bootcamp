# releases.md

## Creating and Documenting Git Releases

1. **Create a tag for the release**

   ```sh
   git tag v0.1.0
   ```

2. **Push the tag to GitHub**

   ```sh
   git push origin v0.1.0
   ```

3. **View tags locally**

   ```sh
   git tag
   ```

4. **View tags on remote**

   ```sh
   git ls-remote --tags origin
   ```

5. **Document the release**

   * Add release notes in `releases.md` or GitHub releases page.
   * Include features, fixes, and important changes.

6. **Optional: Create annotated tag**

   ```sh
   git tag -a v0.1.0 -m "Release version 0.1.0: initial module setup"
   git push origin v0.1.0
   ```

   * Annotated tags include metadata like author, date, and message.

