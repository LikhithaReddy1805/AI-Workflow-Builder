const { testGraphQLConnection } = require("./graphql");

async function main() {
  try {
    const data = await testGraphQLConnection();

    console.log("GraphQL connection successful!");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("GraphQL connection failed.");

    if (error.response) {
      console.error(error.response);
    } else {
      console.error(error.message);
    }
  }
}

main();