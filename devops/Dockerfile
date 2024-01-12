FROM node:18.16.0-alpine
WORKDIR /app
COPY . /app

EXPOSE 2222
RUN npm install

#CMD ["npm","run", "start"]


#CMD ["node", "/app/main.js"]



CMD APP_REQUEST_URL=https://synkaa-test-api.symple.co.in/synkaa-app/api/users/webhookdev node /app/main.js
