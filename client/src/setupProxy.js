// This proxying setup only works for the development server
// Production server sets up proxying through Apache
const proxy = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(proxy('/api', {
    target: 'http://localhost:5000/',
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
  }));

  app.use(proxy('/css/*', {
    target: 'http://localhost:5000/',
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
  }));

  app.use(proxy('/images/*', {
    target: 'http://localhost:5000/',
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
  }));

  app.use(proxy('/profiles/*', {
    target: 'http://localhost:5000/',
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
  }));

  app.use(proxy('/maclab', {
    target: 'http://localhost:5000/',
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
  }));

  app.use(proxy('/pclab1', {
    target: 'http://localhost:5000/',
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
  }));

  app.use(proxy('/pclab2', {
    target: 'http://localhost:5000/',
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
  }));
};
