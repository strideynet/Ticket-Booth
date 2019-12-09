FROM node:8

WORKDIR /app
COPY yarn.lock package*.json ./
RUN yarn
COPY . .

EXPOSE 8081
CMD ["yarn", "prod"]
