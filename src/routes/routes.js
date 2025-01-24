const Router = require('express');
const router = Router();

const TaskController = require('../app/controllers/TaskController');

router.get('/task', TaskController.index);
router.post('/task', TaskController.store);
router.put('/task/:id', TaskController.update);
router.delete('/task/:id', TaskController.delete);

module.exports = router;