const StartedRoutes = require("../models/startedRoutesModel");
const Route = require("../models/routeModel");
const User = require("../models/userModel");

const startTracking = async (req, res) => {
  const { userId, routeId, userCoordinates } = req.body;
  try {
    const startedRoute = await StartedRoutes.create({
      userId,
      routeId,
      userCoordinates,
      isRouteActive: true,
      isCompleted: false,
      distance: 0,
      duration: 0,
    });
    res.status(200).json({
      id: startedRoute._id,
      isRouteActive: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const updateTracking = async (req, res) => {
  const { id, userCoordinates, distance, duration } = req.body;
  console.log("backend --> ", userCoordinates, distance);
  try {
    const updatedRoute = await StartedRoutes.findByIdAndUpdate(
      { _id: id },
      {
        userCoordinates: userCoordinates,
        distance: distance,
        duration: duration,
      }
    );
    res.status(200).json({
      id: updatedRoute._id,
      isUpdated: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const completeTracking = async (req, res) => {
  const { id, userCoordinates, distance, duration } = req.body;
  try {
    const completedRoute = await StartedRoutes.findByIdAndUpdate(
      { _id: id },
      {
        userCoordinates: userCoordinates,
        distance: distance,
        duration: duration,
        isRouteActive: false,
        isCompleted: true,
      }
    );
    if(completedRoute.routeId) {
      // If user walks a route which is created.
      await Route.findByIdAndUpdate(
        { _id: completedRoute.routeId },
        { $inc: { numberOfCompletions: 1 } }
      );
      await User.findByIdAndUpdate(
        { _id: completedRoute.userId },
        {
          $inc: {
            totalNumberOfCompletedRoutes: 1,
            totalDistance: distance,
            totalElapsedTime: duration,
          },
          $push: { completedRoutes: completedRoute.routeId }
        }
      );
    } else {
      // If user walk without route
      await User.findByIdAndUpdate(
        { _id: completedRoute.userId },
        {
          $inc: {
            totalNumberOfCompletedRoutes: 1,
            totalDistance: distance,
            totalElapsedTime: duration,
          }
        }
      );
    }
    console.log(completedRoute);
    res.status(200).json({
      completedRoute: completedRoute,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const isUserHasActiveTracking = async (req, res) => {
  const {userId} = req.params
  try {
    const activeRoute = await StartedRoutes.findOne({userId: userId, isRouteActive: true})
    console.log("Active route ", activeRoute)
    res.status(200).json(activeRoute)
  } catch (error) {
    console.log(error)
    res.status(400).json({error: error.message})
  }
}

module.exports = { startTracking, updateTracking, completeTracking, isUserHasActiveTracking };
