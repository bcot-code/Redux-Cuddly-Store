const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const secretKey = "mysecretssh";
const expiration = "2h"; // 2 hours

module.exports = {
  AuthenticatonError: new GraphQLError("Could not authenticate user.", {
    extensions: {
      code: "UNAUTHENTICATED",
    },
  }),
  authMiddleware: function ({ req }) {
    // allow token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;
    // check if token exists
    if (req.headers.authorization) {
      token = token.split("").pop().trim();
    }
    if (!token) {
      return req;
    }
    try {
      const { data } = jwt.verify(token, secretKey, { maxAge: expiration });
      req.user = data;
    } catch {
      throw AuthenticationError;
    }
    return req;
  },
  signToken: function ({ firstName, email, _id }) {
    const payload = { firstName, email, _id };
    return jwt.sign({ data: payload }, secretKey, { expiresIn: expiration });
  },
};
