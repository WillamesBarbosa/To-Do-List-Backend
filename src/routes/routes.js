const Router = require('express');
const router = Router();

const TaskController = require('../app/controllers/TaskController/taskController');
const UserController = require('../app/controllers/UserController/userController');
const httpErrorHandler = require('../middlewares/httpErrorMiddleware');
const resolver = require('../app/utils/adapter/resolverHandlerFn');

router.get('/tasks', resolver(TaskController.index));
router.get('/task/:id', resolver(TaskController.show));
router.post('/task', resolver(TaskController.store));
router.put('/task/:id', resolver(TaskController.update));
router.delete('/task/:id', resolver(TaskController.delete));

router.get('/users', resolver(UserController.index));
router.post('/user', resolver(UserController.store));
router.put('/user/:id', resolver(UserController.update));
router.delete('/user/:id', resolver(UserController.delete))
router.use(httpErrorHandler)

module.exports = router;