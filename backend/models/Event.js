const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    registrationLink: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for status: auto-calculate 'upcoming' or 'closed' based on whether event date has passed
eventSchema.virtual('status').get(function () {
  const today = new Date();
  return this.date >= today ? 'upcoming' : 'closed';
});

// Ensure virtuals are included in JSON/Object outputs
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
