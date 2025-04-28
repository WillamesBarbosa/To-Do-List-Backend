const Router = require('express');
const router = Router();

const TaskController = require('../app/controllers/TaskController/taskController');
const userController = require('../app/controllers/UserController/userController');
const httpErrorHandler = require('../middlewares/httpErrorMiddleware');
const resolver = require('../app/utils/adapter/resolverHandlerFn');

router.get('/tasks', resolver(TaskController.index));
router.get('/task/:id', resolver(TaskController.show));
router.post('/task', resolver(TaskController.store));
router.put('/task/:id', resolver(TaskController.update));
router.delete('/task/:id', resolver(TaskController.delete));

router.get('/users', resolver(userController.index));
router.post('/user', resolver(userController.store));
router.put('/user/:id', resolver(userController.update));
router.use(httpErrorHandler)

module.exports = router;