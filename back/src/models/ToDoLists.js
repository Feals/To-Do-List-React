const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ToDoLists = sequelize.define("ToDoLists", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  ToDoLists.associate = (models) => {
    ToDoLists.hasMany(models.Tasks, {
      foreignKey: "toDoListId",
      onDelete: "CASCADE",
    });
  };

  return ToDoLists;
};
