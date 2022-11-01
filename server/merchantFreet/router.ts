import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import MerchantFreetCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as merchantFreetValidator from './middleware';
import * as freetUtil from '../freet/util';
import * as util from './util';
import { Document, Types } from 'mongoose';

const router = express.Router();

/**
 * Get all, sold, or forsale freets
 *
 * @name GET /api/freets/merchantFreets?listingStatus=status
 * @param {listingStatus} status - Either all, sold, or forsale
 *
 * @return {FreetResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 */
/**
 * Get merchant freets by author and status.
 *
 * @name GET /api/freets/merchantFreets?author=authorId&listingStatus=status
 *
 * @return {MerchantFreetResponse[]} - An array of freets created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
 router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // If author is not defined
    if (req.query.author !== undefined) {
      next();
      return;
    }

    // no author specified
    const allMerchantFreets = await FreetCollection.findAllMerchant();

    if (req.query.listingStatus == "forsale") { // find all merchantFreets and filter by listingStatus=forsale
      var forSaleFeed:any[] = [];
      for (var oneFreet of allMerchantFreets) {
        const result = await util.isForSale(oneFreet);
        if (result) { forSaleFeed.push(oneFreet); }
      }

      const response = forSaleFeed.map(freetUtil.constructFreetResponse);
      res.status(200).json(response);
    }
    else if (req.query.listingStatus == "sold") { // find all merchantFreets and filter by listingStatus=sold
      var soldFeed:any[] = [];
      for (var oneFreet of allMerchantFreets) {
        const result = await util.isSold(oneFreet);
        if (result) { soldFeed.push(oneFreet); }
      }
      const response = soldFeed.map(freetUtil.constructFreetResponse);
      res.status(200).json(response);
    }
    else { // all
      const response = allMerchantFreets.map(freetUtil.constructFreetResponse);
      res.status(200).json(response);
    }
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    // If both author and listing are supplied - /api/merchantFreets?author=authorId&listingStatus=status
    const authorFreets = await FreetCollection.findAllMerchantByUsername(req.query.author as string);

    if (req.query.listingStatus == "forsale") { // find all merchantFreets and filter by listingStatus=forsale
      var forSaleFeed:any[] = [];
      for (var oneFreet of authorFreets) {
        const result = await util.isForSale(oneFreet);
        if (result) { forSaleFeed.push(oneFreet); }
      }

      const response = forSaleFeed.map(freetUtil.constructFreetResponse);
      res.status(200).json(response);
    }
    else if (req.query.listingStatus=="sold") { // find all merchantFreets and filter by listingStatus=sold
      var soldFeed:any[] = [];
      for (var oneFreet of authorFreets) {
        const result = await util.isSold(oneFreet);
        if (result) { soldFeed.push(oneFreet); }
      }
      const response = soldFeed.map(freetUtil.constructFreetResponse);
      res.status(200).json(response);
    }
    else { // all
      const response = authorFreets.map(freetUtil.constructFreetResponse);
      res.status(200).json(response);
    }
  }
);

// /**
//  * Buy merchant freet
//  *
//  * @name PATCH /api/freets/merchantFreets/
//  *
//  * @return {FreetResponse[]} - An array of freets created by user with id, authorId
//  * @throws {400} - If authorId is not given
//  * @throws {404} - If no user has given authorId
//  *
//  */
//  router.patch(
//   '/purchase/:freetId?',
//   [
//     userValidator.isUserLoggedIn,
//     merchantFreetValidator.isForSale
//   ],
//   async (req: Request, res: Response) => {
//     console.log("Run?")
//     const parentFreet = await FreetCollection.findOne(req.params.id)
//     const merchantFreet = await MerchantFreetCollection.findOne(req.params.id);
//     const merchantFreetId = merchantFreet._id;

//     // update merchant freet status and buyer
//     const soldMerchantFreet = await MerchantFreetCollection.updateStatus(merchantFreetId, "sold", req.params.userId);
//     res.status(200).json({
//       message: 'merchantFreet was successfully purchased',
//       freet: util.constructMerchantFreetResponse(soldMerchantFreet)
//     });
//   }
// );

export {router as merchantFreetRouter};
