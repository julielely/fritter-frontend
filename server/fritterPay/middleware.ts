import type {Request, Response, NextFunction} from 'express';
import FreetCollection from '../freet/collection';
import {Types} from 'mongoose';
import FritterPayCollection from './collection';

/**
 * Checks if a freet with fritterPayId is req.params exists
 */
const isfritterPayExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.fritterPayId);
  const fritterPay = validFormat ? await FritterPayCollection.findOne(req.params.fritterPayId) : '';
  if (!fritterPay) {
    res.status(404).json({
      error: {
        fritterPayNotFound: `FritterPay with fritterPay ID ${req.params.fritterPayId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the fritterPay owner whose fritterPayId is in req.params
 */
const isValidPaymentModifier = async (req: Request, res: Response, next: NextFunction) => {
  const fritterPay = await FritterPayCollection.findOne(req.params.fritterPayId);
  const userId = fritterPay.user._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' fritterPay.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is not the buyer of freet
 */
 const isValidBuyer = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  const freetAuthor = freet.authorId._id;

  if (req.session.userId === freetAuthor.toString()) {
    res.status(403).json({
      error: 'Cannot buy your own merchant freet.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user has a fritterPay linked
 */
 const hasPaymentConnected = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FritterPayCollection.findAllByUserId(req.session.userId);

  if (freet.length) {}
  else {
    res.status(403).json({
      error: 'Connect your fritterPay to buy.'
    });
    return;
  }

  next();
};

/**
 * Checks if a username in req.body is valid
 */
 const isValidUsername = (req: Request, res: Response, next: NextFunction) => {
  const usernameRegex = /^\w+$/i;
  if (!usernameRegex.test(req.body.paymentUsername)) {
    res.status(400).json({
      error: {
        username: 'Username must be a nonempty alphanumeric string.'
      }
    });
    return;
  }

  next();
};


export {
  isfritterPayExists,
  isValidPaymentModifier,
  isValidUsername,
  isValidBuyer,
  hasPaymentConnected
};
