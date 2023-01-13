import { base } from "../../src/helpers/db";
import { getUserId } from "../../src/helpers/jwt";

const savePortfolio = async (body) => {
  return new Promise((resolve, reject) => {
    base("portfolios").create(body, (error) => {
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
    const userId = getUserId(headerJWT);
    const portfolioData = {
      title,
      description,
      user_id: userId,
    };
    await savePortfolio(portfolioData);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Successfully added : ${title}`,
      }),
    };
  } catch (error) {
    return {
      statusCode: errorStatusCode,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
