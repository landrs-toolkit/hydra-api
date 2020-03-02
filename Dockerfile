FROM node:13

ENV DEBIAN_FRONTEND=noninteractive

# The node image comes with a base non-root 'node' user which this Dockerfile
# gives sudo access. However, for Linux, this user's GID/UID must match your local
# user UID/GID to avoid permission issues with bind mounts. Update USER_UID / USER_GID
# if yours is not 1000. See https://aka.ms/vscode-remote/containers/non-root-user.
ARG USER_UID=1000
ARG USER_GID=$USER_UID

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

ENV DEBUG hydra-box:*
CMD ["npm", "run", "start"]

EXPOSE 9000