import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from './collection';
import MerchantFreetCollection from '../merchantFreet/collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from './middleware';
import * as merchantFreetValidator from '../merchantFreet/middleware';
import * as util from './util';
import * as merchantUtil from '../merchantFreet/util';
import FreetModel from './model';
import UserCollection from '../user/collection';
import FritterPayCollection from '../fritterPay/collection';

const router = express.Router();

/**
 * Get all the freets
 *
 * @name GET /api/freets
 *
 * @return {FreetResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 */
/**
 * Get freets by author.
 *
 * @name GET /api/freets?authorId=username
 *
* @return {FreetResponse[]} - An array of freets created by user with username, author
* @throws {400} - If author is not given
* @throws {404} - If no user has given author
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }

    const allFreets = await FreetCollection.findAll();
    const response = allFreets.map(util.constructFreetResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorFreets = await FreetCollection.findAllByUsername(req.query.author as string);
    const response = authorFreets.map(util.constructFreetResponse);
    res.status(200).json(response);
  }
);


/**
 * Create a new freet (default, fleeting, or merchant).
 *
 * @name POST /api/freets
 *
 * @param {string} content - The content of the freet
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isValidFreetContent,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    var freetType = req.body.typeFreet; // Grab freet type, ie merchant
    if (freetType !== "default") {
      next();
      return;
    }
    const freet = await FreetCollection.addOne(userId, req.body.content, freetType);
      res.status(201).json({
        message: 'Your freet was created successfully.',
        freet: util.constructFreetResponse(freet),
      });

  },[
    merchantFreetValidator.isValidExpiration,
  ], async (req: Request, res: Response, next: NextFunction) => { // FLEETING FREET
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    var freetType = req.body.typeFreet; // Grab freet type, ie merchant
    if (freetType !== "fleeting") {
      next();
      return;
    }

    var freet = await FreetCollection.addOne(userId, req.body.content, freetType); // Create freet first
    freet = await FreetCollection.updateExpiration(freet._id, req.body.expiration); // Add expiration date

    res.status(201).json({
      message: 'Your fleeting was created successfully.',
      freet: util.constructFreetResponse(freet),
    });
  }, [
    merchantFreetValidator.isValidMerchantFreetTitle,
    merchantFreetValidator.isValidPrice,
    merchantFreetValidator.fritterPayLinked
  ], async (req: Request, res: Response) => { // MERCHANT FREET
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    var freetType = req.body.typeFreet; // Grab freet type, ie merchant

    const fritterPay = await FritterPayCollection.findAllByUserId(userId);
    const payment = fritterPay[0];
    const paymentUsername = payment.paymentUsername;
    const paymentType = payment.paymentType;

    const freet = await FreetCollection.addOne(userId, req.body.content, freetType); // Create freet first
    const updatedFreet = await FreetCollection.updateExpiration(freet._id, req.body.expiration); // Add expiration date
    const merchantFreet = await MerchantFreetCollection.addOne(freet._id, "forsale", req.body.listingName, req.body.listingPrice, req.body.listingLocation, paymentUsername, paymentType); 
 
    res.status(201).json({
      message: 'Your merchant freet was created successfully.',
      freet: util.constructFreetResponse(freet),
      merchantFreet: merchantUtil.constructMerchantFreetResponse(merchantFreet)
    });
  }, 

);

/**
 * Delete a freet
 *
 * @name DELETE /api/freets/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier
  ],
  async (req: Request, res: Response) => {
    await FreetCollection.deleteOne(req.params.freetId);
    res.status(200).json({
      message: 'Your freet was deleted successfully.'
    });
  }
);

/**
 * Modify a freet
 *
 * @name PATCH /api/freets/:id
 *
 * @param {string} content - the new content for the freet
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.patch(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
    freetValidator.isValidFreetContent
  ],
  async (req: Request, res: Response) => {
    const freetId = req.params.freetId;
    const freeType = await FreetModel.findOne({_id: freetId});
    console.log("modify route is running");
    // Update all forms based off of freetType
    // if (freeType.freetType == "merchant") {
    //   const merchantFreet = await MerchantFreetCollection.updateAll(freetId, req.body.listingName, 
    //     req.body.listingPrice, req.body.expiration, req.body.listingLocation, req.body.content);
    //     res.status(200).json({
    //       message: 'Your freet was updated successfully.',
    //       freet: merchantUtil.constructMerchantFreetResponse(merchantFreet)
    //     });
    // }
    if (freeType.freetType == "fleeting") {
      await FreetCollection.updateExpiration(freetId, req.body.expiration);
      const fleetingFreet = await FreetCollection.updateOne(freetId, req.body.content); 
      res.status(200).json({
        message: 'Your freet was updated successfully.',
        freet: util.constructFreetResponse(fleetingFreet)
      });
    }
    else { 
      const freet = await FreetCollection.updateOne(freetId, req.body.content); 
      res.status(200).json({
        message: 'Your freet was updated successfully.',
        freet: util.constructFreetResponse(freet)
      });
    }
  }
);


// FEED + ARCHIVED FEED

/**
 * [Fritter Feed] Get all the non-expired freets 
 *
 * @name GET /api/freets/feed
 *
 * @return {FreetResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 */
 router.get(
  '/feed',
  async (req: Request, res: Response) => {
    // Check if freet is expired
    const allFreets = await FreetCollection.findAll();
    const feed = allFreets.filter(util.isNotExpired);
    const response = feed.map(util.constructFreetResponse);
    res.status(200).json(response);
  }
);

