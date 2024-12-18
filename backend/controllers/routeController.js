const Route = require("../models/routeModel")

const createRoute = async (req, res) => {
  console.log(req.files)

  res.status(200).json({message: "OK"});
};

module.exports = { createRoute };