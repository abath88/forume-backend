const basicController = {};

basicController.get = (req, res) => {
  res.json({
    'message': 'api working'
  })
}

module.exports = basicController;