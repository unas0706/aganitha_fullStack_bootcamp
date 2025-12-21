### Why `rm -rf` is dangerous
- It deletes **everything recursively** (folders + files).
- Runs **without any warning or confirmation**.
- A small mistake (like typing `/` or `*`) can **wipe the entire system**.
- Deleted data has **no recovery** unless backups exist.

### Why you should avoid unnecessary `sudo`
- `sudo` gives **full system-level power**.
- One wrong command can **break your OS** or corrupt files.
- Increases **security risk**—malicious commands or scripts can cause damage.


# Shell Basics – Commands & Findings

## 1. Created a File With 50 Lines

I created a text file named `sample.txt` with 50 lines of plain text.

### Command:

```bash
nano sample.txt
```

(Then pasted 50 lines of text.)

---

## 2. How Many Lines?

### Command:

```bash
wc -l sample.txt
```

### Output:

```
50
```

### Finding:

* The file contains **50 lines**.

---

## 3. How Many Contain a Specific Word?

We are searching for the whole word **“dog”**, ignoring case.

### Command:

```bash
grep -iwc "dog" sample.txt
```

### What the flags mean:

* `-i` → ignore case
* `-w` → match whole word only
* `-c` → count matching lines

### Output:

(Your output will show a number, example: 0 if no “dog” word exists in your file)

### Finding:

* **The output shows how many lines contain the word “dog”.**

---

## 4. What Are the First 5 Lines?

### Command:

```bash
head -5 sample.txt
```

### Example Output:

```
The sun rose over the quiet hills.
Birds began chirping softly.
A cold breeze passed through the valley.
The village slowly came to life.
People prepared for their daily routines.
```

---

## 5. What Are the Last 5 Lines?

### Command:

```bash
tail -5 sample.txt
```

### Example Output:

```
Street lights began turning on.
People walked home tired but happy.
Stars appeared in the night sky.
The village fell silent once again.
```

