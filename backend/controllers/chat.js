const Chat= require('../models/chat');


exports.createChatMessage=(req, res, next)=>{
  const chat = new Chat({
    message: req.body.message,
    username: req.body.username,
    date: req.body.date,
    event: req.body.event
  });
  chat.save().then(createdChatMessage => {
    res.status(201).json({
      message: 'Mensaje añadido satisfactoriamente',
      chatId: createdChatMessage._id
    });
  })
  .catch(error => {
    res.status(500).json({message: "Fallo al guardar el mensaje"});
  })
}

exports.getChatMessages = (req, res, next)=>{

  const eventId= req.query['event'];

  Chat.find( {event: eventId}).populate('username', 'username').sort({_id: -1}).limit(100)
    .then(documents => {
      res.status(200).json({
        message: "Mensajes extraidos correctamente ",
        chats: documents
    })
    })
    .catch( error => {
      res.status(500).json({
        message: "Fallo en la extracción de mensajes"
      })
    });
}
