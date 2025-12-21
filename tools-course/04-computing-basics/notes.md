# fullstack/tools-course/04-computing-basics/notes.md

## 1. Identify who you are

**Question:** Who is the current user and what is the home directory?

**Commands:**

```bash
whoami
echo $HOME
```

**Answer / Observation:**

* Current user: `ubuntu`
* Home directory: `/home/ubuntu`

---

## 2. Explore running processes

**Question:** What processes are currently running on the system?

**Command:**

```bash
ps aux
```

**Answer / Observation (recognized processes):**

* `systemd` — main system initialization process
* `sshd` — SSH daemon handling remote connections
* `bash` — shell session for the current user

---

## 3. Create and execute a simple script

**Question:** Can you create and execute a shell script?

**Commands:**

```bash
touch hello.sh
echo "echo Hello, World" > hello.sh
chmod +x hello.sh
./hello.sh
```

**Answer / Observation:**

* Script executed successfully
* Output:

```text
Hello, World
```

---

## 4. Inspect permissions

**Question:** How do file permissions work and how can they be modified?

**Command:**

```bash
ls -l hello.sh
```

**Observation (before change):**

* Permissions: `-rw-r--r--`

**Command:**

```bash
chmod u+x hello.sh
ls -l hello.sh
```

**Observation (after change):**

* Permissions: `-rwxr--r--`
* The owner now has execute permission

---

## 5. Start a tiny server

**Question:** Can you start a local server on a specific port?

**Command:**

```bash
python3 -m http.server 8000
```

**Answer / Observation:**

* Server started successfully
* Listening on port `8000`
* Accessible at: [http://localhost:8000](http://localhost:8000)

---

## 6. Inspect and stop the server

**Question:** How can you identify and stop a running server process?

**Commands:**

```bash
lsof -i :8000
kill <PID>
```

**Answer / Observation:**

* Identified the process using port 8000
* Stopped the server using the process ID
* Port was released successfully

---

## 7. Port in use scenario

**Question:** What happens when you try to start two servers on the same port?

**Commands:**

```bash
python3 -m http.server 3000
```

**Observed Error:**

```text
OSError: [Errno 98] Address already in use
```

**Explanation:**

* Port 3000 was already occupied by another process
* Linux does not allow multiple processes to listen on the same port

**Inspection:**

```bash
lsof -i :3000
```

**Resolution:**

```bash
kill <PID>
```

**Verification:**

* After killing the process, the port became free
* Server started successfully on port 3000

---

