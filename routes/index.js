module.exports = app => {
  app.use('/api', require('./api'));
  app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'Page not found' });
  });
};
