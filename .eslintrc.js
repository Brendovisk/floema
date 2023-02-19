module.exports = {
  root: true,
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  globals: {
    IS_DEVELOPMENT: "readonly",
  },
  parseOptions: {
    ecmaVersion: "latest",
  },
};
