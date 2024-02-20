const express = require("express");
const { Sequelize } = require("sequelize");
const sequelizeConfig = require("./sequelize.config");

const app = express();
app.use(express.json());
const port = 3001;

const sequelize = new Sequelize(sequelizeConfig.development);

const ToDoLists = require("./models/ToDoLists")(sequelize);
const Tasks = require("./models/Tasks")(sequelize);
ToDoLists.associate({ Tasks });

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Connection to BDD success.");

    await sequelize.sync();

    app.listen(port, () => {
      console.log(`Server already running to the port ${port}`);
    });
  } catch (error) {
    console.error("Error connection to BDD :", error);
  }
}

//CRUC TODOLISTS
app.get("/todolists", async (req, res) => {
  try {
    const allLists = await ToDoLists.findAll();
    res.status(200).json(allLists);
  } catch (error) {
    console.error("Error retrieving To Do Lists :", error);
    res.status(500).json({ error: "Error retrieving To Do Lists." });
  }
});

app.get("/nametodolist/:id", async (req, res) => {
  try {
    const toDoListId = req.params.id;
    const nameList = await ToDoLists.findOne({
      attributes: ["name"],
      where: { id: toDoListId },
    });
    res.status(200).json(nameList);
  } catch (error) {
    console.error("Error retrieving To Do Lists :", error);
    res.status(500).json({ error: "Error retrieving To Do Lists." });
  }
});

app.post("/todolists", async (req, res) => {
  try {
    const { name } = req.body;
    const newList = await ToDoLists.create({ name });
    res.status(201).json(newList);
  } catch (error) {
    console.error("Error creating a To Do List :", error);
    res.status(500).json({ error: "Error creating a To Do List." });
  }
});

app.put("/todolists/:id", async (req, res) => {
  try {
    const toDoListsId = req.params.id;
    const { name } = req.body;
    const updatedToDoLists = await ToDoLists.update(
      { name },
      { where: { id: toDoListsId } }
    );
    res.status(200).json(updatedToDoLists);
  } catch (error) {
    console.error("Error updating a To Do List :", error);
    res.status(500).json({ error: "Error updating a To Do List." });
  }
});

app.delete("/todolists/:id", async (req, res) => {
  try {
    const toDoListsId = req.params.id;
    await ToDoLists.destroy({ where: { id: toDoListsId } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting a To Do List :", error);
    res.status(500).json({ error: "Error deleting a To Do List." });
  }
});

// CRUD TASKS
app.get("/tasks/:id", async (req, res) => {
  try {
    const toDoListId = req.params.id;
    const tasksForList = await Tasks.findAll({ where: { toDoListId } });
    res.status(200).json(tasksForList);
  } catch (error) {
    console.error("Error retrieving Tasks :", error);
    res.status(500).json({ error: "Error retrieving Tasks." });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const { description, toDoListId } = req.body;
    const newTask = await Tasks.create({
      description,
      toDoListId,
      completed: false,
    });
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating a Task :", error);
    res.status(500).json({ error: "Error creating a Task." });
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const { description, completed } = req.body;
    const updatedTask = await Tasks.update(
      { description, completed },
      { where: { id: taskId } }
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating a Task :", error);
    res.status(500).json({ error: "Error updating a Task." });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    await Tasks.destroy({ where: { id: taskId } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting a Task :", error);
    res.status(500).json({ error: "Error deleting a Task ." });
  }
});

app.delete("/tasks/completed/:id", async (req, res) => {
  try {
    const toDoListId = req.params.id;
    await Tasks.destroy({
      where: { completed: true, toDoListId: toDoListId },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting Tasks completed :", error);
    res.status(500).json({ error: "Error deleting Tasks completed." });
  }
});

// Gestion des erreurs
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({ flash: "Error Server" });
});

startServer();
