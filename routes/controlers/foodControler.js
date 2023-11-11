const { HttpError } = require("../../helpers/index");
const { FoodLog } = require("../../db/foodLogSchema");
const { validateFood } = require("../midleware/validateBody");
const { format } = require("date-fns");

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

    const result = await FoodLog.create({
      product: productId,
      date: formattedDate,
      amount,
      calories,
      owner: userId,
    });

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
    res.status(200).json({
      status: "success",
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
    const result = await FoodLog.find({ date: date, owner: userId });

    res.status(200).json({
      status: "success",
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
