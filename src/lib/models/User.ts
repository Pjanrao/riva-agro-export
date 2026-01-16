

import { Collection, Db, MongoClient, ObjectId } from 'mongodb';
import clientPromise from '../mongodb';
import type { User } from '../types';
import bcrypt from "bcryptjs";


let client: MongoClient;
let db: Db;
let users: Collection<Omit<User, 'id'>>;

async function init() {
  if (db) {
    return;
  }
  try {
    client = await clientPromise;
    db = client.db();
    users = db.collection('users');
  } catch (error) {
    throw new Error('Failed to connect to the database.');
  }
}

(async () => {
  await init();
})();

function toUser(doc: any): User {
    if (!doc) return doc;
    const { _id, ...rest } = doc;
    return { ...rest, _id: doc._id,id: _id.toHexString() };
}


export const resetUserPassword = async (
  hashedToken: string,
  newPassword: string
): Promise<boolean> => {
  if (!users) await init();

  const now = new Date();

  // Find user with valid token
  const user = await users.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: now },
  });

  if (!user) {
    return false;
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await users.updateOne(
    { _id: user._id },
    {
      $set: {
        password: hashedPassword,
      },
      $unset: {
        resetPasswordToken: "",
        resetPasswordExpire: "",
      },
    }
  );

  return true;
}; 


export const setResetPasswordToken = async (
  userId: string,
  token: string,
  expire: Date
): Promise<void> => {
  if (!users) await init();

  await users.updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        resetPasswordToken: token,
        resetPasswordExpire: expire,
      },
    }
  );
};


export const getUsers = async (): Promise<User[]> => {
    if (!users) await init();
    const result = await users.find({}).toArray();
    return result.map(doc => toUser(doc));
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
  if (!users) await init();
  
  const userDoc = await users.findOne({ email });

  if (!userDoc) {
    return null;
  }
  
  return toUser(userDoc);
};

export const findUserById = async (id: string): Promise<User | null> => {
    if (!users) await init();
    if (!ObjectId.isValid(id)) return null;

    const userDoc = await users.findOne({ _id: new ObjectId(id) });
    if (!userDoc) return null;
    return toUser(userDoc);
}

export const createUser = async (userData: Omit<User, 'id' | 'user_id'>): Promise<User> => {
  if (!users) await init();

  const user_id = `user_${Math.random().toString(36).substring(2, 9)}`;

  const result = await users.insertOne({ ...userData, user_id });
  const newUser = await users.findOne({_id: result.insertedId});
  if (!newUser) {
    throw new Error("Failed to create user");
  }
  return toUser(newUser);
}

export const deleteUser = async (id: string): Promise<boolean> => {
    if (!users) await init();
    if (!ObjectId.isValid(id)) return false;
    const result = await users.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
};

export const updateUserPasswordById = async (
  id: string,
  hashedPassword: string
): Promise<boolean> => {
  if (!users) await init();
  if (!ObjectId.isValid(id)) return false;

  const result = await users.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        password: hashedPassword,
        updatedAt: new Date().toISOString()
      },
    }
  );

  return result.modifiedCount === 1;
};



