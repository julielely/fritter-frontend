import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {FritterPay, PopulatedFritterPay} from './model';

export type FritterPayResponse = {
  _id: String; // MongoDB assigns each object this ID on creation
  user: String; // references the parent Freet
  paymentType: String;
  paymentUsername: String;
  paymentLink?: String;
};

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Freet>} freet - A freet
 * @returns {FritterPayResponse} - The fritter pay object formatted for the frontend
 */
const constructFritterPayResponse = (fritterPay: HydratedDocument<FritterPay>): FritterPayResponse => {
  const fritterPayCopy: PopulatedFritterPay = {
    ...fritterPay.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  
  const {username} = fritterPayCopy.user;
  delete fritterPayCopy.user;
  return {
    ...fritterPayCopy,
    _id: fritterPayCopy._id.toString(),
    user: username, // references the parent Freet
    paymentType: fritterPayCopy.paymentType,
    paymentUsername: fritterPayCopy.paymentUsername,
    paymentLink: fritterPayCopy.paymentLink
  };
};

export {
  constructFritterPayResponse
};
