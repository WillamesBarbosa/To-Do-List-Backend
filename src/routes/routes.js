const Router = require('express');
const router = Router();

const TaskController = require('../app/controllers/TaskController/taskController');
const UserController = require('../app/controllers/UserController/userController');
const httpErrorHandler = require('../middlewares/httpErrorMiddleware');
const resolver = require('../app/utils/adapter/resolverHandlerFn');
const LoginController = require('../app/controllers/LoginController/loginController');
const authenticationMiddleware = require('../middlewares/authenticationMiddleware/authenticationMiddleware');

router.post('/login', resolver(LoginController.login))

router.get('/users', resolver(UserController.index));
router.post('/user', resolver(UserController.store));

router.get('/tasks', resolver(TaskController.index));



router.use(authenticationMiddleware);

router.post('/task', resolver(TaskController.store));
router.get('/user', resolver(UserController.show));
router.delete('/user', resolver(UserController.delete))
router.put('/user', resolver(UserController.update));

router.get('/task/:id', resolver(TaskController.show));
router.put('/task/:id', resolver(TaskController.update));
router.delete('/task/:id', resolver(TaskController.delete));

router.use(httpErrorHandler)

module.exports = router;