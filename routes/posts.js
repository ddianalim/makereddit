const express = require('express');
const auth = require('./helpers/auth');
const Room = require('../models/room');
const Post = require('../models/post');
const comments = require('./comments');

const router = express.Router({ mergeParams: true });

router.get('/new', auth.requireLogin, (req, res, next) => {
  Room.findById(req.params.roomId, function(err, room) {
    if(err) { console.error(err) };

    res.render('posts/new', { room: room });
  });
});

router.post('/', auth.requireLogin, (req, res, next) => {
  Room.findById(req.params.roomId, function(err, room) {
    if(err) { console.error(err) };

    let post = new Post(req.body);
    post.room = room;

    post.save(function(err, post) {
      if(err) { console.error(err) };
      /* eslint-disable-next-line no-underscore-dangle */
      return res.redirect(`/rooms/${room._id}`);
    });
  });
});

router.post('/:id', auth.requireLogin, (req, res, next) => {
  Post.findById(req.params.id, function(err, post) {
    post.points += parseInt(req.body.points);

    post.save(function(err, post) {
      if(err) { console.error(err) };

      return res.redirect(`/rooms/${post.room}`);
    });
  });
});

router.use('/:postId/comments', comments);

module.exports = router;
