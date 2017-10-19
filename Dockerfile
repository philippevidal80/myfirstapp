FROM node:boron

# Create app directory
WORKDIR /usr/src/MyFirstApp

# Install app dependencies
COPY package.json .
# For npm@5 or later, copy package-lock.json as well
# COPY package.json package-lock.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 8001
CMD [ "npm", "start"]
