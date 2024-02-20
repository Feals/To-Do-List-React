import Footer from "../footer";
import Header from "../header";
import MyToDoLists from "../myToDOLists";
import "../../styles/styleglobal.scss";

function Homepage() {
  return (
    <div className="mainContent">
      <Header />
      <MyToDoLists />
      <Footer />
    </div>
  );
}

export default Homepage;
