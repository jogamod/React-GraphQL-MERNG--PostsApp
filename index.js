const { ApolloServer, PubSub } = require('apollo-server-express');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { MONGODB } = require('./config.js');
const express = require('express')
const cors = require('cors')
const path = require('path')

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub })
});

const app = express();
server.applyMiddleware({ app });

app.use(express.static('public'))

app.get('*', (req,res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

const PORT = process.env.PORT || 5000

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB Connected');
    return app.listen({ port: PORT }, () =>
      console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`)
    );
  })
