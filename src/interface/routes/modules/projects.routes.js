const router = require('express').Router();
const auth = require('../../middlewares/auth');
const container = require('../../../infrastructure/container/DIContainer');

const projectController = container.get('projectController');

// Create project (requires auth)
router.post('/', auth(true), async (req, res) => {
  await projectController.create(req, res);
});

// List projects (no auth required for frontend)
router.get('/', async (req, res) => {
  await projectController.list(req, res);
});

router.get('/:id', async (req, res) => {
  await projectController.getById(req, res);
});

router.put('/:id', auth(true), async (req, res) => {
  await projectController.update(req, res);
});

router.delete('/:id', auth(true), async (req, res) => {
  await projectController.delete(req, res);
});

module.exports = router;


