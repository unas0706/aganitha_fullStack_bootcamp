# Server Process Basics — Mini Server Investigation

**Course Path:** fullstack/tools-course/04-computing-basics
**Exercise Type:** Large Exercise (Real Debugging Simulation)

---

## Objective

Simulate real-world debugging by starting a local server, inspecting its running process, verifying ownership and command details, testing it in a browser, terminating it, and restarting it on a new port.

---

## Environment

* OS: Ubuntu Linux (EC2)
* Shell: Bash
* Tooling: Python 3, lsof, ps, kill

---

## Step 1: Start a Server on Port 5000

Command used:

```bash
python3 -m http.server 5000
```

Expected output:

```text
Serving HTTP on 0.0.0.0 port 5000 (http://0.0.0.0:5000/) ...
```

The server was started successfully and began listening on port **5000**.

---

## Step 2: Find the Process ID (PID)

From another terminal, the following command was used:

```bash
lsof -i :5000
```

Sample output:

```text
COMMAND   PID   USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
python3  2456 ubuntu    3u  IPv4  34567      0t0  TCP *:5000 (LISTEN)
```

* **PID:** 2456

---

## Step 3: Identify the Command That Started the Process

Command:

```bash
ps -p 2456 -o pid,cmd
```

Output:

```text
PID   CMD
2456  python3 -m http.server 5000
```

This confirms that the process was started using Python’s built-in HTTP server.

---

## Step 4: Identify Which User Owns the Process

Command:

```bash
ps -p 2456 -o pid,user
```

Output:

```text
PID   USER
2456  ubuntu
```

* The server process is owned by the **ubuntu** user.

---

## Step 5: Verify the Server in a Browser

The server was accessed using a browser at:

```
http://127.0.0.1:5000
```

Result:

* The directory listing page loaded successfully.
* This confirms the server was running and accessible.

---

## Step 6: Kill the Process

Command used:

```bash
kill 2456
```

Verification that the port is free:

```bash
lsof -i :5000
```

Result:

* No output returned.
* Port **5000** is now free.

---

## Step 7: Restart the Server on Port 7000

Command:

```bash
python3 -m http.server 7000
```

Verification:

```bash
lsof -i :7000
```

Sample output:

```text
COMMAND   PID   USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
python3  2631 ubuntu    3u  IPv4  35612      0t0  TCP *:7000 (LISTEN)
```

The server is now running on port **7000**.

---

## Step 8: Browser Verification on New Port

Accessed via browser:

```
http://127.0.1:7000
```

Result:

* Server responded correctly.
* Directory listing was displayed.

---

## Key Learnings

* How to identify running processes bound to a specific port
* How to inspect PID, command, and user ownership
* How to safely terminate a process
* How to verify port availability
* Practical understanding of server lifecycle management

---

