FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY dist/ ./
ENV PORT=8000

EXPOSE 8000

CMD ["node", "index.js"]