import { MerchantFreet } from '../merchantFreet/model';
import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Freet = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  dateCreated: Date;
  content: string;
  dateModified: Date;
  expiration: Date; // For Fleeting Freets 
  freetType: string; // Type of Freet (Default, Merchant, Fleeting)
  merchantFreet?: Types.ObjectId;
  edited: Boolean;
  // editedFreets: Array<Types.ObjectId>; 
};

export type PopulatedFreet = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  dateCreated: Date;
  content: string;
  dateModified: Date;
  expiration: Date; // For Fleeting Freets
  freetType: string; // Type of Freet (Default, Merchant, Fleeting)
  merchantFreet?: Types.ObjectId;
  edited: Boolean;
  // editedFreets: Array<Types.ObjectId>; 
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FreetSchema = new Schema<Freet>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The date the freet was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The content of the freet
  content: {
    type: String,
    required: true
  },
  // The date the freet was modified
  dateModified: {
    type: Date,
    required: true
  },
  // editedFreets: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'Freet',
  //   default: []
  // }],
  expiration: {
    type: Date,
    required: true,
    default: new Date ("4000-01-01")
  },
  freetType: {
    type: String,
    required: true
  },
  edited:{
    type: Boolean,
    required: true,
    default: false
  }},
  {
    toObject: { virtuals: true, versionKey: false },
    toJSON: { virtuals: true, versionKey: false }
  });

// Auto-populate a Freet.merchantFreet field with any merchant freets are associated with this freet such that freet._id === merchantFreet.freet._id
FreetSchema.virtual('merchantFreet', {
  ref: 'MerchantFreet',
  localField: '_id',
  foreignField: 'freet'
});

const FreetModel = model<Freet>('Freet', FreetSchema);
export default FreetModel;
