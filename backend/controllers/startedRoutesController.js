const StartedRoutes = require("../models/startedRoutesModel");

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
  const { id, userCoordinates, distance } = req.body;
  try {
    const updatedRoute = await StartedRoutes.findByIdAndUpdate({_id: id}, {userCoordinates: userCoordinates, distance: distance});
    res.status(200).json({
      id: updatedRoute._id,
      isUpdated: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {startTracking, updateTracking}