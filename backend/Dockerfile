FROM node:13-alpine

WORKDIR /runtime

COPY package*.json ./

RUN npm ci --only=production

COPY . .

ENV ELASTIC_URL 'http://elasticsearch:9200'

CMD ["npm", "run", "prod"]