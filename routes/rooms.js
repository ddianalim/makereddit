const express = require('express');
const auth = require('./helpers/auth');
const Room = require('../models/room');
const Post = require('../models/post');
const posts = require('./posts');

const router = express.Router();

// Rooms index
router.get('/', (req, res) => {
  Room.find({}, 'topic', (err, rooms) => {
    if (err) {
      console.error(err);
    } else {
      res.render('rooms/index', { rooms: rooms });
    }
  });
});

// Rooms new
router.get('/new', auth.requireLogin, (req, res) => {
  res.render('rooms/new');
});

router.get('/:id', auth.requireLogin, (req, res, next) => {
  Room.findById(req.params.id, function(err, room) {
    if(err) { console.error(err) };

    Post.find({ room: room }).sort({ points: -1 }).populate('comments').exec(function (err, posts) {
      if (err) { console.error(err) };

      res.render('rooms/show', { room: room, posts: posts, roomId: req.params.id });
    });
  });
});

// Rooms edit
router.get('/:id/edit', auth.requireLogin, (req, res) => {
  Room.findById(req.params.id, (err, room) => {
    if (err) { console.error(err); }

    res.render('rooms/edit', { room });
  });
});

// Rooms update
router.post('/:id', auth.requireLogin, (req, res) => {
  Room.findByIdAndUpdate(req.params.id, req.body, (err, room) => {
    if (err) { console.error(err); }

    res.redirect('/rooms/' + req.params.id);
  });
});

// Rooms create
router.post('/', auth.requireLogin, (req, res) => {
  let room = new Room(req.body);

  room.save((err, room) => {
    if (err) { console.error(err); }

    return res.redirect('/rooms');
  });
});

router.use('/:roomId/posts', posts);

module.exports = router;
