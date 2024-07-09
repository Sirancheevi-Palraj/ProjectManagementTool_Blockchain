import { EthProvider } from "./contexts/EthContext";
import ProjectComponent from "./components/ProjectComponent";
import TaskComponent from "./components/TaskComponent";
import React, { useState } from "react";
import useEth from "./contexts/EthContext/useEth";
function App() {
  const { state: {web3, Projectartifact,TaskArtifact, accounts,TaskContract,ProjectContract,ProjectDetails, TaskDetails},loading,projects,Task } = useEth();
   
  const [viewProjects, setViewProjects] = useState(true);

  const showProjects = () => {
    setViewProjects(true);
    document.getElementById("PageTitle").innerHTML = "Project Management";
  };

  const showTasks = () => {
    setViewProjects(false);
    document.getElementById("PageTitle").innerHTML = "Task Management";
  };
  console.log("fromapp.jsx");
  console.log(Task);
  return (
    // <EthProvider>
    <div id="App">
      <div className="container">
        <h1 className="page-title" id="PageTitle">
          Project Management
        </h1>

        {/* Home Page Links */}
        <div className="text-center mb-4">
          <button className="btn btn-primary mr-3" onClick={showProjects}>
            View Projects
          </button>
          <button className="btn btn-primary" onClick={showTasks}>
            View Tasks
          </button>
        </div>

        {/* Render Project or Task Component based on state */}
        {
        web3 != null   
        ?(viewProjects ? <ProjectComponent projectDetails={projects}/> : <TaskComponent projectDetails={projects} TaskData={Task}/>) : <br />}
        {/* <Intro />
          <hr />
          <Setup />
          <hr />
          <Demo />
          <hr />
          <Footer /> */}
      </div>
      {/* </EthProvider> */}
    </div>
  );
}

export default App;
