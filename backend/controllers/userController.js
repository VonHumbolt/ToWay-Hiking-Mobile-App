const User = require("../models/userModel");
const Route = require("../models/routeModel");
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
      totalNumberOfCompletedRoutes: user.totalNumberOfCompletedRoutes,
      totalDistance: user.totalDistance,
      totalElapsedTime: user.totalElapsedTime,
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
      {
        $push: { createdRoutes: route._id }
      }
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

const getUserSavedRoutes = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById({ _id: userId });
    if (!user)
      res.status(404).json({ error: "User was not found with given ID" });

    const savedRoutesList = []
    for (let i = 0; i < user.savedRoutes.length; i++) {
      const routeId = user.savedRoutes[i];
      const route = await Route.findById({_id: routeId})
      savedRoutesList.push(route)
    }
    res.status(200).json({
      savedRoutes: savedRoutesList
    })
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const searchUserByName = async (req, res) => {
  const {name} = req.params

  try {
    const users = await User.find({fullName: {$regex: name, $options: 'i'}}).select("userId fullName profilePicture").limit(5)
    res.status(200).json(users)
  } catch (error) {
    console.log(error)
    res.status(400).json({error: error.message})
  }
}

const getUserCompletedRoutes = async (req, res) => {
  const {userId} = req.params;
  try {
    const user = await User.findById({_id: userId})
    if (!user)
      res.status(404).json({ error: "User was not found with given ID" });

    const completedRouteList = []
    for (let i = 0; i < user.completedRoutes.length; i++) {
      const routeId = user.completedRoutes[i];
      const route = await Route.findById({_id: routeId})
      completedRouteList.push(route)
    }
    res.status(200).json({
      completedRoutes: completedRouteList
    }) 
  } catch (error) {
    console.log(error)
    res.status(400).json({error: error.message})
  }
}

const getUserCreatedRoutes = async (req, res) => {
  const {ownerId, profileId} = req.params;
  try {
    const createdRouteList = []
    
    const user = await User.findById({_id: profileId})
    // If user is in own profile, user can view all created routes without visibility problems.
    if(ownerId == profileId) {
      for (let i = 0; i < user.createdRoutes.length; i++) {
        const routeId = user.createdRoutes[i];
        const route = await Route.findById({_id: routeId})
        createdRouteList.push(route)
      }
    } else { // If user is in other user's profile, user can view only public visibility routes.
      for (let i = 0; i < user.createdRoutes.length; i++) {
        const routeId = user.createdRoutes[i];
        const route = await Route.findOne({_id: routeId, isPublic: true})
        createdRouteList.push(route)
      }
    }
    res.status(200).json({
      createdRoutes: createdRouteList
    }) 
  } catch (error) {
    console.log(error)
    res.status(400).json({error: error.message})
  }
}

const updateProfileImage = async (req, res) => {
  const {userId} = req.body
  try {
    await User.findByIdAndUpdate({_id: userId}, {profilePicture: req.files[0].path})
    res.status(200).json({isUpdated: true})
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
}

module.exports = {
  createAccount,
  addCreatedRoute,
  getUserById,
  saveRouteForUser,
  removeRouteFromUserSavedRoutes,
  isRouteInUserSavedRoutes,
  login,
  getUserSavedRoutes,
  searchUserByName,
  getUserCompletedRoutes,
  getUserCreatedRoutes,
  updateProfileImage,
};
