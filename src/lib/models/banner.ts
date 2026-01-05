import { Collection, Db, MongoClient, ObjectId } from 'mongodb';
import clientPromise from '../mongodb';

/* ================= TYPES ================= */

export type Banner = {
  id: string;

  /* CONTENT */
  heading: string;
  subHeading?: string;

  /* IMAGE */
  image: string;

  /* BUTTONS */
  button1Text: string;
  button1Link: string;

  button2Text?: string;
  productId?: string; // 🔥 product reference

  /* DISPLAY */
  position: 'HOME' | 'BRAND' | 'CATEGORY';
  order: number;
  status: 'active' | 'inactive';

  createdAt?: Date;
  updatedAt?: Date;
};

/* ================= INIT ================= */

let client: MongoClient;
let db: Db;
let banners: Collection<any>;

async function init() {
  if (banners) return;
  client = await clientPromise;
  db = client.db();
  banners = db.collection('banners');
}

/* ================= TRANSFORM ================= */

const toBanner = (doc: any): Banner => {
  const { _id, ...rest } = doc;

  return {
    id: _id.toString(),

    heading: rest.heading ?? '',
    subHeading: rest.subHeading ?? '',

    image: rest.image ?? '',

    button1Text: rest.button1Text ?? 'Get a Quote',
    button1Link: rest.button1Link ?? '/contact',

    button2Text: rest.button2Text ?? 'Find More',
    productId: rest.productId ?? undefined,

    position: rest.position ?? 'HOME',
    order: rest.order ?? 1,
    status: rest.status ?? 'inactive',

    createdAt: rest.createdAt,
    updatedAt: rest.updatedAt,
  };
};

/* ================= GET ALL ================= */

export const getBanners = async (): Promise<Banner[]> => {
  await init();

  const result = await banners
    .find({})
    .sort({ order: 1, createdAt: -1 })
    .toArray();

  return result.map(toBanner);
};

/* ================= GET BY ID ================= */

export const getBannerById = async (
  id: string
): Promise<Banner | null> => {
  await init();
  if (!ObjectId.isValid(id)) return null;

  const doc = await banners.findOne({
    _id: new ObjectId(id),
  });

  return doc ? toBanner(doc) : null;
};

/* ================= CREATE ================= */

export const createBanner = async (
  data: Omit<Banner, 'id'>
): Promise<Banner> => {
  await init();

  const doc = {
    heading: data.heading,
    subHeading: data.subHeading ?? '',

    image: data.image,

    button1Text: data.button1Text,
    button1Link: data.button1Link,

    button2Text: data.button2Text ?? '',
    productId: data.productId
      ? new ObjectId(data.productId)
      : undefined, // ✅ SAFE

    position: 'HOME', // 🔒 force home
    order: data.order ?? 1,
    status: data.status ?? 'inactive',

    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await banners.insertOne(doc);

  const saved = await banners.findOne({
    _id: result.insertedId,
  });

  if (!saved) throw new Error('Create failed');

  return toBanner(saved);
};

/* ================= UPDATE ================= */

export const updateBanner = async (
  id: string,
  data: Partial<Omit<Banner, 'id'>>
): Promise<Banner | null> => {
  await init();
  if (!ObjectId.isValid(id)) return null;

  const $set: any = { updatedAt: new Date() };

  if (data.heading !== undefined) $set.heading = data.heading;
  if (data.subHeading !== undefined)
    $set.subHeading = data.subHeading;

  if (data.image !== undefined) $set.image = data.image;

  if (data.button1Text !== undefined)
    $set.button1Text = data.button1Text;
  if (data.button1Link !== undefined)
    $set.button1Link = data.button1Link;

  if (data.button2Text !== undefined)
    $set.button2Text = data.button2Text;

  if (data.productId !== undefined)
    $set.productId = data.productId
      ? new ObjectId(data.productId)
      : undefined;

  if (data.position !== undefined) $set.position = data.position;
  if (data.order !== undefined) $set.order = data.order;
  if (data.status !== undefined) $set.status = data.status;

  if (Object.keys($set).length === 1) return null;

  const result = await banners.updateOne(
    { _id: new ObjectId(id) },
    { $set }
  );

  if (!result.matchedCount) return null;

  const updated = await banners.findOne({
    _id: new ObjectId(id),
  });

  return updated ? toBanner(updated) : null;
};

/* ================= DELETE ================= */

export const deleteBanner = async (
  id: string
): Promise<boolean> => {
  await init();
  if (!ObjectId.isValid(id)) return false;

  const result = await banners.deleteOne({
    _id: new ObjectId(id),
  });

  return result.deletedCount === 1;
};
