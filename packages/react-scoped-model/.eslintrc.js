module.exports = {
  "root": true,
  "extends": [
    "lxsmnsyc/typescript/react"
  ],
  "parserOptions": {
    "project": "./tsconfig.eslint.json",
    "tsconfigRootDir": __dirname,
  },
  "rules": {
    "import/no-extraneous-dependencies": [
      "error", {
        "devDependencies": ["**/*.test.tsx"]
      }
    ],
    "react/jsx-props-no-spreading": "off",
  },
};

