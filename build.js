const esbuild = require("esbuild");

let skipSocketImports = {
  name: 'skipSocketImports',
  setup(build) {
    build.onResolve({ filter: /^socket\.io-client$/ }, (args) => {
      return {
        path: args.path,
        namespace: `globalExternal_${args.path}`,
      };
    });

    build.onLoad(
      { filter: /.*/, namespace: 'globalExternal_socket.io-client' },
      () => {
        return {
          contents: `module.exports = globalThis.io`,
          loader: 'js',
        };
      }
    );
  },
};

esbuild.build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  platform: "browser",
  external: ["socket.io-client"],
  plugins: [skipSocketImports],
});
