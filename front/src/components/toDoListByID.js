import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTasks,
  addTask,
  toggleTask,
  deleteTask,
  editTask,
  deleteTaskCompleted,
} from "../tasksSlice";
import { Link, useParams } from "react-router-dom";

function ToDOListById() {
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [editedTaskDescription, setEditedTaskDescription] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [toDoListName, setToDoListName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();

  const { id: urlId } = useParams();

  useEffect(() => {
    fetch(`/tasks/${urlId}`)
      .then((response) => response.json())
      .then((data) => {
        dispatch(setTasks(data));
      })
      .catch((error) => {
        console.error("Error retrieving Tasks :", error);
        setErrorMessage("Error retrieving Tasks.");
      });
  }, [dispatch, urlId]);

  useEffect(() => {
    fetch(`/nametodolist/${urlId}`)
      .then((response) => response.json())
      .then((data) => {
        setToDoListName(data.name);
        setErrorMessage("");
      })
      .catch((error) => {
        console.error("Error retrieving To Do List 's name :", error);
        setErrorMessage("Error retrieving To Do List's name.");
      });
  }, [urlId]);

  const tasks = useSelector((state) => state.tasks.arrayTasks);

  const handleAddTask = async () => {
    if (newTaskDescription.trim() !== "") {
      try {
        const response = await fetch("/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            description: newTaskDescription,
            toDoListId: urlId,
          }),
        });
        if (response.ok) {
          const newData = await response.json();

          dispatch(addTask(newData));
          setNewTaskDescription("");
          setErrorMessage("");
        } else {
          console.error("Error adding a Task.");
          setErrorMessage("Error adding a Task.");
        }
      } catch (error) {
        console.error("Network error adding a Task :", error);
        setErrorMessage("Network error adding a Task.");
      }
    }
  };

  const handleCheckboxChange = async (taskId) => {
    try {
      const response = await fetch(`/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !tasks.find((task) => task.id === taskId).completed,
        }),
      });
      if (response.ok) {
        dispatch(toggleTask(taskId));
        setErrorMessage("");
      } else {
        console.error("Error editing a Task.");
        setErrorMessage("Error editing a Task.");
      }
    } catch (error) {
      console.error("Network error editing a Task :", error);
      setErrorMessage("Network error editing a Task.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        dispatch(deleteTask(taskId));
        setErrorMessage("");
      } else {
        console.error("Error deleting a Task.");
        setErrorMessage("Error deleting a Task.");
      }
    } catch (error) {
      console.error("Network error deleting a Task :", error);
      setErrorMessage("Network error deleting a Task.");
    }
  };

  const handleEditTask = (taskId) => {
    setEditingTaskId(taskId);
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setEditedTaskDescription(taskToEdit.description);
  };

  const handleSaveEdit = async () => {
    if (editedTaskDescription.trim() !== "") {
      try {
        const response = await fetch(`/tasks/${editingTaskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ description: editedTaskDescription }),
        });

        if (response.ok) {
          dispatch(
            editTask({
              taskId: editingTaskId,
              newDescription: editedTaskDescription,
            })
          );
          setEditingTaskId(null);
          setErrorMessage("");
        } else {
          console.error("Error editing a Task.");
          setErrorMessage("Error editing a Task.");
        }
      } catch (error) {
        console.error("Network error editing a Task :", error);
        setErrorMessage("Network error editing a Task.");
      }
    }
  };

  const handleDeleteCompletedTasks = async () => {
    try {
      const response = await fetch(`/tasks/completed/${urlId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        dispatch(deleteTaskCompleted(urlId));
        setErrorMessage("");
      } else {
        console.error("Error deleting Tasks completed.");
        setErrorMessage("Error deleting Tasks completed.");
      }
    } catch (error) {
      console.error("Network error deleting Tasks completed :", error);
      setErrorMessage("Network error deleting Tasks completed.");
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
  };

  const isAddButtonDisabled =
    newTaskDescription.trim() === "" || newTaskDescription.length > 50;
  const isSaveButtonDisabled =
    editedTaskDescription.trim() === "" || editedTaskDescription.length > 50;

  return (
    <div>
      <Link to={`/`}>
        <p>⬅ Retour Accueil</p>
      </Link>
      <h2>{toDoListName}</h2>
      <div className="alltodo">
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {tasks.length ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`mytodolist ${task.completed ? "task_completed" : ""}`}
            >
              {editingTaskId !== task.id ? (
                <label>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleCheckboxChange(task.id)}
                  />
                  <p>{task.description}</p>
                </label>
              ) : (
                <>
                  <input
                    type="text"
                    value={editedTaskDescription}
                    onChange={(e) => setEditedTaskDescription(e.target.value)}
                    maxLength={50}
                  />
                  <button
                    onClick={handleSaveEdit}
                    disabled={isSaveButtonDisabled}
                    className={
                      editedTaskDescription.trim() === ""
                        ? "button_disabled"
                        : null
                    }
                  >
                    Enregistrer
                  </button>
                  <button onClick={handleCancelEdit}>Annuler</button>
                </>
              )}
              <div className="editNameandDeleteToDo">
                {editingTaskId !== task.id ? (
                  <div className="editName">
                    <button onClick={() => handleEditTask(task.id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </button>
                  </div>
                ) : null}
                {editingTaskId !== task.id ? (
                  <div className="deleteToDoList">
                    <button onClick={() => handleDeleteTask(task.id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <p>Aucune Tâche n'a été créée</p>
        )}

        <div className="row"></div>
        <div className="createToDo">
          <input
            type="text"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="Nom de la nouvelle tâche"
            maxLength={50}
          />
          <button onClick={handleAddTask} disabled={isAddButtonDisabled}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`w-6 h-6 ${
                newTaskDescription.trim() === "" ? "button_disabled" : ""
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
        </div>
        <div className="row"></div>
        <div className="deleteAllTasks">
          <button onClick={handleDeleteCompletedTasks}>
            <span>Supprimer toutes les tâches terminées</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ToDOListById;
