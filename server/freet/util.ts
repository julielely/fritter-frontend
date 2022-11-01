import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Freet, PopulatedFreet} from '../freet/model';

// Update this if you add a property to the Freet type!
type FreetResponse = {
  _id: string;
  author: string;
  dateCreated: string;
  content: string;
  dateModified: string;
  expiration: string;
  freetType: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Check if date is expired
 * 
 * @param {Freet} freet - A freet object
 * @returns {FreetResponse[]} - An array of filtered freets
 */
const isExpired = (freet: HydratedDocument<Freet>): Boolean => {
  const freetExpiration = freet.expiration;
  var now = new Date().valueOf();
  const inputExpiration = freetExpiration.valueOf();

  return !(inputExpiration - now > 0)
}

/**
 * Check if date is not expired
 * 
 * @param {Freet} freet - A freet object
 * @returns {FreetResponse[]} - An array of filtered freets
 */
 const isNotExpired = (freet: HydratedDocument<Freet>): Boolean => {
  const freetExpiration = freet.expiration;
  var now = new Date().valueOf();
  const inputExpiration = freetExpiration.valueOf();

  return inputExpiration - now > 0
}

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Freet>} freet - A freet
 * @returns {FreetResponse} - The freet object formatted for the frontend
 */
const constructFreetResponse = (freet: HydratedDocument<Freet>): FreetResponse => {
  const freetCopy: PopulatedFreet = {
    ...freet.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  
  const {username} = freetCopy.authorId;
  delete freetCopy.authorId;
  return {
    ...freetCopy,
    _id: freetCopy._id.toString(),
    author: username,
    dateCreated: formatDate(freet.dateCreated),
    dateModified: formatDate(freet.dateModified),
    expiration: formatDate(freetCopy.expiration),
    freetType: freetCopy.freetType
  };
};

export {
  constructFreetResponse,
  isExpired,
  isNotExpired
};
