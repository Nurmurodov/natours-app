const mongoose = require('mongoose');
const Tour = require('./tourModel')

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    rating: {
      type: Number,
      default: 4,
      min: 1,
      max: 5
    },
    createAt: {
      type: Date,
      default: Date.now
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong a tour!']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong a user!']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.index({tour: 1,user: 1},{unique: true})

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: { name: 1, photo: 1, '_id': 0 }
  }).populate({
    path: 'tour',
    select: { guides: 0, name: 1 }
  });
  next();
});


reviewSchema.statics.calcAverageRatings = async function(touId) {
  const stats = await this.aggregate([
    {
      $match: { tour: touId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  if(stats.length > 0) {
    await Tour.findByIdAndUpdate(touId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating
    })
  } else {
    await Tour.findByIdAndUpdate(touId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0
    })
  }
};

reviewSchema.post('save', function() {
  this.constructor.calcAverageRatings(this.tour)
})

reviewSchema.pre(/^findOneAnd/,async function(next) {
  this.r = await this.findOne()
  next()
})

reviewSchema.post(/^findOneAnd/,async function() {
  await this.r.constructor.calcAverageRatings(this.r.tour)
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;