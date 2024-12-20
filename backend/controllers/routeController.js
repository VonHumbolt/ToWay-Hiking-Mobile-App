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
    importantPoints,
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
      // importantPoints,
    });
    console.log("Route -> ", route);
    if (route.ownerId) addCreatedRoute(route);

    res.status(200).json(route);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const getFiveRoutesWithCityName = async (req, res) => {
  const { cityName } = req.params;
  try {
    const routes = await Route.find({ city: cityName, isPublic: true }).limit(5);
    res.status(200).json(routes);
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createRoute, getFiveRoutesWithCityName };
