module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@omnitoast/core': '../../packages/core/src',
            '@omnitoast/native': '../../packages/native/src'
          }
        }
      ]
    ]
  };
};
