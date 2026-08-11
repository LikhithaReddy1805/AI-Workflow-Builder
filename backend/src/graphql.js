require("dotenv").config();

const { GraphQLClient } = require("graphql-request");

const client = new GraphQLClient(
  process.env.NHOST_GRAPHQL_URL
);

async function testGraphQLConnection() {
  const query = `
    query {
      workflows {
        id
        name
        org_id
      }
    }
  `;

  const data = await client.request(query);

  return data;
}

module.exports = {
  client,
  testGraphQLConnection
};