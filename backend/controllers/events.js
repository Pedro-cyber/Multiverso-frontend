const Event= require('../models/event');

exports.createEvent=(req, res, next)=>{
  const event = new Event({
    title: req.body.title,
    game: req.body.game,
    genre: req.body.genre,
    platform: req.body.platform,
    description: req.body.description,
    connectionData: req.body.connectionData,
    numberPlayersMax: req.body.numberPlayersMax,
    date: req.body.date,
    image: req.body.image,
    creator: req.body.creator,
    players: req.body.players,
    popular: req.body.popular
  });
  event.save().then(createdEvent => {
    res.status(201).json({
      message: 'Partida creada satisfactoriamente',
      eventId: createdEvent._id
    });
  })
  .catch(error => {
    res.status(500).json({message: "Fallo al crear la partida"});
  })
}

exports.updateEvent = (req, res, next) => {
  const event= new Event({
    _id: req.body.id,
    title: req.body.title,
    game: req.body.game,
    genre: req.body.genre,
    platform: req.body.platform,
    description: req.body.description,
    connectionData: req.body.connectionData,
    numberPlayersMax: req.body.numberPlayersMax,
    date: req.body.date,
    image: req.body.image,
    creator: req.userData.userId,
    players: req.body.players,
    popular: req.body.popular
  });
  Event.updateOne({_id: req.params.id, creator: req.userData.userId},event)
  .then(result=>{
    if (result.n > 0 ){
      res.status(200).json({ message: "Partida actualizada!"});
    } else {
      res.status(401).json({ message: "No autorizado"});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Fallo en la actualización de la partida"
    })
  })
}

exports.getEvents = (req, res, next)=>{
  let eventQuery;
  let fetchedEvents;

  const pageSize = +req.query.pagesize;
  const currentPage= +req.query.page;
  const searchGame= req.query['game'];
  const searchPlatform= req.query['platform'];
  const searchGenre= req.query['genre'];

  if(searchGame){
    eventQuery = Event.find( {"game": {"$regex": searchGame, "$options":"i"}}).sort({date: 1})
  } else if (searchPlatform){
    eventQuery = Event.find( {platform: searchPlatform}).sort({date: 1})
  }else if(searchGenre){
    eventQuery = Event.find( {genre: searchGenre}).sort({date: 1})
  } else {
    eventQuery = Event.find().sort({date: 1});
  }

  if(pageSize && currentPage){
    eventQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  eventQuery
    .then(documents => {
      fetchedEvents= documents;
      return Event.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Partidas extraidas correctamente ",
        events: fetchedEvents,
        maxEvents: count
      });
    })
    .catch( error => {
      res.status(500).json({
        message: "Fallo en la extracción de partidas"
      })
    });
}

exports.getEvent =(req, res, next) =>{
  Event.findById(req.params.id).populate('creator', 'username').populate('players', 'username avatar').then(event => {
    if(event){
      res.status(200).json(event);
    }else {
      res.status(404).json({message: 'Partida no encontrada'});
    }
  })
  .catch( error => {
    res.status(500).json({
      message: "Fallo al extraer la partida!"
    })
  });
}

exports.deleteEvent = (req, res, next)=>{
  Event.deleteOne({_id: req.params.id, creator: req.userData.userId })
  .then( result =>{
    if (result.n > 0 ){
      res.status(200).json({ message: "Borrado satisfactorio!"});
    } else {
      res.status(401).json({ message: "No autorizado"});
    }
  })
  .catch( error => {
    res.status(500).json({
      message: "Fallo al borrar la partida!"
    })
  });
}

exports.updatePlayers = (req, res, next)=> {
  Event.findByIdAndUpdate(req.params.id,
  {
  $set: {
    "players": req.body}
  },
  function (err) {
    if (err) throw err
    res.status(200).json({ message: "Partida actualizada"});
  })
}

exports.findEventsByCreator = (req, res, next)=> {
  Event.find({creator: req.params.id})
  .then(events => res.json(events))
  .catch( err => res.status(401).json({message: "Error al extraer partidas!"}))
}

exports.findEventsByPlayer = (req, res, next)=> {
  Event.find({players: req.params.id})
  .then(events => res.json(events))
  .catch( err => res.status(401).json({message: "Error al extraer partidas!"}))
}

exports.findPopularEvents = (req, res, next)=> {
  Event.find({popular: true})
  .then(events => res.json(events))
  .catch( err => res.status(401).json({message: "No hay partidas populares!"}))
}



