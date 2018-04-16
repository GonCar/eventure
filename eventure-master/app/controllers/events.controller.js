const Event = require('../models/event');
const mailer = require('../../services/mailer.service');

module.exports = {
  showEvents: showEvents,
  showSingle: showSingle,
  showCreate: showCreate,
  processCreate: processCreate,
  showEdit: showEdit,
  processEdit: processEdit,
  deleteEvent: deleteEvent,
  showPhotos: showPhotos
};

/**
 * Show all events
 */
function showEvents(req, res, next) {
  //get all events
  Event.find({})
    .then(events => {
      res.render('pages/events', { events });
    })
    .catch(error => {
      res.status(404);
      res.send('Event not Found!');
    });
}

/**
 * show single event page
 */
function showSingle(req, res) {
  Event.findOne({ slug: req.params.slug })
    .then(event => {
      if (event) {
        res.render('pages/single', {
          event: event,
          success: req.flash('success'),
          description: req.body.description,
          day: req.body.day,
          hour: req.body.hour,
          toHour: req.body.toHour,
          location: req.body.location,
          email: req.body.email
        });
      }
      res.redirect('/events');
    })
    .catch(error => {
      res.status(404);
      res.send('Event not Found!');
    });
}

/**
 * Show the create form
 */
function showCreate(req, res) {
  res.render('pages/create', {
    errors: req.flash('errors')
  });
}

/**
 * Process the form
 */
function processCreate(req, res, next) {
  console.log(req.body);
  // validate information
  req.checkBody('title', 'title is required').notEmpty();
  req.checkBody('description', 'description is required').notEmpty();
  req.checkBody('day', 'day is required').notEmpty();
  req.checkBody('location', 'location is required').notEmpty();

  //if there are errors, redirect and save errors to flash
  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors.map(err => err.msg));
    return res.redirect('create');
  }
  const event = new Event({
    title: req.body.title,
    description: req.body.description,
    day: req.body.day,
    hour: req.body.hour,
    toHour: req.body.toHour,
    location: req.body.location,
    email: req.body.emails // TODO: change moongose field type
  });

  //save event
  event.save(err => {
    if (err) {
      next(err);
    } else {
      const emails = req.body.emails;
      emails.forEach(email => {
        mailer.invite(email, event);
      });

      //set a succesful flash message
      req.flash('success', 'Successfuly created event');
      // redirect to the newly created event
      res.redirect(`/events/${event.slug}`);
    }
  });
}

// /**
//  * Show the edit form
//  */
function showEdit(req, res) {
  Event.findOne({ slug: req.params.slug }, (err, event) => {
    res.render('pages/edit', {
      event: event,
      errors: req.flash('errors')
    });
  });
}

// /**
//  * Process the edit form
//  */
function processEdit(req, res) {
  //finding a current event
  Event.findOne({ slug: req.params.slug }, (err, event) => {
    //updating that event
    event.title = req.body.title;
    event.description = req.body.description;
    event.day = req.body.day;
    event.hour = req.body.hour;
    event.toHour = req.body.toHour;
    event.location = req.body.location;
    email: req.body.email;
    event.save(err => {
      if (err) throw err;
      //redirect back to the events
      req.flash('success', 'ok');
      res.redirect('/events');
    });
  });
}

/**
 * Delete an event
 */
function deleteEvent(req, res) {
  Event.remove({ slug: req.params.slug }, err => {
    req.flash('success', 'ok');
    res.redirect('/events');
  });
}
/**
 * Send email
 */

/**
 * Photos view
 */
function showPhotos(req, res) {
  Event.findOne({ slug: req.params.slug }, (err, event) => {
    res.render('pages/eventphotos', {
      event: event,
      img: String
    });
  });
}
