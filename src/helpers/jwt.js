import jwt from "jsonwebtoken";

const createJwt = (userId, username) => {
  const token = jwt.sign({ userId, username }, process.env.JWT_TOKEN_SECRET, {
    expiresIn: "10 days",
  });
  return token;
};

const getUserId = (token) => {
  const { userId } = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
  return userId;
};

export { createJwt, getUserId };
