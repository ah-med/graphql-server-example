const { ApolloServer, gql } = require("apollo-server");
const { find, filter } = require("lodash");

// There are 5 categories of GraphQL Schema
// * Scalar types - normal primitive data types of a language e.g Int, Float, String, Boolean, ID <serialized as Sting>
// * Object types - collection of fields that can either be scalar or object
// * The Query type - defines what GraphQL queries, holds the return types for your query definitions
// * The Mutation type - similar to Query type, the difference the Query type is for read operation while the Mutation type is for Write operations
// * Input types - is a type for defining set of input values instead of for instance having multiple arguments passed
    // into a mutation, you can have all the argument defined as an input type and this input type gets passed as argument to the Mutation
    // for example defining an input type for addBook(...) mutation will look like
        // input AddBookInput {
        //     title: String
        //     author: String
        //     publishDate: String
        // }

// Note : Do not use the same input type for both queries and mutations. In many cases, arguments that are required for a mutation are optional for a corresponding query.
// see more here https://github.com/LF-Engineering/lf-backend/wiki/schema-basics#our-final-schema about schema

// Your schema definition
const typeDefs = gql`
  type Book {
    title: String
    publishDate: String
    author: String
  }
  type Author {
    name: String
    books: [Book]
  }
  type Query {
    getBooks: [Book]
    getAuthors: [Author]
    getAuthor(name: String): Author
  }
  type Mutation {
      addBook(
          title: String,
          author: String,
          publishDate: String
      ): Book
  }
`;

// Your set of resolvers
const resolvers = {
  Query: {
    getBooks(parent, args, context, info) {
      return books; // books is just an array of books but not shown here for clarity
    },
    getAuthors(parent, args, context, info) {
        console.log('THIS IS parent', parent);
      return authors; // authors is just an array of authors but not shown here for clarity
    },
    getAuthor(parent, args, context, info) {
      return find(authors, { name: args.name });
    }
  },
  Author: {
    books(author) {
      return filter(books, { author: author.name });
    }
  }
};

const books = [
  {
    title: "Harry Potter and the Chamber of Secrets",
    publishDate: "11/11/2010",
    author: "J.K. Rowling"
  },
  {
    title: "Jurassic Park",
    publishDate: "14/01/2014",
    author: "Michael Crichton"
  }
];

const authors = [
  {
    name: "J.K. Rowling"
  },
  {
    name: "Michael Crichton"
  }
];

//  The ApolloServer constructor requires two parameters: your schema definition and your set of resolvers
const server = new ApolloServer({ typeDefs, resolvers})

// The `listen` method launches a web server
server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
});

