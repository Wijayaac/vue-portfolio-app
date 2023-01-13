import { base } from "../../src/helpers/db";

const updatePortfolio = async (id, body) => {
  return new Promise((resolve, reject) => {
    base("portfolios").update(id, body, (error) => {
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

    const { title, description } = JSON.parse(event.body);
    const { id } = event.queryStringParameters;

    const data = {
      title,
      description,
    };

    const response = await updatePortfolio(id, data);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Successfully updated`,
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
