const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
require('dotenv').config();

const db = require('./db');
const models = require('./models');

/* // Запускаем сервер на порте, указанном в файле .env, или на порте 4000
const port = process.env.PORT ?? 4000;
// Сохраняем значение DB_HOST в виде переменной
const DB_HOST = process.env.DB_HOST; */

const { port = 4000, DB_HOST } = process.env;

// Строим схему, используя язык схем GraphQL
const typeDefs = gql`
  type Note {
    id: ID!
    content: String!
    author: String!
  }
  type Query {
    hello: String
    notes: [Note!]!
    note(id: ID!): Note
  }
  type Mutation {
    newNote(content: String!): Note!
  }
`;

// Предоставляем функцию распознавания для полей схемы
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    notes: async () => await models.Note.find(),
    note: async (_, args) => await models.Note.findById(args.id),
  },
  Mutation: {
    newNote: async (_, args) =>
      await models.Note.create({
        content: args.content,
        author: 'Adam Scott',
      }),
  },
};

const app = express();
// Подключаем БД
db.connect(DB_HOST);

// Настраиваем Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

// Применяем промежуточное ПО Apollo GraphQL и указываем путь к /api
server.applyMiddleware({ app, path: '/js-notedly-api' });

app.listen({ port }, () =>
  console.log(
    `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`,
  ),
);
