import React, { useReducer, useCallback, useState, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [projects, setProjects] = useState([]);
  const [Task, setTask] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state

  const init = useCallback(async (Projectartifact, TaskArtifact) => {
    if (Projectartifact && TaskArtifact) {
      const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
      const accounts = await web3.eth.requestAccounts();
      const networkID = await web3.eth.net.getId();
      const { abi } = Projectartifact;
      const { Taskabi } = TaskArtifact;
      let ProjectAddress, ProjectContract, TaskAddress, TaskContract;
      try {
        ProjectAddress = Projectartifact.networks[networkID].address;
        ProjectContract = new web3.eth.Contract(abi, ProjectAddress);
        TaskAddress = TaskArtifact.networks[networkID].address;
        TaskContract = new web3.eth.Contract(TaskArtifact.abi, TaskAddress);

        //Get Project Details
        const projectIDs = await ProjectContract.methods
          .getAllProjectIDs()
          .call();
        const projectDetails = await Promise.all(
          projectIDs.map(async (id) => {
            const details = await ProjectContract.methods
              .GetProjectData(id)
              .call({ from: accounts[0] });
            return {
              id,
              name: details.ProjectName,
              budget: details.Budget,
              resourceCount: details.ResourceCount,
              resourceDetails: details.ResourceDetails,
              status: details.Status,
              remarks: details.Remarks,
            };
          })
        );
        setProjects(projectDetails);

        //Get Task Details
        const TaskIDs = await TaskContract.methods.getAllTaskIDs().call();


        const TaskDetails = await Promise.all(
          TaskIDs.map(async (id) => {
            const details = await TaskContract.methods
              .GetTask(id)
              .call({ from: accounts[0] });
            return {
              id,
              ProjectID : details.ProjectID,
              Taskname: details.Taskname,
              Priority: details.Priority,
              Description: details.Description,
              ResourceDetails: details.ResourceDetails,
              Status: details.Status,
              Remarks: details.Remarks,
            };
          })
        );
        setTask(TaskDetails);
        debugger;

        dispatch({
          type: actions.init,
          data: {
            Projectartifact,
            TaskArtifact,
            web3,
            accounts,
            networkID,
            ProjectContract,
            TaskContract,
            projectDetails,
            TaskDetails,
          },
        });
        setLoading(true); 
      } catch (err) {
        console.error(err);
      }
      finally {
        setLoading(true); // Set loading to false after data is fetched
      }
    }
  }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        const ProjectArtifact = require("../../contracts/ProjectManager.json");
        const TaskArtifact = require("../../contracts/TaskMaster.json");
        init(ProjectArtifact, TaskArtifact);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifact);
    };

    events.forEach((e) => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach((e) => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact]);

  //Get Project Details
  const fetchAllProjects = async () => {};

  return (
    <EthContext.Provider
      value={{
        state,
        dispatch,
        loading,
        projects,
        Task
      }}
    >
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
