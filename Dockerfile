# Use an official Node runtime as a parent image
FROM node:20.9.0

# Set the working directory in the container
WORKDIR /capstone-kyndryl
RUN ls
# Copy everything to the working directory
COPY . .
RUN ls
# Install pnpm globally
RUN npm install -g pnpm


# Install dependencies for the document_loader directory
WORKDIR /capstone-kyndryl/document_loader
RUN ls
RUN pnpm install
# Check the contents of node_modules
#RUN ls node_modules

# Install dependencies for the main directory
WORKDIR /capstone-kyndryl/main
RUN ls
RUN pnpm install
# Check the contents of node_modules
RUN ls app
RUN ls -la node_modules
RUN ls node_modules/next
RUN ls node_modules/langchain


# Set the working directory back to main for CMD
WORKDIR /capstone-kyndryl/main
RUN ls
# Port the container will listen on
EXPOSE 3000

# Command to run the application
CMD ["pnpm", "run", "dev"]

# FROM node:20.9.0-alpine
# WORKDIR /capstone-kyndryl
# COPY . .
# WORKDIR /capstone-kyndryl/main
# RUN npm install -g pnpm && pnpm install
# #COPY .env.local ./
# EXPOSE 3000
# CMD ["pnpm", "run", "dev"]

# FROM node:20.9.0-alpine
# WORKDIR /capstone-kyndryl
# COPY package.json pnpm-lock.yaml ./
# RUN npm install -g pnpm && pnpm install
# COPY . .
# WORKDIR /capstone-kyndryl/main
# COPY .env.local ./main/
# EXPOSE 3000
# CMD ["pnpm", "run", "dev"]

# # Use an official Node runtime as a parent image
# FROM node:20.9.0

# # Set the working directory in the container
# WORKDIR /capstone-kyndryl
# RUN ls

# # Install pnpm globally
# RUN npm install -g pnpm

# # Install dependencies for the main directory
# WORKDIR /capstone-kyndryl/main
# RUN ls
# COPY package*.json ./
# RUN pnpm install
# # Check the contents of node_modules
# RUN ls node_modules

# # Install dependencies for the document_loader directory
# WORKDIR /capstone-kyndryl/document_loader
# COPY package*.json ./
# RUN pnpm install
# # Check the contents of node_modules
# RUN ls node_modules

# # Set the working directory in the container
# WORKDIR /capstone-kyndryl

# # Copy everything to the working directory
# COPY . .

# # Set the working directory back to main for CMD
# WORKDIR /capstone-kyndryl/main

# # Port the container will listen on
# EXPOSE 3000

# # Command to run the application
# CMD ["pnpm", "run", "dev"]
