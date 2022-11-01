import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as fritterPayValidator from '../fritterPay/middleware';
import FritterPayCollection from './collection';
import * as util from './util';

const router = express.Router();

/**
 * Get all the fritterPay information
 *
 * @name GET /api/users/fritterPay
 *
 * @return {FritterPayResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 */
/**
 * Get fritterPay information.
 *
 * @name GET /api/users/fritterPay?authorId=id
 *
 * @param {string} authorId - The id of the user
 * @param {string} paymentType - The payment type
 * @param {string} paymentUsername - The username for said payment type
 * @param {string} paymentLink - The link to payment
 * @return {FritterPayResponse} - An object with fritterPay details
 * @throws {403} - If user is already signed in
 * @throws {400} - If username or password is  not in the correct format,
 *                 or missing in the req
 * @throws {401} - If the user login credentials are invalid
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

    const allFritterPay = await FritterPayCollection.findAll();
    const response = allFritterPay.map(util.constructFritterPayResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const fritterPay = await FritterPayCollection.findAllByUsernane(req.query.author as string);
    const response = fritterPay.map(util.constructFritterPayResponse);
    res.status(200).json(response);
  }
);

/**
 * Delete fritterPay entry
 *
 * @name DELETE /api/user/fritterPay/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
 router.delete(
  '/:fritterPayId?',
  [
    userValidator.isUserLoggedIn,
    fritterPayValidator.isValidPaymentModifier,
    fritterPayValidator.isfritterPayExists
  ],
  async (req: Request, res: Response) => {
    await FritterPayCollection.deleteOne(req.params.fritterPayId);
    res.status(200).json({
      message: 'Your fritterPay entry was deleted successfully.'
    });
  }
);

/**
 * Create a new fritterPay object
 *
 * @name POST '/api/users/fritterPay'
 *
 * @param {string} user - The id of the user
 * @param {string} paymentType - The payment type
 * @param {string} paymentUsername - The username for said payment type
 * @param {string} paymentLink - The link to payment
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If username is not in correct format
 */
 router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    fritterPayValidator.isValidUsername,
  ],
  async (req: Request, res: Response) => {
    console.log("POST FRITTERPAY");
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const fritterPay = await FritterPayCollection.addOne(userId, req.body.paymentType, 
      req.body.username, req.body.link);

    res.status(201).json({
      message: 'Your fritterPay information was added successfully.',
      freet: util.constructFritterPayResponse(fritterPay),
    });
  }
);

/**
 * Modify fritterPay
 *
 * @name PUT /api/user/fritterPay/:id
 *
 * @param {string} paymentType - new payment type
 * @param {string} paymentUsername - new payment username
 * @param {string} paymentLink - new payment link
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the owner of
 *                 of fritterPay
 * @throws {404} - If the fritterPayId is not valid
 * @throws {400} - If the forms are empty or a stream of empty spaces
 */
 router.put(
  '/:fritterPayId?',
  [
    userValidator.isUserLoggedIn,
    fritterPayValidator.isValidUsername,
    fritterPayValidator.isValidPaymentModifier,
  ],
  async (req: Request, res: Response) => {
    const freet = await FritterPayCollection.updateOne(req.params.fritterPayId, 
      req.body.paymentType, req.body.paymentUsername, req.body.paymentLink);
    res.status(200).json({
      message: 'fritterPay was updated successfully.',
      freet: util.constructFritterPayResponse(freet)
    });
  }
);

export {router as fritterPayRouter};
