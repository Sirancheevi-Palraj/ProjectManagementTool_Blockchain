import React, { useState, useEffect, useRef } from "react";
import useEth from "../contexts/EthContext/useEth";
import fireAlert from "../Content/app";

const TaskComponent = (projectDetails, TaskData) => {
  const [tasks, setTasks] = useState([
    {
      projectId: 1,
      taskId: 1,
      taskname: "Task 1",
      status: "Completed",
      resource: "John Doe",
      prority: "1",
      status: "1",
    },
  ]);
  const {
    state: { accounts, TaskContract, ProjectContract, TaskDetails },
  } = useEth();
  const [Update, setUpdate] = useState(false);
  const [TaskID, setTaskID] = useState("");

  //************************************* Function Region **********************************/
  const SaveTask = async () => {
    const ProjectID = document.getElementById("ddlProject").value;
    const TaskName = document.getElementById("txttaskName").value;
    const Description = document.getElementById("txtDescription").value;
    const Priority = document.getElementById("ddlPriorty").value;
    const Status = document.getElementById("ddlStatus").value;
    const ResourceDetails = document.getElementById("txtResourceDetails").value;
    const Remark = document.getElementById("txtRemark").value;
    try {
      const Result = await TaskContract.methods
        .CreateTask(
          ProjectID,
          TaskName,
          parseInt(Priority),
          Description,
          ResourceDetails,
          parseInt(Status),
          Remark
        )
        .send({ from: accounts[0] });
      if (Result.status) {
        fireAlert("Task Saved Successfully", "success");
        document.getElementById("btnClose").click();
        setUpdate(false);
      } else fireAlert("Unable to save Task", "error");
    } catch (error) {
      const errorMessage = error.message.match(/"reason":"([^"]+)"/);
      console.log(error);
      if (errorMessage) {
        const customError = errorMessage[1];
        fireAlert(customError, "error");
      } else {
        fireAlert("Unable to process your request", "error");
      }
    }
  };
  const UpdateTask = async () => {
    const ProjectID = document.getElementById("ddlProject").value;
    const TaskName = document.getElementById("txttaskName").value;
    const Description = document.getElementById("txtDescription").value;
    const Priority = document.getElementById("ddlPriorty").value;
    const Status = document.getElementById("ddlStatus").value;
    const ResourceDetails = document.getElementById("txtResourceDetails").value;
    const Remark = document.getElementById("txtRemark").value;
    try {
      const Result = await TaskContract.methods
        .UpdateTask(
          ProjectID,
          TaskName,
          parseInt(Priority),
          Description,
          ResourceDetails,
          parseInt(Status),
          Remark,
          TaskID
        )
        .send({ from: accounts[0] });
      if (Result.status) {
        fireAlert("Task Updated Successfully", "success");
        document.getElementById("btnClose").click();
        setUpdate(false);
      } else fireAlert("Unable to save Task", "error");
    } catch (error) {
      const errorMessage = error.message.match(/"reason":"([^"]+)"/);
      console.log(error);
      if (errorMessage) {
        const customError = errorMessage[1];
        fireAlert(customError, "error");
      } else {
        fireAlert("Unable to process your request", "error");
      }
    }
  };
  const TriggerUpdate = async (e) => {
    const details = await TaskContract.methods
      .GetTask(e)
      .call({ from: accounts[0] });
    document.getElementById("ddlProject").value = details.ProjectID;
    document.getElementById("txttaskName").value = details.Taskname;
    document.getElementById("txtDescription").value = details.Description;
    document.getElementById("ddlPriorty").value = details.Priority;
    document.getElementById("ddlStatus").value = details.Status;
    document.getElementById("txtResourceDetails").value = details.ResourceDetails;
    document.getElementById("txtRemark").value=details.Remarks;
    setUpdate(true);
    setTaskID(e);
    document.getElementById("btnAddTask").click();
  };

  // Function to add a new task
  const addTask = () => {
   if(Update)
    document.getElementById("btnAddTask").innerHTML = "Update Task";
  else
  document.getElementById("btnAddTask").innerHTML = "Add Task";

  };
  debugger;
  console.log("From Task Component");
  console.log(TaskDetails);
  console.log(TaskData);

  const getProjectName = (id) => {
    debugger
    if(projectDetails != null)
    {
      var Project = projectDetails.projectDetails.find((obj) => obj.id === id);
      return Project.name;
    }
    else{
      return "-"
    }
    
  };
  return (
    <div id="taskPage">
      {/* Button to add new task */}
      <button
        type="button"
        className="btn btn-success btn-add mb-3"
        data-toggle="modal"
        data-target="#addTaskModal"
        id="btnAddTask"
        onClick={addTask}
      >
        Add Task
      </button>

      {/* Table to display tasks */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Task ID</th>
            <th>Project Name</th>
            <th>Task Name</th>
            <th>Description</th>
            <th>Resource</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          {TaskDetails.map((task) => (
            <tr key={task.id}>
              <td>
                <a href="#" onClick={() => TriggerUpdate(task.id)}>{task.id}</a>
              </td>
              <td>{getProjectName(task.ProjectID)}</td>
              <td>{task.Taskname}</td>
              <td>{task.Description}</td>
              <td>{task.ResourceDetails}</td>
              <td>{task.Priority}</td>
              {task.status == "1"
                    ? "Yet to start"
                    : task.status == "2"
                    ? "In Process"
                    : task.status == "3"
                    ? "Hold"
                    : "Completed"}
              <td>{task.Remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        class="modal fade"
        id="addTaskModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="addTaskModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="addTaskModalLabel">
              {Update ? "Update Task" : "Add New Task"}
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
                id="btnClose"
                onClick={() => setUpdate(false)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form id="addTaskForm">
                <div class="form-group">
                  <label for="projectIDTask">Project ID</label>
                  <select class="form-control" id="ddlProject">
                    {projectDetails.projectDetails.map((project) => (
                      <option value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>
                <div class="form-group">
                  <label for="taskName">Task Name</label>
                  <input type="text" class="form-control" id="txttaskName" />
                </div>
                <div class="form-group">
                  <label for="taskName">Description</label>
                  <input type="text" class="form-control" id="txtDescription" />
                </div>
                <div class="form-group">
                  <label for="taskStatus">Priority</label>
                  <select class="form-control" id="ddlPriorty">
                    <option value="1">Emergency</option>
                    <option value="2">Moderate</option>
                    <option value="3">Slow</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="taskResource">Resource Details</label>
                  <input
                    type="text"
                    class="form-control"
                    id="txtResourceDetails"
                  />
                </div>
                <div class="form-group">
                  <label for="taskStatus">Status</label>
                  <select class="form-control" id="ddlStatus">
                    <option value="0">-Select--</option>
                    <option value="1">Yet to start</option>
                    <option value="2">In Process</option>
                    <option value="3">Hold</option>
                    <option value="4">Completed</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="taskResource">Remarks</label>
                  <input type="text" class="form-control" id="txtRemark" />
                </div>
                <button
                  type="submit"
                  class="btn btn-primary"
                  onClick={Update ? UpdateTask : SaveTask}
                >
                    {Update ? "Update Task" : "Save Task"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskComponent;
