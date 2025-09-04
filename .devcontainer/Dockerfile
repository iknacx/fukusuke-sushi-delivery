# Bun Dev Container
FROM mcr.microsoft.com/vscode/devcontainers/base:ubuntu

# Install curl if not present
RUN apt-get update && apt-get install -y curl

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

# Add Bun to PATH
ENV PATH="/root/.bun/bin:$PATH"

# Verify Bun installation
RUN bun --version

WORKDIR /workspaces/fukusuke-sushi-delivery
