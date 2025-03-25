NODEMOD_VERSION=`nodemon -v`
NODE_VERSION=`node -v`
SCRIPT_VERSION="v0.0.1"

echo "Nodemon: $NODEMON_VERSION"
echo "NodeJS: $NODE_VERSION"
echo "Server: $SCRIPT_VERSION"
echo "Starting..."
sleep 2
clear

cd src
nodemon server.js