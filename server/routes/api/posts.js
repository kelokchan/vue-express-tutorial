const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

// GET
router.get('/', async (req, res) => {
  const posts = await loadPostsCollection();
  res.send(await posts.find({}).toArray());
});

// POST
router.post('/', async (req, res) => {
  const posts = await loadPostsCollection();
  const { text } = req.body;
  posts.insertOne(
    {
      text,
      createdAt: new Date()
    },
    (err, result) => {
      console.log(result);
      
      res.status(201).send(result.ops[0]._id);
    }
  );
});

// DELETE
router.delete('/:id', async (req, res) => {
  const posts = await loadPostsCollection();
  await posts.deleteOne({
    _id: new mongodb.ObjectID(req.params.id)
  });
  res.status(200).send();
});

async function loadPostsCollection() {
  const client = await mongodb.MongoClient.connect(
    'mongodb://kelok:abc123@ds029837.mlab.com:29837/vue_express',
    {
      useNewUrlParser: true
    }
  );

  return client.db('vue_express').collection('posts');
}

module.exports = router;
