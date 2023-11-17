const { HttpError } = require("../../helpers/index");
const { FoodLog } = require("../../db/foodLogSchema");
const { Product } = require("../../db/productSchema");
const { validateFood } = require("../midleware/validateBody");
const { format } = require("date-fns");
const { User } = require("../../db/usersSchema");

const updateFood = async (req, res, next) => {
  try {
    const { productId, amount, calories, date } = req.body;
    const userId = req.user._id;
    let logDate;
    if (date) {
      logDate = new Date(date);
    } else {
      logDate = new Date();
    }
    const formattedDate = format(logDate, "dd/MM/yyyy");

    const { error } = validateFood({ amount, calories });

    if (error) {
      throw HttpError(400, error.details[0].message);
    }
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    const isProductAllowed = (product, user) => {
      const userBloodGroup = user.blood.toString();
      return product.groupBloodNotAllowed[userBloodGroup] !== true;
    };

    const result = await FoodLog.create({
      product: product._id,
      title: product.title,
      category: product.category,
      date: formattedDate,
      recommend: isProductAllowed(product, user),
      amount,
      calories,
      owner: userId,
    });
    if (!result) {
      throw HttpError(400, "Somethin went wrong");
    }

    res.json({
      status: "success",
      code: 200,
      result,
    });
  } catch (error) {
    next(error);
  }
};

const removeFood = async (req, res, next) => {
  try {
    const { foodId } = req.params;
    const userId = req.user._id;
    const deletedFood = await FoodLog.findOneAndRemove({
      _id: foodId,
      owner: userId,
    });
    if (!deletedFood) {
      throw HttpError(404, "Cant`t find that eaten food, or you not the owner");
    }
    res.status(200).json({
      status: "Food has been successfully deleted",
      code: 200,
      deletedFood,
    });
  } catch (error) {
    next(error);
  }
};

const getFoodByDate = async (req, res, next) => {
  try {
    const { date } = req.query;
    const userId = req.user._id;
    if (!date) {
      throw HttpError(400, "Date parameter is required");
    }

    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(date)) {
      throw HttpError(400, "Invalid date format. Please use MM/DD/YYYY");
    }
    const result = await FoodLog.find({ date: date, owner: userId });

    if (!result.length) {
      throw HttpError(404, "Food logs not found for the specified date");
    }

    res.status(200).json({
      status: `List of eaten food in ${date}`,
      code: 200,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateFood,
  removeFood,
  getFoodByDate,
};
