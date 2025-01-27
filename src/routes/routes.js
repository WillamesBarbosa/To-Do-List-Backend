const Router = require('express');
const router = Router();

const TaskController = require('../app/controllers/TaskController');
const httpErrorHandler = require('../middlewares/httpErrorMiddleware');
const resolver = require('../app/utils/adapter/resolverHandlerFn');

router.get('/task', resolver(TaskController.index));
router.post('/task', resolver(TaskController.store));
router.put('/task/:id', resolver(TaskController.update));
router.delete('/task/:id', resolver(TaskController.delete));
router.use(httpErrorHandler)

module.exports = router;