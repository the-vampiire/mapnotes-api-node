FROM node AS builder

WORKDIR /build
COPY package*.json ./
RUN npm install

FROM node
WORKDIR /api
COPY --from=builder /build/node_modules ./node_modules
COPY ./src ./src

EXPOSE 8008
CMD node src
