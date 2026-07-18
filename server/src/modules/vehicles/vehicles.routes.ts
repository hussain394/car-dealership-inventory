import { Router } from 'express';
import {
  createVehicle,
  listVehicles,
  searchVehicles,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
} from './vehicles.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateRequest } from '../../middleware/validateRequest';
import { createVehicleSchema, updateVehicleSchema } from './vehicles.schema';

const router = Router();

// NOTE: '/search' must be declared before '/:id' routes to avoid being
// shadowed by the ':id' param matcher.
router.get('/search', authenticate, searchVehicles);
router.get('/', authenticate, listVehicles);
router.post('/', authenticate, validateRequest(createVehicleSchema), createVehicle);
router.put('/:id', authenticate, validateRequest(updateVehicleSchema), updateVehicle);
router.delete('/:id', authenticate, authorize('admin'), deleteVehicle);
router.post('/:id/purchase', authenticate, purchaseVehicle);
router.post('/:id/restock', authenticate, authorize('admin'), restockVehicle);

export default router;
