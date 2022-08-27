const Item = require("../models/Item");
const { ImageUpload } = require("../controllers/imageController");
//const Features = require("../utils/apiFeatures");

//ADD ITEM--Admin
const addItem = async (req, res) => {
  const value = req.body;
  req.body;
  const image = req.file.path;
  const product = await Item.create({
    name: value.name,
    description: value.description,
    category: value.category,
    price: value.price,
    stock: value.stock,
    image: image,
  });
  res.status(201).json({
    success: true,
    product,
  });
};

//Get/Search all item --User
const getAllItem = async (req, res) => {
  const pageSize = 12;

  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        $or: [
          {
            name: {
              $regex: req.query.keyword,
              $options: "i",
            },
          },
          {
            category: {
              $regex: req.query.keyword,
              $options: "i",
            },
          },
        ],
      }
    : {};

  const count = await Item.countDocuments({
    ...keyword,
  });

  const queryCopy = { ...req.query };

  //Removing some fields for category
  const removeFields = ["keyword", "page", "limit"];
  removeFields.forEach((key) => delete queryCopy[key]);

  const products = await Item.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  let filteredProducts;
  if (queryCopy.category) {
    filteredProducts = products.filter(
      (product) => product.category === queryCopy.category
    );
  }

  const filteredProductsCount = filteredProducts?.length;

  // const filteredProducts=await products.filter((product)=>product.category===queryCopy);
  // (filteredProducts);

  // .limit(pageSize)
  // .skip(pageSize * (page - 1));

  res
    .status(200)
    .json({ products, filteredProducts, count, filteredProductsCount });
  // } else {
  //   res.status(400).json({ message: "No match found" });
  // }
};

//Get all Item--Admin
const getAdminItem = async (req, res) => {
  const items = await Item.find();
  res.status(200).json({
    message: "API call successful",
    items,
  });
};

//get single item
const getSingleItem = async (req, res) => {
  const item = await Item.findById(req.params.id);
  item;
  if (!item) {
    return res.status(500).json({
      success: false,
      message: " Product not found",
    });
  }
  res.status(200).json({
    success: true,
    item,
  });
};

//update items/products --Admin
const updateItem = async (req, res) => {
  const value = req.body;
  let image;
  if (req.body.image) {
    image = req.body.image;
  } else {
    image = req.file.path;
  }
  const item = Item.findById(req.params.id);
  if (!item) {
    return res.status(500).json({
      success: false,
      message: " Product not found",
    });
  }
  const data = {
    name: value.name,
    description: value.description,
    category: value.category,
    price: value.price,
    stock: value.stock,
    image: image,
  };
  const product = await Item.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
    useFindandModify: false,
  });
  res.status(200).json({
    success: true,
  });
};

//delete item--Admin
const deleteItem = async (req, res) => {
  const item = Item.findById(req.params.id);

  if (!item) {
    return res.status(500).json({
      success: false,
      message: " Product not found",
    });
  }
  await item.deleteOne();
  res.status(200).json({
    success: true,
    message: "Item delete Successful",
  });
};

module.exports = {
  addItem,
  getAllItem,
  updateItem,
  deleteItem,
  getSingleItem,
  getAdminItem,
};
