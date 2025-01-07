const Router = require('express');
const router = Router();

const TaskController = require('../app/controllers/taskController')

router.get('/task', TaskController.index);
router.post('/task', TaskController.create);

module.exports = router;