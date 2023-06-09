FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
CMD [ "node", "dist/main.js" ]
