const express = require('express');
const { ApolloServer } = require('apollo-server-express');
require('dotenv').config();

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

// Импортируем локальные модули
const db = require('./db');
const models = require('./models');

// Запускаем сервер на порте, указанном в файле .env, или на порте 4000
const { port = 4000, DB_HOST } = process.env;

const app = express();

// Подключаем БД
db.connect(DB_HOST);

// Настройка Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    // Добавление моделей БД в context
    return { models };
  },
});

// Применяем промежуточное ПО Apollo GraphQL и указываем путь к /api
server.applyMiddleware({ app, path: '/js-notedly-api' });

app.listen({ port }, () =>
  console.log(
    `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`,
  ),
);
