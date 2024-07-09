// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract TaskMaster {
    address[] TaskOwners;
    struct TaskInformation {
        bytes ProjectID;
        bytes Taskname;
        bytes Description;
        int256 Priority;
        bytes ResourceDetails;
        int256 Status;
        bytes Remarks;
    }
    mapping(string => TaskInformation) public TaskDetails;
    uint256 TaskCount = 0;
    string[] public TaskIDs;
    constructor(address _admin) {
        TaskOwners.push(_admin);
    }

    modifier isEligible(address _add) {
       // require(isTaskOwnerExists(_add), "You are not authorized");
        _;
    }

    function CreateTask(
        string memory ProjectID,
        string memory Taskname,
        int256 Priority,
        string memory Description,
        string memory ResourceDetails,
        int256 Status,
        string memory Remarks
    )
        public
        isEligible(msg.sender)
        returns (bool result, string memory Message)
    {
        TaskInformation memory TaskInformationObj = TaskInformation({
            ProjectID: bytes(ProjectID),
            Taskname: bytes(Taskname),
            Description: bytes(Description),
            Priority: Priority,
            ResourceDetails: bytes(ResourceDetails),
            Status: Status,
            Remarks: bytes(Remarks)
        });
        TaskCount++;
        string memory TaskID = uintToStringWithZeroPadding(TaskCount, 10);
        TaskDetails[TaskID] = TaskInformationObj;
        TaskIDs.push(TaskID);
        result = true;
        Message = TaskID;
    }
    function UpdateTask(
        string memory ProjectID,
        string memory Taskname,
        int256 Priority,
        string memory Description,
        string memory ResourceDetails,
        int256 Status,
        string memory Remarks,
        string memory TaskID
    )
        public
        isEligible(msg.sender)
        returns (bool result, string memory Message)
    {
        TaskInformation memory TaskInformationObj = TaskInformation({
            ProjectID: bytes(ProjectID),
            Taskname: bytes(Taskname),
            Description: bytes(Description),
            Priority: Priority,
            ResourceDetails: bytes(ResourceDetails),
            Status: Status,
            Remarks: bytes(Remarks)
        });
        TaskDetails[TaskID] = TaskInformationObj;
        result = true;
        Message = "Updated Successfully";
    }
    function GetTask(
        string memory TaskID
    )
        public
        view
        isEligible(msg.sender)
        returns (
            string memory ProjectID,
            string memory Taskname,
            int256 Priority,
            string memory Description,
            string memory ResourceDetails,
            int256 Status,
            string memory Remarks,
            bool result,
            string memory Message
        )
    {
        TaskInformation memory TaskInformationObj = TaskDetails[TaskID];
        if (TaskInformationObj.Taskname.length > 0) {
            ProjectID = string(TaskInformationObj.ProjectID);
            Taskname = string(TaskInformationObj.Taskname);
            Priority = TaskInformationObj.Priority;
            Description = string(TaskInformationObj.Description);
            Status = TaskInformationObj.Status;
            Remarks = string(TaskInformationObj.Remarks);
            ResourceDetails = string(TaskInformationObj.ResourceDetails);
            result = true;
        } else {
            result = true;
            Message = "No Data Found";
        }
    }
    function getAllTaskIDs() public view returns (string[] memory) {
        return TaskIDs;
    }
    function getAllOwners() public view returns (address[] memory) {
        return TaskOwners;
    }
    //Utility functions
    function uintToStringWithZeroPadding(
        uint256 value,
        uint256 length
    ) internal pure returns (string memory) {
        bytes memory buffer = new bytes(length);
        for (uint256 i = length; i > 0; i--) {
            buffer[i - 1] = bytes1(uint8(48 + (value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    function isTaskOwnerExists(address _address) public view returns (bool) {
        for (uint256 i = 0; i < TaskOwners.length; i++) {
            if (TaskOwners[i] == _address) {
                return true;
            }
        }
        return false;
    }


}
