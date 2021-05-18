const express= require('express');
const checkAuth= require('../middleware/check-auth');
const router = express.Router();
const EventController = require('../controllers/events');

router.post("", checkAuth, EventController.createEvent);

router.put('/:id', checkAuth, EventController.updateEvent);

router.patch('/:id', checkAuth, EventController.updatePlayers);

router.get('', EventController.getEvents);

router.get("/:id", EventController.getEvent );

router.get("/searchcreator/:id", EventController.findEventsByCreator );

router.get("/searchplayer/:id", EventController.findEventsByPlayer );

router.get("/popular/true", EventController.findPopularEvents );

router.delete('/:id', checkAuth, EventController.deleteEvent);

module.exports = router;
