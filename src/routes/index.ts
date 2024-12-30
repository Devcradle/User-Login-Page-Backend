import express, { IRouter } from 'express';
import AdminRoutes from './admin.route';
import UserRoutes from './user.route';


const router = express.Router();



/**
 * Function contains Application routes
 *
 * @returns router
 */
const routes = (): IRouter => {
  router.get('/', (req, res) => {
    res.json('Welcome');
  });
  router.use('/admin', new AdminRoutes().getRoutes());
  router.use('/users', new UserRoutes().getRoutes());

  return router;
};

export default routes;
