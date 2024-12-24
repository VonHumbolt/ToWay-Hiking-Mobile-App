const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const generateToken = async (_id) => {
  return jwt.sign({ _id }, process.env.SECRET_KEY, { noTimestamp: true });
};

const createAccount = async (req, res) => {
  try {
    const user = await User.createAccount(req.body);
    const token = await generateToken(user._id);
    res.status(200).json({
      userId: user._id,
      email: user.email,
      city: user.city,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    console.log(user)
    const token = await generateToken(user._id);
    res.status(200).json({
      userId: user._id,
      email: user.email,
      city: user.city,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById({ _id: userId });
    if (!user)
      res.status(404).json({ error: "User was not found with given ID" });

    res.status(200).json({
      fullName: user.fullName,
      country: user.country,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addCreatedRoute = async (route) => {
  try {
    const result = await User.findByIdAndUpdate(
      { _id: route.ownerId },
      { createdRoutes: route._id }
    );
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const isRouteInUserSavedRoutes = async (req, res) => {
  const { routeId, userId } = req.params;
  try {
    const user = await User.findById({ _id: userId });
    if (!user)
      res.status(404).json({ error: "User was not found with given ID" });

    if (user.savedRoutes.includes(routeId)) {
      res.status(200).json({
        isSaved: true,
      });
    } else {
      res.status(200).json({
        isSaved: false,
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const saveRouteForUser = async (req, res) => {
  const { routeId, userId } = req.params;

  try {
    const user = await User.findById({ _id: userId });
    if (!user)
      res.status(404).json({ error: "User was not found with given ID" });

    if (!user.savedRoutes.includes(routeId)) {
      user.savedRoutes.push(routeId);
    }

    await User.findByIdAndUpdate(
      { _id: userId },
      { savedRoutes: user.savedRoutes }
    );

    res.status(200).json({
      userId: userId,
      routeId: routeId,
      isSaved: true,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const removeRouteFromUserSavedRoutes = async (req, res) => {
  const { routeId, userId } = req.params;

  try {
    const user = await User.findById({ _id: userId });
    if (!user)
      res.status(404).json({ error: "User was not found with given ID" });

    if (user.savedRoutes.includes(routeId)) {
      const newRoutes = user.savedRoutes.filter((r) => r != routeId);

      await User.findByIdAndUpdate({ _id: userId }, { savedRoutes: newRoutes });

      res.status(200).json({
        userId: userId,
        routeId: routeId,
        isSaved: false,
      });
    } else {
      res.status(400).json({ message: "Route is not saved!" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createAccount,
  addCreatedRoute,
  getUserById,
  saveRouteForUser,
  removeRouteFromUserSavedRoutes,
  isRouteInUserSavedRoutes,
  login
};
