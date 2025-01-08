const Route = require("../models/routeModel");
const { addCreatedRoute } = require("./userController");

const createRoute = async (req, res) => {
  const {
    ownerId,
    title,
    description,
    duration,
    distance,
    level,
    country,
    city,
    categories,
    coordinates,
    isPublic,
  } = req.body;

  const parsedCategories = JSON.parse(categories);
  const parsedCoordinates = JSON.parse(coordinates);
  console.log(req.files);
  const routeImages = [];
  for (let i = 0; i < req.files.length; i++) {
    const image = req.files[i];
    routeImages.push(image.path);
  }
  try {
    const route = await Route.create({
      ownerId,
      title,
      description,
      duration,
      distance,
      level,
      country,
      city,
      categories: parsedCategories,
      coordinates: parsedCoordinates,
      isPublic,
      images: routeImages,
    });
    console.log("Route -> ", route);
    if (route.ownerId) addCreatedRoute(route);

    res.status(200).json(route);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const addImportantPointsToRoute = async (req, res) => {
  const { routeId, coordinate, title, description, pointType } = req.body;
  console.log(req.body);
  const parsedCoordinate = JSON.parse(coordinate);
  console.log(req.files);
  const pointImages = [];
  for (let i = 0; i < req.files.length; i++) {
    const image = req.files[i];
    pointImages.push(image.path);
  }
  const importantPoint = {
    coordinate: parsedCoordinate,
    title: title,
    description: description,
    pointType: pointType,
    images: pointImages,
  };
  try {
    const updatedRoute = await Route.findByIdAndUpdate(
      { _id: routeId },
      { $push: { importantPoints: importantPoint } }
    );

    console.log("Updated Route -> ", updatedRoute);
    console.log("ImportantPoint -> ", importantPoint);
    res.status(200).json(importantPoint);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const getFiveRoutesWithCityName = async (req, res) => {
  const { cityName } = req.params;
  try {
    const routes = await Route.find({ city: cityName, isPublic: true }).select('-comments').limit(
      5
    );
    res.status(200).json(routes);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const searchRoutesByCityName = async (req, res) => {
  const { cityName } = req.params;
  try {
    const routes = await Route.find({
      city: { $regex: cityName, $options: "i" },
    }).select('-comments').limit(5);
    res.status(200).json(routes);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const getRoutesByNumberOfCompletions = async (req, res) => {
  try {
    const routes = await Route.find({})
      .sort({ numberOfCompletions: "descending" })
      .select('-comments')
      .limit(5);
    res.status(200).json(routes);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const getRouteById = async (req, res) => {
  const {routeId} = req.params
  try {
    const route = await Route.findById({_id: routeId}).select('-comments')
    console.log(route)
    res.status(200).json(route);
  } catch (error) {
    console.log(error)
    res.status(400).json({error: error.message})
  }
}

module.exports = {
  createRoute,
  addImportantPointsToRoute,
  getFiveRoutesWithCityName,
  searchRoutesByCityName,
  getRoutesByNumberOfCompletions,
  getRouteById,
};
