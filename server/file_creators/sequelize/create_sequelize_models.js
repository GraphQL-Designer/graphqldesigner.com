module.exports = function(table) {
    let query = `module.exports = function(sequelize, DataTypes) {
const ${table.type} = sequelize.define('${table.type}', {`

    for (const i in table.fields) {
        
    }
    
    return query;
};


// module.exports = function(sequelize, DataTypes) {
//     const User = sequelize.define('User', {
//       username: {
//         type: DataTypes.STRING,
//         unique: true,
//       },
//       isAdmin: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false,
//       },
//     });
  
//     User.associate = (models) => {
//       // 1 to many with board
//       User.hasMany(models.Board, {
//         foreignKey: 'owner',
//       });
//       // 1 to many with suggestion
//       User.hasMany(models.Suggestion, {
//         foreignKey: 'creatorId',
//       });
//     };
  
//     return User;
//   };
  