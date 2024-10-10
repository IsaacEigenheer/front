FROM node:18-alpine

WORKDIR /app/front

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 2000

CMD ["npm", "run", "start"]
