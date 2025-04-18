const Router = require('express');
const router = Router();

const TaskController = require('../app/controllers/TaskController');
const httpErrorHandler = require('../middlewares/httpErrorMiddleware');
const resolver = require('../app/utils/adapter/resolverHandlerFn');

router.get('/tasks', resolver(TaskController.index));
router.get('/task/:id', resolver(TaskController.show));
router.post('/task', resolver(TaskController.store));
router.put('/task/:id', resolver(TaskController.update));
router.delete('/task/:id', resolver(TaskController.delete));
router.use(httpErrorHandler)

module.exports = router;