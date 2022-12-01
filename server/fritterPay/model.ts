import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {MerchantFreet} from '../merchantFreet/model';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type FritterPay = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: Types.ObjectId; // references the parent Freet
  paymentType: string;
  paymentUsername: string;
  paymentLink?: string;
  merchantFreet?: Types.ObjectId;
};

export type PopulatedFritterPay = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: User; // references the parent Freet
  paymentType: string;
  paymentUsername: string;
  paymentLink?: string;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FritterPaySchema = new Schema<FritterPay>({
  // The parent freet
  user: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  paymentType: {
    type: String,
    required: true
  },
  paymentUsername: {
    type: String,
    required: true
  },
  paymentLink: {
    type: String,
    default: ""
  }
}, {
  toObject: { virtuals: true, versionKey: false },
  toJSON: { virtuals: true, versionKey: false }
});

const FritterPayModel = model<FritterPay>('FritterPay', FritterPaySchema);
export default FritterPayModel;
