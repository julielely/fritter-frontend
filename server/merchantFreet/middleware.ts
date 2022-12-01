import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';
import MerchantFreetCollection from './collection';
import FritterPayCollection from '../fritterPay/collection';

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
  const {expiration} = req.body as {expiration: Date};
  console.log(expiration);
  const expirationObject = new Date(expiration);
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
 * Checks if item is for sale
 */
 const isForSale = async (req: Request, res: Response, next: NextFunction) => {
  // freetId
  // const {id} = req.body as {id: string};
  const id = req.params.freetId;
  console.log("Calling isForSale. The ID is: ", id);
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

/**
 * Checks if user has a FritterPay linked
 */
 const fritterPayLinked = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.userId;
  const fritterPayArray = await FritterPayCollection.findAllByUserId(userId);

  if (fritterPayArray.length == 0) {
    res.status(400).json({
      error: 'You cannot post because you have not added your FritterPay.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
 const validBuyer = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.userId;
  const id = req.params.freetId;
  const freet = await FreetCollection.findOne(id);
  const author = freet.authorId._id.toString();

  console.log("running buyer");
  console.log("userId", req.session.userId);
  console.log("author", author);

  if (req.session.userId == author) {
    res.status(403).json({
      error: 'You cannot buy your own listing.'
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
  isForSale,
  fritterPayLinked,
  validBuyer
};
