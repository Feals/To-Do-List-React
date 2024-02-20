import Footer from "../footer";
import Header from "../header";
import ToDoListById from "../toDoListByID";
import "../../styles/styleglobal.scss";

function ToDoList() {
  return (
    <div>
      <Header />
      <ToDoListById />
      <Footer />
    </div>
  );
}

export default ToDoList;
