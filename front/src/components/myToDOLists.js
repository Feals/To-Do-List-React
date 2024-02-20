import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setToDoLists,
  addListTask,
  deleteListTask,
  changeNameListTasks,
} from "../listTasksSlice";

function MyToDoLists() {
  const [newListTaskName, setNewListTaskName] = useState("");
  const [editedListTaskName, setEditedListTaskName] = useState("");
  const [editingListTaskId, setEditingListTaskId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    fetch("/todolists")
      .then((response) => response.json())
      .then((data) => {
        dispatch(setToDoLists(data));
        setErrorMessage("");
      })
      .catch((error) => {
        console.error("Erreur retrieving To Do Lists :", error);
        setErrorMessage("Erreur de connexion au serveur.");
      });
  }, [dispatch]);

  const allToDoLists = useSelector((state) => state.listTasks.arrayListTasks);

  const handleAddListTask = async () => {
    if (newListTaskName.trim() !== "") {
      try {
        const response = await fetch("/todolists", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newListTaskName }),
        });

        if (response.ok) {
          const newData = await response.json();
          dispatch(addListTask(newData));
          setNewListTaskName("");
          setErrorMessage("");
        } else {
          console.error("Error adding a To Do List.");
          setErrorMessage("Error adding a To Do List.");
        }
      } catch (error) {
        console.error("Network error adding a To Do List :", error);
        setErrorMessage("Network error adding a To Do List.");
      }
    }
  };

  const handleDeleteListTask = async (listTasksId) => {
    try {
      const response = await fetch(`/todolists/${listTasksId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        dispatch(deleteListTask(listTasksId));
        setErrorMessage("");
      } else {
        console.error("Error deleting a To Do List.");
        setErrorMessage("Error deleting a To Do List.");
      }
    } catch (error) {
      console.error("Network error deleting a To Do List :", error);
      setErrorMessage("Network error deleting a To Do List.");
    }
  };

  const handleEditListTask = (listTasksId) => {
    setEditingListTaskId(listTasksId);
    const listTaskToEdit = allToDoLists.find((task) => task.id === listTasksId);
    setEditedListTaskName(listTaskToEdit.name);
  };

  const handleSaveEdit = async () => {
    if (editedListTaskName.trim() !== "") {
      try {
        const response = await fetch(`/todolists/${editingListTaskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: editedListTaskName }),
        });

        if (response.ok) {
          dispatch(
            changeNameListTasks({
              listTasksId: editingListTaskId,
              newName: editedListTaskName,
            })
          );
          setEditingListTaskId(null);
          setErrorMessage("");
        } else {
          console.error("Error editing a To Do List.");
          setErrorMessage("Error editing a To Do List.");
        }
      } catch (error) {
        console.error("Network error editing a To Do List :", error);
        setErrorMessage("Network error editing a To Do List.");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingListTaskId(null);
  };

  const isAddButtonDisabled =
    newListTaskName.trim() === "" || newListTaskName.length > 50;

  const isSaveButtonDisabled =
    editedListTaskName.trim() === "" || editedListTaskName.length > 50;

  return (
    <div className="alltodo">
      <h2>Mes To Do Lists</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {allToDoLists.length > 0 ? (
        allToDoLists.map((toDoList) => (
          <div className="mytodolist" key={toDoList.id}>
            {editingListTaskId !== toDoList.id && (
              <Link to={`/toDoList/${toDoList.id}`} className={toDoList.id}>
                {toDoList.name}
              </Link>
            )}
            <div className="editNameandDeleteToDo">
              <div className="editName">
                {editingListTaskId === toDoList.id ? (
                  <>
                    <input
                      type="text"
                      value={editedListTaskName}
                      onChange={(e) => setEditedListTaskName(e.target.value)}
                    />
                    <button
                      onClick={handleSaveEdit}
                      disabled={isSaveButtonDisabled}
                      className={
                        editedListTaskName.trim() === ""
                          ? "button_disabled"
                          : null
                      }
                    >
                      Enregistrer
                    </button>
                    <button onClick={handleCancelEdit}>Annuler</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditListTask(toDoList.id)}>
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
                  </>
                )}
              </div>
              {editingListTaskId !== toDoList.id ? (
                <div className="deleteTodoList">
                  <button onClick={() => handleDeleteListTask(toDoList.id)}>
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
        <p>Aucune To Do List n'a été créée</p>
      )}
      <div className="row"></div>
      <div className="createToDo">
        <input
          type="text"
          value={newListTaskName}
          onChange={(e) => setNewListTaskName(e.target.value)}
          placeholder="Nom de la nouvelle liste de tâche"
          maxLength={50}
        />
        <button onClick={handleAddListTask} disabled={isAddButtonDisabled}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={`w-6 h-6 ${
              newListTaskName.trim() === "" ? "button_disabled" : ""
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
    </div>
  );
}

export default MyToDoLists;
