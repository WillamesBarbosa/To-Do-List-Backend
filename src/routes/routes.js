const Router = require('express');
const router = Router();

const TaskController = require('../app/controllers/taskController')

router.get('/task', TaskController.index);

module.exports = router;