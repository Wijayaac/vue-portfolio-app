import bcrypt from "bcrypt";

import { createJwt } from "../../src/helpers/jwt";
import { base } from "../../src/helpers/db";

const getUser = async (username) => {
  return new Promise((resolve, reject) => {
    base("users")
      .select({
        filterByFormula: "({username}='" + username + "')",
      })
      .firstPage((error, records) => {
        if (error) {
          return reject(error);
        }

        if (records.length === 0) {
          const error = new Error(`No user with username: ${username}`);
          error.code = 404;
          return reject(error);
        }

        const user = records.find(
          (record) => record.get("username") === username
        ).fields;
        return resolve(user);
      });
  });
};

exports.handler = async (event) => {
  let errorStatusCode = 500;
  try {
    const { username, password } = JSON.parse(event.body);

    const user = await getUser(username);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      errorStatusCode = 401;
      throw new Error("Password do not match");
    }

    const token = createJwt(user.id, username);
    delete user.password;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "You are logged in",
        user: user,
        accessToken: token,
      }),
    };
  } catch (error) {
    if (error.code) {
      errorStatusCode = error.code;
    }
    return {
      statusCode: errorStatusCode,
      body: JSON.stringify({ status: errorStatusCode, message: error.message }),
    };
  }
};
