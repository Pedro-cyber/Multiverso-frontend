const bcrypt= require('bcryptjs');
const jwt = require( 'jsonwebtoken');
const User= require("../models/user");

exports.createUser = (req, res, next)=> {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user= new User({
    username: req.body.username,
    email: req.body.email,
    password: hash
    });
    user.save()
    .then(result => {
      res.status(201).json({
        message:'Usuario creado',
        result: result
      });
    })
    .catch(err =>{
      res.status(500).json({
          message: "El nombre o el email ya están en uso. Quizá ya esté registrado"
      })
    });
  });
}

exports.userLogin = (req, res, next)=> {
  let fetchedUser;
  User.findOne({email: req.body.email})
  .then(user => {
    if(!user){
      return res.status(401).json({
        message: "Email no encontrado"
      });
    }
      fetchedUser= user;
      return bcrypt.compare(req.body.password, user.password)
  })
  .then( result => {
    if(!result) {
      return res.status(401).json({
        message: "Contraseña incorrecta"
      });
    }
    const token= jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},
      "my-32-character-ultra-secure-and-ultra-long-secret",
      {expiresIn:'1h'});

    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id,
      username: fetchedUser.username
    });
})
  .catch( err => {
    return res.status(401).json({
      message: "Email o contraseña incorrectos"
    });
  });
}

exports.updateProfile = (req, res, next)=> {
  const user= new User({
    _id: req.body.id,
    username: req.body.username,
    avatar: req.body.avatar,
    email: req.body.email,
    password: req.body.password,
    favouritePlatform: req.body.favouritePlatform,
    favouritePlatformUsername: req.body.favouritePlatformUsername,
    favouritesGames: req.body.favouritesGames,
    favouritesGenres: req.body.favouritesGenres,
    aboutMe: req.body.aboutMe
  });
  User.updateOne({_id: req.params.id},user)
  .then(result=>{
    if (result.n > 0 ){
      res.status(200).json({ message: "Perfil actualizado!"});
    } else {
      res.status(401).json({ message: "No autorizado"});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Fallo en la actualización del perfil"
    })
  })
}

exports.getUserProfile =(req, res, next) =>{
  User.findById(req.params.id).then(user => {
    if(user){
      res.status(200).json(user);
    }else {
      res.status(404).json({message: 'Usuario no encontrado'});
    }
  })
  .catch( error => {
    res.status(500).json({
      message: "Fallo al extraer el usuario!"
    })
  });
}


