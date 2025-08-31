const router = require('express').Router();
const container = require('../../../infrastructure/container/DIContainer');

const personController = container.get('personController');

router.post('/', async (req, res) => {
  await personController.create(req, res);
});

router.get('/', async (req, res) => {
  await personController.list(req, res);
});

router.get('/:id', async (req, res) => {
  await personController.getById(req, res);
});

router.put('/:id', async (req, res) => {
  await personController.update(req, res);
});

router.delete('/:id', async (req, res) => {
  await personController.delete(req, res);
});

module.exports = router;


