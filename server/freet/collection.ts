import type {HydratedDocument, StringExpression, Types} from 'mongoose';
import type {Freet} from './model';
import FreetModel from './model';
import UserCollection from '../user/collection';
import MerchantFreetCollection from '../merchantFreet/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class FreetCollection {
  /**
   * Add a freet to the collection
   *
   * @param {string} authorId - The id of the author of the freet
   * @param {string} content - The id of the content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async addOne(authorId: Types.ObjectId | string, content: string, freetType: string): Promise<HydratedDocument<Freet>> {
    const date = new Date();
    const freet = new FreetModel({
      authorId,
      dateCreated: date,
      content,
      dateModified: date,
      freetType
    });
    await freet.save(); // Saves freet to MongoDB
    return freet.populate('authorId merchantFreet');
  }

  /**
   * Find a freet by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    return FreetModel.findOne({_id: freetId}).populate('authorId merchantFreet');
  }

  /**
   * Get all the freets in the database
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<Freet>>> {
    // Retrieves freets and sorts them from most to least recent
    return FreetModel.find({}).sort({dateModified: -1}).populate('authorId merchantFreet');
  }

    /**
   * Get all the merchant freets in the database
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
     static async findAllMerchant(): Promise<Array<HydratedDocument<Freet>>> {
      // Retrieves freets and sorts them from most to least recent
      return FreetModel.find({freetType: "merchant"}).sort({dateModified: -1}).populate('authorId merchantFreet');
    }

  /**
   * Get all the merchant freets in the database
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
     static async findAllFleeting(): Promise<Array<HydratedDocument<Freet>>> {
      // Retrieves freets and sorts them from most to least recent
      return FreetModel.find({freetType: "fleeting"}).sort({dateModified: -1}).populate('authorId');
    }
    

  /**
   * Get all the freets in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Freet>>> {
    const author = await UserCollection.findOneByUsername(username);
    return FreetModel.find({authorId: author._id}).sort({dateModified: -1}).populate('authorId merchantFreet');
  }

   /**
   * Get all the freets in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
    static async findAllMerchantByUsername(username: string): Promise<Array<HydratedDocument<Freet>>> {
      const author = await UserCollection.findOneByUsername(username);
      return FreetModel.find({authorId: author._id, freetType: "merchant"}).sort({dateModified: -1}).populate('authorId merchantFreet');
    }

  /**
   * Update a freet with the new content
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} content - The new content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async updateOne(freetId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Freet>> {
    const freet = await FreetModel.findOne({_id: freetId});
    freet.content = content;
    freet.dateModified = new Date();
    freet.edited = true;
    await freet.save();
    return freet.populate('authorId merchantFreet');
  }

  /**
   * Update a freet with the new expiration
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {Date} expiration - The new content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
     static async updateExpiration(freetId: Types.ObjectId | string, expiration: Date): Promise<HydratedDocument<Freet>> {
      const freet = await FreetModel.findOne({_id: freetId});
      freet.expiration = expiration;
      freet.dateModified = new Date();
      await freet.save();
      return freet.populate('authorId merchantFreet');
    }

  /**
   * Change freet to expired by making the expiration date the day before
   *
   * @param {string} freetId - The id of the freet to be updated
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
      static async makeExpired(freetId: Types.ObjectId | StringExpression): Promise<HydratedDocument<Freet>> {
      const freet = await FreetModel.findOne({_id: freetId});
      const freetType = freet.freetType;

      const today = new Date();
      var yesterday = new Date(today.getTime());
      yesterday.setDate(today.getDate() - 1);
      // update expiration dates
      freet.expiration = yesterday;
      freet.dateModified = today;
      // if default Freet, change type to "fleeting"
      if (freetType == "default") { freet.freetType = "fleeting"; }
      await freet.save();
      return freet.populate('authorId merchantFreet');
    }

  /**
   * Change freet to not-expired (to show on feed again and take out archive) by 
   * making the expiration date in the far future
   *
   * @param {string} freetId - The id of the freet to be updated
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
   static async makeNotExpired(freetId: Types.ObjectId | StringExpression): Promise<HydratedDocument<Freet>> {
    const freet = await FreetModel.findOne({_id: freetId});
    const freetType = freet.freetType;
    // get today's and far future dates
    const today = new Date();
    const future = new Date("4000-01-01");
    // update expiration dates
    freet.expiration = future;
    freet.dateModified = today;

    // if fleeting Freet, change type to "default"
    if (freetType == "fleeting") { freet.freetType = "default"; }
    await freet.save();
    return freet.populate('authorId merchantFreet');
  }
      
  /**
   * Delete a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    const freet = await FreetModel.findByIdAndDelete({_id: freetId});
    if (freet.freetType == "merchant") { // delete associated merchantFreet
      await MerchantFreetCollection.deleteOne(freetId);
    }
    return freet !== null;
  }

  /**
   * Delete all the freets by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    // Delete Merchant Freets
    const freets = await FreetModel.find({authorId});

    // delete both freet and merchant freet
    for (const freet of freets) {
      await this.deleteOne(freet._id); // deletes both freet and merchant freet from deleteOne
    }
    // await FreetModel.deleteMany({authorId});
  }
}

export default FreetCollection;