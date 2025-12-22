# VM Setup Notes

## Cloud Provider

AWS EC2 (Free Tier)

## OS

Ubuntu 22.04 LTS

## Public IP

<YOUR_EC2_PUBLIC_IP>

## SSH Access

- Key-based authentication configured
- Root login disabled by default (AWS)
- SSH works via:
  ssh myserver

## User Setup

- Created user: student
- Added to sudo group
- Logged in successfully as student

## SSH Config

~/.ssh/config entry:

Host myserver
HostName 172.18.64.1
User student
IdentityFile ~/.ssh/id_rsa

## Directory Structure

~/work
~/notes
~/bin
