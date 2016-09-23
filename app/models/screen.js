/*
*  This is a model for the screens, it records the X, Y posistion of the screen and the callback URL for events
*/

var Sequelize   = require('sequelize');

module.exports = function(db)
{
   var Screen = db.define('screen',{
     name: {type:Sequelize.STRING, unique: 'name', allowNull: false},
     x: {type: Sequelize.INTEGER, unique: 'xy', allowNull: false},
     y: {type: Sequelize.INTEGER, unique: 'xy', allowNull: false},
     callback: {type:Sequelize.STRING, validate:{isUrl:true}}
   });

   return Screen;
}
