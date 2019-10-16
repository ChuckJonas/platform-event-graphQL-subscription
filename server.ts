import express from 'express';
import { ApolloServer, gql} from 'apollo-server-express'
import {withFilter} from 'graphql-subscriptions';
import fakeEvents from './fakeEvents'
import {createServer} from 'http';
// import platformEvents from './platformEvents';
//NOTE: Leaving this example here since you could, in theory, expand graphql to do more for SF
//Wanted to highligh that
 

const PORT = process.env.PORT || 4000 
// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
  type Subscription{
      event(divideBy: Int!): Event
      platformEvent: PlatformEvent
  }
  type Event{
      value: String
  }
  type PlatformEvent{
    value: String
  }
`;
 


// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
   Subscription: {
       event: {
            resolve:(payload:any) => {
                return {value: payload}
            },
            subscribe: withFilter(fakeEvents, (payload: number, args: {divideBy: number})=> {
                console.log(payload)
                return payload % args.divideBy === 0
            })
       },
       platformEvent: {
            resolve:(payload:any) => {
                return {value: payload}
            },
            subscribe: withFilter(fakeEvents, (payload: number, args: any)=> {
                return true
            })
       }
   }
};
 
const server = new ApolloServer({ typeDefs, resolvers });
 
const app = express();
server.applyMiddleware({ app });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);
 
httpServer.listen(PORT, () =>{
    //Launch 
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);

  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
});
