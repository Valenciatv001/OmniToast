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
            '@modal-toast/core': '../../packages/core/src',
            '@modal-toast/native': '../../packages/native/src'
          }
        }
      ]
    ]
  };
};
