FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

CMD sh -c "npx prisma generate && npx prisma db push && node /app/dist/main.js "
