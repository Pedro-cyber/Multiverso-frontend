const express= require('express');
const checkAuth= require('../middleware/check-auth');
const router = express.Router();
const ChatController = require('../controllers/chat');

router.post("",  ChatController.createChatMessage);

router.get("",  ChatController.getChatMessages );

module.exports = router;
