# workflow.md

## My Git Workflow (In My Own Words)

### 1. Edit Files

Make changes to your project files.

### 2. Check Git Status

Run:

```
git status
```

### 3. Stage Changes

```
git add <file>
```

or stage all:

```
git add .
```

### 4. Commit Changes

```
git commit -m "meaningful message"
```

### 5. Push to GitHub

```
git push
```

### 6. Pull Latest Updates

```
git pull
```

### 7. Branching

Create branch:

```
git checkout -b feature-name
```

Merge branch:

```
git checkout main
git merge feature-name
```

### 8. Tag a Release

```
git tag v1.0
```

Push tags:

```
git push --tags
```

### 9. Handle Merge Conflicts

Fix lines between conflict markers, then stage and commit.

