# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.140.1/containers/javascript-node/.devcontainer/base.Dockerfile

# [Choice] Node.js version: 18-buster, 14, 12, 10
ARG VARIANT="18-buster"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

# [Optional] Uncomment this section to install additional OS packages.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends default-jdk chromium

ENV CHROME_BIN="/usr/bin/chromium"

# Configure npm to skip strict SSL certificate validation
RUN npm config set strict-ssl false

# Update npm to the latest version
RUN npm install -g npm@9.5.1


# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node modules
# RUN sudo -u node npm install -g <your-package-list-here>
