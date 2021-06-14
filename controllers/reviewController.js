const Review = require('../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const ApiFeature = require('./../utils/apiFeatures');

exports.getAllReview = catchAsync(async (req, res, next) => {
  const features = new ApiFeature(Review.find(), req.query)
    .paginate();

  const reviews = await features.query;

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if(!req.body.user) req.body.user = req.user.id

  const newReview = await Review.create({
    review: req.body.review,
    rating: req.body.rating,
    tour: req.body.tour,
    user: req.body.user
  });

  res.status(201).json({
    status: 'success',
    data: {
      newReview
    }
  });
});