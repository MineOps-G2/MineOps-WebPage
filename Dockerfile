FROM node:15
WORKDIR /app
COPY package*.json .
RUN npm install 
COPY . ./
EXPOSE 9091
CMD npm run build && npm start
