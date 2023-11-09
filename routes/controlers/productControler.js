const fs = require("fs").promises;
const path = require("path");
const { HttpError } = require("../../helpers/index");
// const { Contact } = require("../../db/contactsSchema");
// const { validateContact } = require("../midleware/validateBody");
const { Product } = require("../../db/productSchema");

const filePath = path.join(
  __dirname,
  "../",
  "../",
  "db",
  "productsCategories.json"
);
console.log("🚀 ~ file: productControler.js:9 ~ filePath:", filePath);
// const getContacts = async (req, res, next) => {
//   try {
//     const userId = req.user._id;
//     const { page = 1, limit = 10, favorite } = req.query;
//     const filter = { owner: userId };

//     if (favorite !== undefined) {
//       filter.favorite = favorite === "true";
//     }
//     const skip = (page - 1) * limit;

//     const result = await Contact.find(filter)
//       .skip(skip)
//       .limit(parseInt(limit, 10));
//     res.json({
//       status: "success",
//       code: 200,
//       data: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const getProducts = async (req, res, next) => {
  try {
    const result = await Product.find();

    if (!result) {
      throw HttpError(404, "Not Found!");
    }
    res.json({
      status: "success",
      code: 200,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getProductsCategories = async (req, res, next) => {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const result = JSON.parse(fileContent);

    if (!result) {
      throw HttpError(404, "Not Found!");
    }
    res.json({
      status: "success",
      code: 200,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// const createContact = async (req, res, next) => {
//   try {
//     const { name, email, phone } = req.body;
//     if (!name || !email || !phone) {
//       throw HttpError(400, "missing required name field");
//     }
//     const { error } = validateContact({ name, email, phone });

//     if (error) {
//       throw HttpError(400, error.details[0].message);
//     }

//     const userId = req.user._id;

//     if (name && email && phone) {
//       const result = await Contact.create({
//         name,
//         email,
//         phone,
//         owner: userId,
//       });
//       res.json({
//         status: "success",
//         code: 201,
//         data: result,
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

// const deleteContact = async (req, res, next) => {
//   try {
//     const { contactId } = req.params;
//     const userId = req.user._id;

//     const result = await Contact.findOneAndRemove({
//       _id: contactId,
//       owner: userId,
//     });

//     if (!result) {
//       throw HttpError(404, "Contact Not Found or You're Not the Owner!");
//     }

//     res.json({
//       status: "Contact deleted",
//       code: 200,
//       data: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const updateContact = async (req, res, next) => {
//   try {
//     const { contactId } = req.params;
//     const body = req.body;
//     const userId = req.user._id;

//     const { name, email, phone } = body;
//     const { error } = validateContact(body);

//     if (error) {
//       throw HttpError(400, error.details[0].message);
//     }

//     if (!body) {
//       throw HttpError(400, "Missing contact data");
//     }

//     const result = await Contact.findOneAndUpdate(
//       { _id: contactId, owner: userId },
//       { name, email, phone },
//       { new: true }
//     );

//     if (!result) {
//       throw HttpError(404, "Contact Not Found or You're Not the Owner!");
//     }

//     res.json({
//       status: "Contact updated",
//       code: 200,
//       data: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const updateContactFavorite = async (req, res, next) => {
//   try {
//     const { contactId } = req.params;
//     const userId = req.user._id;
//     const { favorite } = req.body;

//     if (favorite === undefined) {
//       return res.status(400).json({ message: "Missing field favorite" });
//     }

//     const result = await Contact.findOneAndUpdate(
//       { _id: contactId, owner: userId },
//       { favorite },
//       { new: true }
//     );

//     if (!result) {
//       throw HttpError(404, "Contact Not Found or You're Not the Owner!");
//     }

//     res.json({
//       status: "Contact updated",
//       code: 200,
//       data: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = {
  // getContacts,
  // getContact,
  // createContact,
  // deleteContact,
  // updateContact,
  // updateContactFavorite,
  getProducts,
  getProductsCategories,
};
