FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY dist/ ./

EXPOSE 8000

CMD ["node", "index.js"]