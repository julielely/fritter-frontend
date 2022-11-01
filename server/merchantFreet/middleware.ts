import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';
import MerchantFreetCollection from './collection';

/**
 * Checks if the content of the merchant freet in req.body is valid
 */
const isValidMerchantFreetTitle = (req: Request, res: Response, next: NextFunction) => {
  const {listingName} = req.body as {listingName: string};
  if (!listingName.trim()) {
    res.status(400).json({
      error: 'Merchant Freet title must be at least one character long.'
    });
    return;
  }

  if (listingName.length > 80) {
    res.status(413).json({
      error: 'Merchant Freet title must be no more than 80 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if expiration is valid
 */
 const isValidExpiration = async (req: Request, res: Response, next: NextFunction) => {
  const {expirationDate} = req.body as {expirationDate: Date};
  const expirationObject = new Date(expirationDate);
  const inputExpiration = expirationObject.valueOf();
  console.log("ExpirationDate: " + inputExpiration);
  var now = new Date().valueOf();
  console.log("Now: " + now);

  if (now > inputExpiration) {
    res.status(400).json({
      error: 'Expiration date is has already passed.'
    });
    return;
  }

  next();
};

/**
 * Checks if expiration is valid
 */
 const isValidUnarchive = async (req: Request, res: Response, next: NextFunction) => {
  const {expirationDate} = req.body as {expirationDate: Date};
  const expirationObject = new Date(expirationDate);
  const inputExpiration = expirationObject.valueOf();
  console.log("ExpirationDate: " + inputExpiration);
  var now = new Date().valueOf();
  console.log("Now: " + now);

  if (now < inputExpiration) {
    res.status(400).json({
      error: 'Cannot be unarchived'
    });
    return;
  }

  next();
};


/**
 * Checks if the price is an integer
 */
const isValidPrice = async (req: Request, res: Response, next: NextFunction) => {
  const {listingPrice} = req.body as {listingPrice: string};
  const number = parseInt(listingPrice);
  if (!number) {
    res.status(400).json({
      error: 'Price is invalid.'
    });
    return;
  }

  next();
};

/**
 * Checks if the price is an integer
 */
 const isForSale = async (req: Request, res: Response, next: NextFunction) => {
  // freetId
  const {id} = req.body as {id: string};
  const merchantFreet = await MerchantFreetCollection.findOneByFreet(id);
  const merchantFreetStatus = merchantFreet.listingStatus;

  if (merchantFreetStatus == "sold") {
    res.status(400).json({
      error: 'You cannot buy because it is sold.'
    });
    return;
  }

  next();
};






export {
  isValidMerchantFreetTitle,
  isValidPrice,
  isValidExpiration,
  isValidUnarchive,
  isForSale
};
