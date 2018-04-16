const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// create a schema
const eventSchema = new Schema({
  title: String,
  slug: {
    type: String,
    unique: true
  },
  email: [],
  description: String,
  location: String,
  day: String,
  hour: String,
  toHour: String,
  img: String
});
// create the model
const eventModel = mongoose.model('Event', eventSchema);

// export the model
module.exports = eventModel;
//middleware
//make sure that the slug is created from the title
eventSchema.pre('save', function(next) {
  this.slug = slugify(this.title);
  next();
});

//function to slugify a title
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}
