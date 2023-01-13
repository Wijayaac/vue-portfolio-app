import bcrypt from "bcrypt";

import { base } from "../../src/helpers/db";

const saveUser = async (name, username, password) => {
  return new Promise((resolve, reject) => {
    base("users").create(
      {
        name: name,
        password: password,
        username: username,
      },
      (error) => {
        if (error) {
          return reject(error);
        }
        resolve();
      }
    );
  });
};

const getExistingUser = async (username) => {
  return new Promise((resolve, reject) => {
    base("users")
      .select({
        fields: ["name"],
        filterByFormula: "({username}='" + username + "')",
      })
      .firstPage((error, records) => {
        if (error) {
          return reject(error);
        }
        return resolve(records.length > 0);
      });
  });
};

exports.handler = async (event) => {
  let errorStatusCode = 500;
  try {
    const { name, username, password } = JSON.parse(event.body);

    const isExistingUser = await getExistingUser(username);
    if (isExistingUser) {
      errorStatusCode = 409;
      throw new Error(`A user already exists with the username : ${username}`);
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    await saveUser(name, username, passwordHash);

    return {
      statusCode: 200,
      body: JSON.stringify({
        username,
        message: `Successfully registered : ${username}`,
      }),
    };
  } catch (error) {
    return {
      statusCode: errorStatusCode,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
