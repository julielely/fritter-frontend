import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Freet} from '../freet/model';
import type {User} from '../user/model';
import type {FritterPay} from '../fritterPay/model';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type MerchantFreet = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freet: Types.ObjectId; // references the parent Freet
  listingStatus: string;
  listingName: string;
  listingPrice: number;
  listingLocation: string;
  paymentUsername: string;
  paymentType: string;
  // payment: Types.ObjectId;
  buyer: string;
  // editedMerchant: Array<Types.ObjectId>;
};

export type PopulatedMerchantFreet = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freet: Freet;
  listingStatus: string;
  listingName: string;
  listingPrice: number;
  listingLocation: string;
  paymentUsername: string;
  paymentType: string;
  // editedMerchant: Array<Types.ObjectId>;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const MerchantFreetSchema = new Schema<MerchantFreet>({
  // The parent freet
  freet: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  // Status of listing (forsale, sold, deactivated)
  listingStatus: { 
    type: String,
    required: true,
    default: "forsale"
  },
  // Name of item user is selling
  listingName: {
    type: String,
    required: true
  },
  // Name of item user is selling
  listingLocation: {
    type: String,
    required: true,
    default: "none"
  },
  // Price of item user is selling
  listingPrice: {
    type: Number,
    required: true
  },
  // Payment method
  paymentUsername: {
    type: String,
    required: true,
    default: "none"
  },
  // Payment method
  paymentType: {
    type: String,
    required: true,
    default: "Venmo"
  },
  buyer: {
    // Use Types.ObjectId outside of the schema
    type: String,
    default: ""
  }
  // editedMerchant: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'MerchantFreet',
  //   default: []
  // }],
}, {
  toObject: { virtuals: true, versionKey: false },
  toJSON: { virtuals: true, versionKey: false }
});

MerchantFreetSchema.index({ freet: 1}, { unique: true });

const MerchantFreetModel = model<MerchantFreet>('MerchantFreet', MerchantFreetSchema);
export default MerchantFreetModel;
