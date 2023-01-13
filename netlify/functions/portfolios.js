import { base } from "../../src/helpers/db";
import { getUserId } from "../../src/helpers/jwt";

const getPortfolios = async (userId, pageParams = 1) => {
  let records = [];
  const limit = 3;

  const proccessPage = (partialsRecords, fetchNextPage) => {
    records = [...records, ...partialsRecords];
    fetchNextPage();
  };

  return new Promise((resolve, reject) => {
    base("portfolios")
      .select({
        pageSize: limit,
        sort: [{ field: "title", direction: "asc" }],
        filterByFormula: "({user_id}='" + userId + "')",
      })
      .eachPage(proccessPage, (error) => {
        if (error) {
          return reject(error);
        }

        const count = records.length;
        const page = parseInt(pageParams || 1);
        const pages = Math.ceil(count / limit);
        const offset = page * limit - limit;

        let portfolios = records
          .map((record) => {
            return {
              id: record.getId(),
              title: record.get("title"),
              description: record.get("description"),
            };
          })
          .slice(offset, limit * page);

        return resolve({ portfolios, meta: { page, pages, count } });
      });
  });
};

exports.handler = async (event) => {
  let errorStatusCode = 500;
  try {
    const headerJWT =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJyZWM5TmRIRWMwUzdyZXNCOSIsInVzZXJuYW1lIjoiZHVhMiIsImlhdCI6MTY3MzMzMjc4OSwiZXhwIjoxNjc0MTk2Nzg5fQ.eOz9WBawNrlAsoBor8qohCRNOoHhzz3QE60cVZy4ktA";

    if (!headerJWT) {
      errorStatusCode = 401;
      throw new Error("You are not authorized");
    }
    const { page } = event.queryStringParameters;
    const userId = getUserId(headerJWT);

    const response = await getPortfolios(userId, page);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Portfolios loaded",
        data: response,
      }),
    };
  } catch (error) {
    return {
      statusCode: errorStatusCode,
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
};
