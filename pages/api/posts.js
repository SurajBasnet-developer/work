import { MongoClient } from "mongodb";

async function connectToDatabase() {
  const client = await MongoClient.connect(
    "String of MongoDB connection"
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  return client.db();
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase();
    const collection = db.collection("blog");

    const posts = await collection.find().toArray();
    res.status(200).json(posts);
  } else if (req.method === "POST") {
    const { title, content } = req.body;

    if (!title || !content) {
      res.status(400).json({ error: "Title and content are required." });
      return;
    }

    const db = await connectToDatabase();
    const collection = db.collection("blog");

    const post = { title, content };
    const result = await collection.insertOne(post);

    res.status(201).json({
      message: "Post created successfully",
      post_id: result.insertedId,
    });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
