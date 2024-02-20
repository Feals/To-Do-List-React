const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Tasks = sequelize.define("Tasks", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    toDoListId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });

  Tasks.associate = (models) => {
    Tasks.belongsTo(models.ToDoLists, {
      foreignKey: "toDoListId",
      onDelete: "CASCADE",
    });
  };

  return Tasks;
};
