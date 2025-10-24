#!/bin/bash
# install Node.js (Debian/Ubuntu example)
apt-get update
apt-get install -y nodejs npm

# start backend
cd backend
node server.js
