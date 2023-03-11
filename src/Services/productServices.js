// const cloudinary = require("../utils/cloudinary");
const formidable = require("formidable");
const configDb = require("../db");
// const fs = require("fs");

const createProduct = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();

    form.options.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Image could not be uploaded",
        });
      }

      // Checking for all fields
      const { name, price, category, description } = fields;

      if (!name || !price || !category || !description) {
        return res.status(400).json({ error: "All fields are required" });
      }

      let image;
      if (files.image) {
        if (files.image.size > 1000000) {
          return res.status(400).json({
            error: "Image should not be greater than 1mb",
          });
        }
        image = files.image.filepath;
      }

      configDb.query(
        `INSERT INTO Products(name, price, category, description, image) VALUES (?, ?, ?, ?, ?)`,
        [name, price, category, description, image],
        async (err, data) => {
          if (data.name > 0) {
            res.status(401).json({
              message: "Product already exists",
            });
          }
          res.status(201).json({
            message: "Product successfully created",
            user: data,
          });
        }
      );
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const updateProduct = (req, res) => {
  const { id } = req.params;

  const form = new formidable.IncomingForm();

  form.options.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }

    // Checking for all fields
    const { name, price, category, description } = fields;

    if (!name || !price || !category || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let image;
    if (files.image) {
      if (files.image.size > 1000000) {
        return res.status(400).json({
          error: "Image should not be greater than 1mb",
        });
      }
      image = files.image.filepath;
    }

    try {
      configDb.query(
        `UPDATE Products SET id=?, name=?, price=?, category=?, description=?, image=? WHERE id="${id}"`,
        [id, name, price, category, description, image],
        async (err, data) => {
          console.log(data, "DATA");
          res.status(200).json({
            message: "Product successfully updated",
            updateProduct: data,
          });
        }
      );
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  });
};

const deleteProduct = (req, res) => {
  const { id } = req.params;
  console.log("delete", id);

  try {
    configDb.query(
      `DELETE FROM Products WHERE id="${id}"`,
      async (err, data) => {
        res.status(200).json({
          message: "Product successfully deleted",
          updateProduct: data,
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getProducts = (req, res) => {
  try {
    configDb.query(`SELECT * FROM Products`, (err, products) => {
      res.status(200).json({
        message: "Product fetched",
        products: products,
      });
    });
  } catch (error) {
    return res.status(500).json({
      Message: "Something went wrong",
    });
  }
};

const getProductByName = (req, res) => {
  const { name } = req.query;
  try {
    configDb.query(
      `SELECT * FROM Products WHERE name=?`,
      [name],
      (err, product) => {
        res.status(200).json({
          message: "Product(s) fetched",
          products: product,
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const getAProduct = (req, res) => {
  const { id } = req.params;

  try {
    configDb.query(
      `SELECT * FROM Products WHERE id = ?`,
      [id],
      (err, product) => {
        if(product.length === 0) {
          res.status(404).json({
            message: 'Product not found',
          })
        } else {
          res.status(200).json({
            message: "Product fetched by id",
            products: product,
          });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductByName,
  getAProduct,
};
