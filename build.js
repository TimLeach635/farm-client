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

let skipPhaserImports = {
  name: 'skipPhaserImports',
  setup(build) {
    build.onResolve({ filter: /^phaser$/ }, (args) => {
      return {
        path: args.path,
        namespace: `globalExternal_${args.path}`,
      };
    });

    build.onLoad(
      { filter: /.*/, namespace: 'globalExternal_phaser' },
      () => {
        return {
          contents: `module.exports = globalThis.Phaser`,
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
  external: ["socket.io-client", "phaser"],
  plugins: [skipSocketImports, skipPhaserImports],
})
  .catch(err => {
    console.error(err);
  });