/**
 * [Fritter Archive] Get all the expired freets 
 *
 * @name GET /api/freets/archived/
 *
 * @return {FreetResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 */
 router.get(
  '/archived',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    // get the current user's Id
    const userId = (req.session.userId as string) ?? '';
    const user = await UserCollection.findOneByUserId(userId);

    // find freets by username and filter by expiration
    const allFreets = await FreetCollection.findAllByUsername(user.username);
    const feed = allFreets.filter(util.isExpired);
    const response = feed.map(util.constructFreetResponse);
    res.status(200).json(response);
  }
);

/**
 * [Fritter Archive] Unarchive an archived freet
 *
 * @name PATCH /api/freets/archived/:id
 *
 * @param {Freet} freetId - the freet of modified freet
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 */
 router.patch(
  '/archived/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
    merchantFreetValidator.isValidUnarchive
  ],
  async (req: Request, res: Response) => {
    const freetId = req.params.freetId;
    const action = req.body.archiveStatus;

    if (action == "archive") {
      const archive = await FreetCollection.makeExpired(freetId);
      res.status(200).json({
        message: `Your freet has been archived successfully`,
        freet: util.constructFreetResponse(archive)
      });
    }
    else {     
      const unarchived = await FreetCollection.makeNotExpired(freetId);
      res.status(200).json({
        message: `Your freet has been unarchived successfully`,
        freet: util.constructFreetResponse(unarchived)
      });
    }
  }
);

/** BUY MERCHANT FREET */
/**
 * Buy merchant freet
 *
 * @name PATCH /api/freets/merchantFreets/purchase/:freetId?
 *
 * @return {FreetResponse[]} - An array of freets created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
 router.patch(
  '/merchantFreets/purchase/:freetId?',
  [
    userValidator.isUserLoggedIn,
    merchantFreetValidator.isForSale,
    merchantFreetValidator.validBuyer
  ],
  async (req: Request, res: Response) => {
    console.log("Run?")
    var freetID = req.params.freetId;
    // var freetID = req.body.id;
    // req.params.freetId
    const parentFreet = await FreetCollection.findOne(freetID);
    const merchantFreet = await MerchantFreetCollection.findOneByFreet(freetID);
    const merchantFreetId = merchantFreet._id;

    // update merchant freet status and buyer
    const soldMerchantFreet = await MerchantFreetCollection.updateStatus(merchantFreetId, "sold", req.params.userId);
    res.status(200).json({
      message: 'merchantFreet was successfully purchased'
    });
    console.log(soldMerchantFreet);
  }
);

export {router as freetRouter};


