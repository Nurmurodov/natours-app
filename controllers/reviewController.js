const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.setCreateBody = (req, res, next) => {
  req.body = {
    review: req.body.review,
    rating: req.body.rating,
    tour: req.body.tour,
    user: req.body.user
  };
  next();
};

exports.getAllReview = factory.getAll(Review)
exports.getReview = factory.getOne(Review)
exports.createReview = factory.createOne(Review);
exports.updateReviews = factory.updateOne(Review);
exports.deleteReviews = factory.deleteOne(Review);