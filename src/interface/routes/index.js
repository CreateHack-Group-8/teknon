const router = require('express').Router();

router.use('/auth', require('./modules/auth.routes'));
router.use('/users', require('./modules/users.routes'));
router.use('/projects', require('./modules/projects.routes'));
router.use('/persons', require('./modules/persons.routes'));
router.use('/persons-by-project', require('./modules/personsByProject.routes'));
router.use('/metadata', require('./modules/metadata.routes'));
router.use('/checkpoints', require('./modules/checkpoints.routes'));
router.use('/checkpoint-progress', require('./modules/checkpointProgress.routes'));

module.exports = router;


