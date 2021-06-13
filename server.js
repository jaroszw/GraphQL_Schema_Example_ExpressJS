const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require('graphql');
const app = express();

const authors = [
  { id: 1, name: 'J. K. Rowling', birth: 1965 },
  { id: 2, name: 'J. R. R. Tolkien', birth: 1892 },
  { id: 3, name: 'Brent Weeks', birth: 1977 },
];

const books = [
  { id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
  { id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
  { id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
  { id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
  { id: 5, name: 'The Two Towers', authorId: 2 },
  { id: 6, name: 'The Return of the King', authorId: 2 },
  { id: 7, name: 'The Way of Shadows', authorId: 3 },
  { id: 8, name: 'Beyond the Shadows', authorId: 3 },
];

const quotations = [
  {
    text: "If you want to know what a man's like, take a good look at how he treats his inferiors, not his equals.",
    authorId: 1,
  },
  {
    text: 'It is our choices, Harry, that show what we truly are, far more than our abilities.',
    authorId: 1,
  },
  { text: 'It does not do to dwell on dreams and forget to live', authorId: 1 },
  {
    text: 'If more of us valued food and cheer and song above hoarded gold, it would be a merrier world.',
    authorId: 2,
  },
  {
    text: 'aithless is he that says farewell when the road darkens.',
    authorId: 2,
  },
  {
    text: 'Moments of beauty sustain us through hours of ugliness',
    authorId: 3,
  },
  {
    text: "Delusional people tend to believe in what they're doing",
    authorId: 3,
  },
];

const QuotationType = new GraphQLObjectType({
  name: 'Quote',
  description: 'This is some quotes',
  fields: () => ({
    text: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (quotation) => {
        return authors.find((author) => author.id === quotation.authorId);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'This is an author of books',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    birth: { type: GraphQLNonNull(GraphQLInt) },
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter((book) => book.authorId === author.id);
      },
    },
    quotations: {
      type: new GraphQLList(QuotationType),
      resolve: (author) => {
        return quotations.filter(
          (quotation) => quotation.authorId === author.id
        );
      },
    },
  }),
});

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'This represent a book written by an author',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book) => {
        return authors.find((author) => author.id === book.authorId);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    books: {
      type: new GraphQLList(BookType),
      description: 'List of All Books',
      resolve: () => books,
    },
    book: {
      type: BookType,
      description: 'A single book',
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => books.find((book) => book.id === args.id),
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: 'List of All Authors',
      resolve: () => authors,
    },
    author: {
      type: AuthorType,
      description: 'A single author',
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) =>
        authors.find((author) => author.id === args.id),
    },
    quotes: {
      type: new GraphQLList(QuotationType),
      description: 'Some random quotations',
      resolve: () => quotations,
    },
    quote: {
      type: QuotationType,
      description: 'A single quote',
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) =>
        quotations.find((quotation) => quotation.authorId === args.id),
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(5000, () => console.log('Server running on 5000'));
