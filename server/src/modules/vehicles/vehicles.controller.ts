import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/authenticate';
import { vehiclesService } from './vehicles.service';

export const createVehicle = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const vehicle = await vehiclesService.create(req.body);
    res.status(201).json(vehicle);
  } catch (err) {
    next(err);
  }
};

export const listVehicles = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    res.status(200).json(await vehiclesService.list());
  } catch (err) {
    next(err);
  }
};

export const searchVehicles = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    res.status(200).json(await vehiclesService.search(req.query as any));
  } catch (err) {
    next(err);
  }
};

export const updateVehicle = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const vehicle = await vehiclesService.update(Number(req.params.id), req.body);
    res.status(200).json(vehicle);
  } catch (err) {
    next(err);
  }
};

export const deleteVehicle = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await vehiclesService.remove(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const purchaseVehicle = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const vehicle = await vehiclesService.purchase(Number(req.params.id));
    res.status(200).json(vehicle);
  } catch (err) {
    next(err);
  }
};

export const restockVehicle = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const amount = Number(req.body.amount ?? 1);
    const vehicle = await vehiclesService.restock(Number(req.params.id), amount);
    res.status(200).json(vehicle);
  } catch (err) {
    next(err);
  }
};

