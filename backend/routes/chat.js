const express= require('express');
const checkAuth= require('../middleware/check-auth');
const router = express.Router();
const ChatController = require('../controllers/chat');

router.post("", checkAuth,  ChatController.createChatMessage);

router.get("", checkAuth, ChatController.getChatMessages );

module.exports = router;
