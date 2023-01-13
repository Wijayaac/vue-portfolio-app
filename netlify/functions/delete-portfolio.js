import { base } from "../../src/helpers/db";

const deletePortfolio = async (id) => {
  return new Promise((resolve, reject) => {
    base("portfolios").destroy(id, (error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
};

exports.handler = async (event) => {
  let errorStatusCode = 500;

  try {
    const headerJWT = event.headers.authorization;
    if (!headerJWT) {
      errorStatusCode = 401;
      throw new Error("You are not authorized");
    }

    const { id } = event.queryStringParameters;

    const response = await deletePortfolio(id);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Successfully deleted`,
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
