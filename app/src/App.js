import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route} from "react-router-dom";

import Tasks from "./components/tasks.component";
import Login from "./components/login.component";
import Register from "./components/login.component";

function App() {
  return (
    <Router>
      <div className="container">
      <Route path="/" exact component={Login} />
      <Route path="/register" exact component={Register} />
      <Route path="/tasks" component={Tasks} />
      </div>
    </Router>
  );
}

export default App;
