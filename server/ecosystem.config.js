module.exports = {
  apps: [
    
    {
      name: "imitate",
      script: "./node_modules/.bin/ts-node",
      args: "--transpile-only server.ts",
    },
  ],
};
