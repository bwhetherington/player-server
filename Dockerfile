FROM node:14

WORKDIR /usr/src/app

# Install dependencies
# This is a separate step from building the client so that dependencies do not
# need to be reinstalled for all code changes
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

ENV PORT=3030
EXPOSE 3030

CMD ["npm", "start"]