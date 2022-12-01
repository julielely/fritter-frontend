import type {HydratedDocument, Types} from 'mongoose';
import MerchantFreetModel, { MerchantFreet } from './model';
import FreetModel, {Freet} from '../freet/model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class MerchantFreetCollection {
  /**
   * Add a merchantFreet to the collection
   *
   * @param {string} freet - The parent freet
   * @param {string} listingStatus - The item status
   * @param {string} listingName - The item name
   * @param {number} listingPrice - The item price
   * @return {Promise<HydratedDocument<MerchantFreet>>} - The newly created freet
   */
  static async addOne(freet: Types.ObjectId | string, listingStatus: string, listingName: string, listingPrice: number, listingLocation: string, paymentUsername: string, paymentType: string): Promise<HydratedDocument<MerchantFreet>> {
    const merchantFreet = new MerchantFreetModel({
      freet, // references the parent Freet
      listingStatus,
      listingName,
      listingPrice,
      listingLocation,
      paymentUsername,
      paymentType
    });
    await merchantFreet.save(); // Saves merchant freet to MongoDB
    return merchantFreet.populate('freet');
  }

  /**
   * Find a merchantFreet by merchantFreetId
   *
   * @param {string} merchantFreetId - The id of the Merchant Freet to find
   * @return {Promise<HydratedDocumentMerchantFreet> | Promise<null> } - The Merchant Freet with the given merchantFreetId, if any
   */
  static async findOne(merchantFreetId: Types.ObjectId | string): Promise<HydratedDocument<MerchantFreet>> {
    return MerchantFreetModel.findOne({_id: merchantFreetId});
  }

  /**
   * Find a merchantFreet by listingStatus
   *
   * @param {string} merchantFreetId - The id of the Merchant Freet to find
   * @return {Promise<HydratedDocumentMerchantFreet>[] | Promise<null> } - The Merchant Freet with the given merchantFreetId, if any
   */
   static async findForSale(): Promise<Array<HydratedDocument<MerchantFreet>>> {
    return MerchantFreetModel.findOne({listingStatus: "forsale"}).populate("freet");
  }

  /**
   * Find a merchantFreet by listingStatus
   *
   * @param {string} merchantFreetId - The id of the Merchant Freet to find
   * @return {Promise<HydratedDocumentMerchantFreet>[] } - The Merchant Freet with the given merchantFreetId, if any
   */
   static async findSold(): Promise<Array<HydratedDocument<MerchantFreet>>> {
    return MerchantFreetModel.findOne({listingStatus: "sold"}).populate("freet");
  }

    /**
   * Find a merchantFreet by FreetId
   *
   * @param {string} freetId - The id of parent freet to find
   * @return {Promise<HydratedDocumentMerchantFreet> | Promise<null> } - The Merchant Freet with the given merchantFreetId, if any
   */
     static async findOneByFreet(freetId: Types.ObjectId | string): Promise<HydratedDocument<MerchantFreet>> {
      return MerchantFreetModel.findOne({freet: freetId});
    }

  /**
   * Get all the merchant freets in the database, with no associated parent Freet
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the Merchant Freets
   */
  static async findAll(): Promise<Array<HydratedDocument<Freet>>> {
    // Retrieves freets and sorts them from most to least recent
    console.log("Calling MerchantFreet findAll()"); 
    // Sort by Freet's dateModified date
    // return MerchantFreetModel.find({}).sort({dateModified: -1}).populate('freet');
    return FreetModel.find({}).sort({dateModified: -1}).populate('merchantFreet');
  }

  /**
   * Get all the merchant freets in the database, with no associated parent Freet
   *
   * @return {Promise<HydratedDocument<MerchantFreet>[]>} - An array of all of the Merchant Freets
   */
   static async findAllMerchant(): Promise<Array<HydratedDocument<MerchantFreet>>> {
    // Retrieves freets and sorts them from most to least recent
    console.log("Calling MerchantFreet findAll()"); 
    // Sort by Freet's dateModified date
    // return MerchantFreetModel.find({}).sort({dateModified: -1}).populate('freet');
    return MerchantFreetModel.find({}).populate('freet');
  }



   /**
   * Update a merchant freet with the new listingName, listingPrice, or listingStatus
   *
   * @param {string} merchantFreetId - The id of the freet to be updated
   * @param {string} attribute - attribute to edit
   * @param {string} content - content to update
   * @return {Promise<HydratedDocument<MerchantFreet>>} - The newly updated freet
   */
    static async updateOne(merchantFreetId: Types.ObjectId | string, attribute: string, content: string): Promise<HydratedDocument<MerchantFreet>> {
      const merchantFreet = await MerchantFreetModel.findOne({_id: merchantFreetId});
      const parentFreet = await FreetModel.findOne({_id: merchantFreet.freet});

      // check attributes
      if (attribute == "listingName") { merchantFreet.listingName = content; }
      else if (attribute == "listingPrice") { merchantFreet.listingPrice = parseInt(content); }
      else if (attribute == "listingLocation") { merchantFreet.listingLocation = content; }
      else if (attribute == "expiration") { parentFreet.expiration = new Date(content); }
      else { merchantFreet.listingStatus = content; }

      // update parent freet
      parentFreet.dateModified = new Date();
      await merchantFreet.save();
      await parentFreet.save();
      return merchantFreet.populate('authorId merchantFreet');
    }

     /**
   * Update a merchant freet with the new listingName, listingPrice, or listingStatus
   *
   * @param {string} merchantFreetId - The id of the freet to be updated
   * @param {string} listingName - listing name to edit
   * @param {string} listingPrice - listing price to edit
   * @param {string} listingStatus - listing status to edit
   * @param {string} listingLocation - listing location to edit
   * @param {string} content - listing location to edit
   * @return {Promise<HydratedDocument<MerchantFreet>>} - The newly updated freet
   */
      static async updateAll(FreetId: Types.ObjectId | string, listingName: string, listingPrice: string, 
        expiration: Date, listingLocation: string, content: string): Promise<HydratedDocument<MerchantFreet>> {
        // const merchantFreet = await MerchantFreetModel.findOne({_id: merchantFreetId});
        // const parentFreet = await FreetModel.findOne({_id: merchantFreet.freet});

        const parentFreet = await FreetModel.findOne({_id: FreetId});
        const merchantFreet = await MerchantFreetModel.findOne({freet: FreetId});

        // add edited freets to history
        // const updatedParentFreet = await FreetModel.findByIdAndUpdate(FreetId,
        //   { $push: {editedFreets: parentFreet }},
        //   { 'upsert': true });
        
        // const updatedMerchantFreet = await MerchantFreetModel.findByIdAndUpdate(merchantFreetId,
        //   { $push: {editedMerchant: merchantFreet }},
        //   { 'upsert': true });

        // update merchant freet
        merchantFreet.listingName = listingName;
        merchantFreet.listingPrice = parseInt(listingPrice);
        merchantFreet.listingLocation = listingLocation;
  
        // update parent freet
        parentFreet.content = content;
        parentFreet.dateModified = new Date();
        parentFreet.expiration = expiration;
        parentFreet.edited = true;

        // save both merchant and parent freet
        await merchantFreet.save();
        await parentFreet.save();
        return merchantFreet.populate('freet');
      }

  /**
   * Update a merchant freet status
   *
   * @param {string} merchantFreetId - The id of the freet to be updated
   * @param {string} listingStatus - The new status of merchantFreet (sold, forSale, deactivated)
   * @return {Promise<HydratedDocument<MerchantFreet>>} - The newly updated freet
   */
  static async updateStatus(merchantFreetId: Types.ObjectId | string, listingStatus: string, buyer?: string): Promise<HydratedDocument<MerchantFreet>> {
    // Update merchant freet
    const merchantFreet = await MerchantFreetModel.findOne({_id: merchantFreetId});
    merchantFreet.listingStatus = listingStatus;

    if (listingStatus == "sold") {
      merchantFreet.buyer = buyer;
    }
    await merchantFreet.save();

    // Find parent freet and update date modified
    const freet = await FreetModel.findOne({_id: merchantFreet.freet});
    freet.dateModified = new Date(); //Bugggy
    await freet.save();
    return freet.populate('merchantFreet');
  }

  /**
   * Delete a merchant freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    const freet = await MerchantFreetModel.deleteOne({freet: freetId});
    return freet !== null;
  }
}

export default MerchantFreetCollection;
