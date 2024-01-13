const mongoose = require('mongoose');
require('dotenv').config()

const mongoDB = async () => {
  try {
      await mongoose.connect(process.env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('MongoDB connected successfully');

      const foodItemsCollection = mongoose.connection.db.collection("food_items");
      const foodCategoryCollection = mongoose.connection.db.collection("foodCategory");

      const data = await foodItemsCollection.find({}).toArray();
      const catData = await foodCategoryCollection.find({}).toArray();

      global.food_items = data;
      global.foodCategory = catData;
  } catch (error) {
      console.error('Error connecting to MongoDB:', error);
  }
};
module.exports = mongoDB;