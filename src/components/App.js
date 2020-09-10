import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../actions/actions";
import { exec } from "child_process";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Metrics from "./tabs/Metrics";
import Images from "./tabs/Images";
import Yml from "./tabs/Yml";
import Running from "./tabs/Running";
import Stopped from "./tabs/Stopped";
import { stderr } from "process";
import parseContainerFormat from "./helper/parseContainerFormat";
import "../../assets/styles.css";
import * as helper from "./helper/commands";

const App = (props) => {
  const dispatch = useDispatch();
  const addRunningContainers = (data) =>
    dispatch(actions.addRunningContainers(data));
  const addStoppedContainers = (data) =>
    dispatch(actions.addStoppedContainers(data));
  const addExistingImages = (data) => dispatch(actions.getImages(data));
  const refreshRunningContainers = (data) =>
    dispatch(actions.refreshRunningContainers(data));

  const runningList = useSelector((state) => state.lists.runningList);
  const stoppedList = useSelector((state) => state.lists.stoppedList);
  const imagesList = useSelector((state) => state.lists.imagesList);

  useEffect(() => {
    helper.addRunning(runningList, addRunningContainers);
    helper.addStopped(stoppedList, addStoppedContainers);
    helper.addImages(imagesList, addExistingImages);
    const interval = setInterval(() => {
      helper.refreshRunning(runningList, refreshRunningContainers);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="container">
        <nav className="tab">
          <header className="mainHeader">Docketeer</header>
          <ul>
            <li>
              <Link
                onClick={() =>
                  helper.addRunning(runningList, addRunningContainers)
                }
                to="/"
              >
                <i className="fas fa-box-open"></i> Running Containers
              </Link>
            </li>
            <li>
              <Link to="/stopped">
                <i className="fas fa-archive"></i> Exited Containers
              </Link>
            </li>
            <li>
              <Link to="/images">
                <i className="fas fa-database"></i> Images
              </Link>
            </li>
            <li>
              <Link to="/metrics">
                <i className="fas fa-chart-pie"></i> Metrics
              </Link>
            </li>
            <li>
              <Link to="/yml">
                <i className="fas fa-file-upload"></i> Docker Compose
              </Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/metrics">
            <Metrics showGeneralMetrics={helper.showGeneralMetrics} />
          </Route>
          <Route path="/yml">
            <Yml />
          </Route>
          <Route path="/images">
            <Images runIm={helper.runIm} removeIm={helper.removeIm} />
          </Route>
          <Route path="/stopped">
            <Stopped runStopped={helper.runStopped} remove={helper.remove} />
          </Route>
          <Route path="/">
            <Running runIm={helper.runIm} stop={helper.stop} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
