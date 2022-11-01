import type {HydratedDocument, Types} from 'mongoose';
import type {FritterPay} from './model';
import type {User} from '../user/model';
import FreetModel from '../freet/model';
import FritterPayModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class FritterPayCollection {
  /**
   * Add a fritter pay to the collection
   *
   * @param {User} user - The id of the user
   * @param {string} paymentType - The payment type
   * @param {string} paymentUsername - The username for said payment type
   * @param {string} paymentLink - The link to payment
   * @return {Promise<HydratedDocument<FritterPay>>} - The newly created fritterPay
   */
  static async addOne(user: Types.ObjectId | string, paymentType: string, 
    paymentUsername: string, paymentLink: string): Promise<HydratedDocument<FritterPay>> {
    const fritterPay = new FritterPayModel({
      user,
      paymentType,
      paymentUsername,
      paymentLink
    });
    await fritterPay.save(); // Saves freet to MongoDB
    return fritterPay.populate('user');
  }

   /**
   * Find a fritterPay by fritterPayId
   *
   * @param {string} fritterPayId - The id of the freet to find
   * @return {Promise<HydratedDocument<FritterPay>> | Promise<null> } - The freet with the given freetId, if any
   */
    static async findOne(fritterPayId: Types.ObjectId | string): Promise<HydratedDocument<FritterPay>> {
      return FritterPayModel.findOne({_id: fritterPayId}).populate('user');
    }

  /**
   * Find a fritterPay by userId
   *
   * @param {string} userId - The id of the user to find FritterPay info
   * @return {Promise<HydratedDocument<FritterPay>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findAllByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<FritterPay>>> {
    return FritterPayModel.find({user: userId}).populate('user');
  }

    /**
   * Find a fritterPay by username
   *
   * @param {string} username - The username of the user to find FritterPay info
   * @return {Promise<HydratedDocument<FritterPay>> | Promise<null> } - The freet with the given freetId, if any
   */
     static async findAllByUsernane(username: Types.ObjectId | string): Promise<Array<HydratedDocument<FritterPay>>> {
      const user = await UserCollection.findOneByUsername(username as string);
      return FritterPayModel.find({user: user._id}).populate('user');
    }

  /**
   * Get all the fritterPay information in the database
   *
   * @return {Promise<HydratedDocument<FritterPay>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<FritterPay>>> {
    return FritterPayModel.find({}).populate('user');
  }

  /**
   * Update a fritterPay with new info
   *
   * @param {string} fritterPayId - The Id of fritter pay object
   * @param {string} paymentType - The payment type
   * @param {string} paymentUsername - The username for said payment type
   * @param {string} paymentLink - The link to payment
   * @return {Promise<HydratedDocument<FritterPay>>} - The newly updated freet
   */
  static async updateOne(fritterPayId: Types.ObjectId | string, paymentType: string, 
    paymentUsername: string, paymentLink: string): Promise<HydratedDocument<FritterPay>> {
    const fritterPay = await FritterPayModel.findOne({_id: fritterPayId});
    fritterPay.paymentType = paymentType;
    fritterPay.paymentUsername = paymentUsername;
    if (paymentLink != ""){ fritterPay.paymentLink = paymentLink; }
    await fritterPay.save();
    return fritterPay.populate('user');
  }

    
  /**
   * Delete fritterPay by fritterPayId
   *
   * @param {FritterPay} fritterPayId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(fritterPayId: Types.ObjectId | string): Promise<boolean> {
    const fritterPay = await FritterPayModel.deleteOne({_id: fritterPayId});
    return fritterPay !== null;
  }

  /**
   * Delete all associated fritterPay by the given user
   *
   * @param {string} userId - The id of author of freets
   */
  static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
    await FreetModel.deleteMany({userId});
  }
}

export default FritterPayCollection;