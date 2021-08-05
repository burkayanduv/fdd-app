const CracoLessPlugin = require('craco-less');

module.exports = {
  babel: {
    loaderOptions: {
      ignore: ['./node_modules/mapbox-gl/dist/mapbox-gl.js'],
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#E8B339',
              '@body-background': '#101010',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
