import AppController from '../controllers/AppController';
import { APIError, errorResponse } from '../middlewares/error';

/**
 * Injects routes with their handlers to the given Express application.
 * @param {Express} api
 */
const injectRoutes = (api) => {
  api.get('/status', AppController.getStatus);
  api.get('/stats', AppController.getStats);
  api.post('/users', AppController.postNew);
  api.get('/users/me', AppController.getMe);
  api.all('*', (req, res, next) => {
    errorResponse(new APIError(404, `Cannot ${req.method} ${req.url}`), req, res, next);
  });
  api.use(errorResponse);
};

export default injectRoutes;
