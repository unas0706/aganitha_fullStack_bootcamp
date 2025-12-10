# notes.md

## Notes — Git & GitHub Setup

### GitHub Setup

* Created account
* Professional username
* Added profile details

### SSH Key Setup

* Generated SSH key using `ssh-keygen`
* Added public key to GitHub
* Verified connection with `ssh -T git@github.com`

### Git Config

* Set username and email
* Set default branch to main

### Repository Initialization

* Ensured correct folder structure
* Added notes.md, workflow.md, experiment-01.txt



## 8. Binary File Awareness

I should avoid committing large binary files into Git such as:

- large media files (videos, high-resolution images)
- data dumps (.sql, .csv exports)
- zip/tar archives
- compiled binaries (.exe, .class, .o, build folders)

### Why I should not commit these files:
1. **Git is optimized for text files**  
   Git stores changes line-by-line. Binary files do not support line-based diffs, so Git cannot efficiently track them.

2. **Binary files increase repository size**  
   Large files make the repo slow to clone, fetch, or work with — especially for teams or CI/CD.

3. **No incremental storage**  
   Each version of a binary file is stored as a full copy, wasting storage and bandwidth.

4. **Not needed for development**  
   - Compiled files can be recreated.
   - Archives and media should be hosted elsewhere (S3, Drive, etc.).
   - Data dumps should not be stored in Git for security reasons.

### Good practice
Only commit source code and small text-based configuration files.  
For binary files, use:
- `.gitignore`
- External storage
- Git LFS (if required for large assets)

