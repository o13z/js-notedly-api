const { gql } = require('apollo-server-express');
// Строим схему, используя язык схем GraphQL
module.exports = gql`
  type Note {
    id: ID!
    content: String!
    author: String!
  }
  type Query {
    notes: [Note!]!
    note(id: ID!): Note!
  }
  type Mutation {
    newNote(content: String!): Note!
  }
`;
