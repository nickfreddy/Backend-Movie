FROM node:14-alpine
WORKDIR /demovie
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "run", "start"]