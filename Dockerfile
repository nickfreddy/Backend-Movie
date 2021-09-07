FROM node:alpine-14
WORKDIR /demovie
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "run", "start"]