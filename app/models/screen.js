/*
*  This is a model for the screens, it records the X, Y posistion of the screen and the callback URL for events
*/

var Sequelize   = require('sequelize');

module.exports = function(db)
{
   var Screen = db.define('screen',{
    // id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true },
     x: Sequelize.INTEGER,
     y: Sequelize.INTEGER,
     callback: {type:Sequelize.STRING, validate:{isUrl:true}},

   });

   return Screen;
}
