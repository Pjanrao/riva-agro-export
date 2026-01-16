

// import { Collection, Db, MongoClient, ObjectId } from 'mongodb';
// import clientPromise from '../mongodb';
// import type { Order } from '../types';

// let client: MongoClient;
// let db: Db;
// let orders: Collection<Omit<Order, 'id'>>;

// async function init() {
//   if (db) {
//     return;
//   }
//   try {
//     client = await clientPromise;
//     db = client.db();
//     orders = db.collection('orders');
//   } catch (error) {
//     throw new Error('Failed to connect to the database.');
//   }
// }

// (async () => {
//   await init();
// })();

// function toOrder(doc: any): Order {
//     if (!doc) return doc;
//     const { _id, ...rest } = doc;
//     return { ...rest, id: _id.toHexString() } as Order;
// }

// export const getOrders = async (): Promise<Order[]> => {
//   if (!orders) await init();
//   const result = await orders.find({}).sort({ createdAt: -1 }).toArray();
//   return result.map(toOrder);
// };

// export const getOrderById = async (id: string): Promise<Order | null> => {
//     if (!orders) await init();
//     if (!ObjectId.isValid(id)) return null;
//     const doc = await orders.findOne({ _id: new ObjectId(id) });
//     if (!doc) return null;
//     return toOrder(doc);
// }

// export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
//     if (!orders) await init();
//     // The userId is stored as a string, so we query it directly.
//     const result = await orders.find({ userId: userId }).sort({ createdAt: -1 }).toArray();
//     return result.map(toOrder);
// }

// export const createOrder = async (data: Omit<Order, 'id' | '_id' | 'createdAt'>): Promise<Order> => {
//     if (!orders) await init();
    
//     const orderData = {
//         ...data,
//         createdAt: new Date().toISOString(),
//     };

//     const result = await orders.insertOne(orderData as Omit<Order, 'id'>);
    
//     const newOrder = await orders.findOne({ _id: result.insertedId });
//     if (!newOrder) {
//         throw new Error('Failed to create order');
//     }
//     return toOrder(newOrder);
// }

// export const updateOrderStatus = async (id: string, status: Order['status']): Promise<Order | null> => {
//     if (!orders) await init();
//     if (!ObjectId.isValid(id)) return null;

//     const result = await orders.findOneAndUpdate(
//         { _id: new ObjectId(id) },
//         { $set: { status } },
//         { returnDocument: 'after' }
//     );
    
//     const updatedDoc = (result as any)?.value ?? null;
//     if (!updatedDoc) return null;
//     return toOrder(updatedDoc);
// }

import { Collection, Db, MongoClient, ObjectId } from 'mongodb';
import clientPromise from '../mongodb';
import type { Order } from '../types';
import type { Customer } from "../types";

let client: MongoClient;
let db: Db;
let orders: Collection<Omit<Order, 'id'>>;
let users: Collection<any>;


async function init() {
  if (db) {
    return;
  }
  try {
    client = await clientPromise;
    db = client.db();
    orders = db.collection('orders');
    users = db.collection('users');
; // ✅ ADD THIS

  } catch (error) {
    throw new Error('Failed to connect to the database.');
  }
}

(async () => {
  await init();
})();

function toOrder(doc: any): Order {
    if (!doc) return doc;
    const { _id, ...rest } = doc;
    return { ...rest, id: _id.toHexString() } as Order;
}
async function attachCustomer(order: Order): Promise<Order> {
  if (!order.userId || typeof order.userId !== "string") {
    return order;
  }

  if (!ObjectId.isValid(order.userId)) {
    return order;
  }

  const user = await users.findOne({
    _id: new ObjectId(order.userId),
  });

  if (!user) return order;

  return {
    ...order,
    customerId: {
      _id: user._id,
      fullName: user.name,
      email: user.email,
      contactNo: user.contactNo,
      address: user.address,
      city: user.city,
      state: user.state,
      country: user.country,
      pin: user.pincode,
      latitude: user.latitude,
      longitude: user.longitude,
      createdAt: user.createdAt
        ? user.createdAt.toISOString()
        : undefined,
    },
  };
}




export const getOrders = async (): Promise<Order[]> => {
  if (!orders || !users) await init();

  const result = await orders
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const mapped = result.map(toOrder);

  return Promise.all(mapped.map(attachCustomer)); // 🔥 IMPORTANT
};


export const getOrderById = async (id: string): Promise<Order | null> => {
  if (!orders || !users) await init();
  if (!ObjectId.isValid(id)) return null;

  const doc = await orders.findOne({ _id: new ObjectId(id) });
  if (!doc) return null;

  const order = toOrder(doc);
  return attachCustomer(order); // 🔥 ADD THIS
};


export const getOrdersByUserId = async (
  userId: string
): Promise<Order[]> => {
  if (!orders || !users) await init();

  const result = await orders
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();

  const mapped = result.map(toOrder);
  return Promise.all(mapped.map(attachCustomer));
};


export const createOrder = async (data: Omit<Order, 'id' | '_id' | 'createdAt'>): Promise<Order> => {
    if (!orders) await init();
    
    const orderData = {
        ...data,
        createdAt: new Date().toISOString(),
    };

    const result = await orders.insertOne(orderData as Omit<Order, 'id'>);
    
    const newOrder = await orders.findOne({ _id: result.insertedId });
    if (!newOrder) {
        throw new Error('Failed to create order');
    }
    return toOrder(newOrder);
}

export const updateOrderStatus = async (id: string, status: Order['status']): Promise<Order | null> => {
    if (!orders) await init();
    if (!ObjectId.isValid(id)) return null;

    const result = await orders.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { status } },
        { returnDocument: 'after' }
    );
    
    const updatedDoc = (result as any)?.value ?? null;
    if (!updatedDoc) return null;
    return toOrder(updatedDoc);
}


