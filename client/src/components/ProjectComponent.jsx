import React, { useState, useEffect, useRef } from "react";
import useEth from "../contexts/EthContext/useEth";
import fireAlert from "../Content/app";

const ProjectComponent = (projectDetails) => {
  //*****************************Declaration Region *************************** */
  const {
    state: { accounts, TaskContract, ProjectContract },
  } = useEth();
  const [Update, setUpdate] = useState(false);
  const [ProjectID, setProjectID] = useState("");

  //*****************************functional Region *************************** */
  const SaveProject = async () => {
    const ProjectName = document.getElementById("txtprojectName").value;
    const Budget = document.getElementById("txtBudget").value;
    const ResourceCount = document.getElementById("txtResourceCount").value;
    const ResourceDetails = document.getElementById("txtResourceDetails").value;
    const Status = document.getElementById("ddlStatus").value;
    const Remarks = document.getElementById("txtRemarks").value;
    try {
      const Result = await ProjectContract.methods
        .CreateProject(
          ProjectName,
          parseInt(Budget),
          parseInt(ResourceCount),
          ResourceDetails,
          parseInt(Status),
          Remarks
        )
        .send({ from: accounts[0] });
      if (Result.status) {
        fireAlert("Project Saved Successfully", "success");
        document.getElementById("btnClose").click();
        setUpdate(false);
      } else fireAlert("Unable to save data", "error");
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
  const UpdateProject = async () => {
    const ProjectName = document.getElementById("txtprojectName").value;
    const Budget = document.getElementById("txtBudget").value;
    const ResourceCount = document.getElementById("txtResourceCount").value;
    const ResourceDetails = document.getElementById("txtResourceDetails").value;
    const Status = document.getElementById("ddlStatus").value;
    const Remarks = document.getElementById("txtRemarks").value;
    try {
      const Result = await ProjectContract.methods
        .UpdatedProject(
          ProjectName,
          parseInt(Budget),
          parseInt(ResourceCount),
          ResourceDetails,
          parseInt(Status),
          Remarks,
          ProjectID
        )
        .send({ from: accounts[0] });
      if (Result.status) {
        fireAlert("Project Saved Successfully", "success");
        document.getElementById("btnClose").click();
        setUpdate(false);
      } else fireAlert("Unable to save data", "error");
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
    const details = await ProjectContract.methods
      .GetProjectData(e)
      .call({ from: accounts[0] });

    document.getElementById("txtprojectName").value = details.ProjectName;
    document.getElementById("txtBudget").value = details.Budget;
    document.getElementById("txtResourceCount").value = details.ResourceCount;
    document.getElementById("txtResourceDetails").value =
      details.ResourceDetails;
    document.getElementById("ddlStatus").value = details.Status;
    document.getElementById("txtRemarks").value = details.Remarks;
    setUpdate(true);
    setProjectID(e);
    document.getElementById("btnAddProject").click();
  };

  const addProject = () => {
    if (Update) {
      document.getElementById("btnProjectAction").innerHTML = "Update Project";
    } else {
      // document.getElementById("btnProjectAction").innerHTML = "Save Project";
      // document.getElementById("txtprojectName").value = "";
      // document.getElementById("txtBudget").value = "";
      // document.getElementById("txtResourceCount").value = "";
      // document.getElementById("txtResourceDetails").value = "";
      // document.getElementById("ddlStatus").value = "";
      // document.getElementById("txtRemarks").value = "";
    }
  };

  //***************************** Return Region *************************** */

  return (
    <div id="projectPage">
      <button
        type="button"
        className="btn btn-success btn-add mb-3"
        data-toggle="modal"
        data-target="#addProjectModal"
        id="btnAddProject"
        onClick={addProject}
      >
        Add Project
      </button>

      {/* Table to display projects */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Project ID</th>
            <th>Project Name</th>
            <th>Budget</th>
            <th>Resource Count</th>
            <th>Resource Details</th>
            <th>Status</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {projectDetails.projectDetails.length > 0 ? (
            projectDetails.projectDetails.map((project) => (
              <tr key={project.id}>
                <td>
                  <a href="#" onClick={() => TriggerUpdate(project.id)}>
                    {project.id}
                  </a>
                </td>
                <td>{project.name}</td>
                <td>{project.budget}</td>
                <td>{project.resourceCount}</td>
                <td>{project.resourceDetails}</td>
                <td>
                  {project.status == "1"
                    ? "Yet to start"
                    : project.status == "2"
                    ? "In Process"
                    : project.status == "3"
                    ? "Hold"
                    : "Completed"}
                </td>
                <td>{project.remarks}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No projects found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div
        class="modal fade"
        id="addProjectModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="addProjectModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="addProjectModalLabel">
                {Update ? "Update Project" : "Add New Project"}
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
              <form id="addProjectForm">
                <div class="form-group">
                  <label for="projectName">Project Name</label>
                  <input
                    type="text"
                    class="form-control"
                    id="txtprojectName"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="allocationTime">Budget</label>
                  <input type="text" class="form-control" id="txtBudget" />
                </div>
                <div class="form-group">
                  <label for="resource">Resource Count</label>
                  <input
                    type="text"
                    class="form-control"
                    id="txtResourceCount"
                  />
                </div>
                <div class="form-group">
                  <label for="resource">Resource</label>
                  <input
                    type="text"
                    class="form-control"
                    id="txtResourceDetails"
                  />
                </div>
                <div class="form-group">
                  <label for="status">Status</label>
                  <select class="form-control" id="ddlStatus">
                    <option value="0">-Select--</option>
                    <option value="1">Yet to start</option>
                    <option value="2">In Process</option>
                    <option value="3">Hold</option>
                    <option value="4">Completed</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="resource">Remarks</label>
                  <input type="text" class="form-control" id="txtRemarks" />
                </div>
                <button
                  type="button"
                  class="btn btn-primary"
                  onClick={Update ? UpdateProject : SaveProject}
                  id="btnProjectAction"
                >
                  {Update ? "Update Project" : "Save Project"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectComponent;
