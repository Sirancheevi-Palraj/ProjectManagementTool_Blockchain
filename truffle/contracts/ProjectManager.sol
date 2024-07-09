// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract ProjectManager {
    struct ProjectInformation {
        bytes ProjectName;
        uint256 Budget;
        uint256 ResourceCount;
        bytes ResourceDetails;
        int256 Status;
        bytes Remarks;
    }
    mapping(string => ProjectInformation) public ProjectDetails;
        string[] public projectIDs;
    uint256 public ProjectCount = 0;
    address public Manager;

    constructor(address _Admin) {
        Manager = address(0) == _Admin ? msg.sender : _Admin;
    }

    modifier isAdmin(address Admin) {
        require(Admin == Manager, "You are not allowed to manupulate");
        _;
    }

    function UpdatedProject(
        string memory ProjectName,
        uint256 Budget,
        uint256 ResourceCount,
        string memory ResourceDetails,
        int256 Status,
        string memory Remarks,
        string memory ProjectID
    ) public isAdmin(msg.sender) returns (bool result, string memory Message) {
        ProjectInformation memory ProjectInformationObj = ProjectInformation({
            ProjectName: bytes(ProjectName),
            Budget: Budget,
            ResourceCount: ResourceCount,
            ResourceDetails: bytes(ResourceDetails),
            Status: Status,
            Remarks: bytes(Remarks)
        });
        ProjectDetails[ProjectID] = ProjectInformationObj;
        result = true;
        Message = "Updated Created";
    }

    function GetProjectData(string memory ProjectID)
        public
        isAdmin(msg.sender)
        view
        returns (
            string memory ProjectName,
            uint256 Budget,
            uint256 ResourceCount,
            string memory ResourceDetails,
            int256 Status,
            string memory Remarks,
            bool result,
            string memory Message
        )
    {
        ProjectInformation memory ProjectInformationObj = ProjectDetails[
            ProjectID
        ];
        if (ProjectInformationObj.ProjectName.length > 0) {
            ProjectName = string(ProjectInformationObj.ProjectName);
            Budget = ProjectInformationObj.Budget;
            ResourceCount = ProjectInformationObj.ResourceCount;
            ResourceDetails = string(ProjectInformationObj.ResourceDetails);
            Status = ProjectInformationObj.Status;
            Remarks = string(ProjectInformationObj.Remarks);
            result = true;
        } else {
            result = true;
            Message = "No Data Found";
        }
    }

    function CreateProject(
        string memory ProjectName,
        uint256 Budget,
        uint256 ResourceCount,
        string memory ResourceDetails,
        int256 Status,
        string memory Remarks
    ) public isAdmin(msg.sender) returns (bool result, string memory Message) {
        ProjectInformation memory ProjectInformationObj = ProjectInformation({
            ProjectName: bytes(ProjectName),
            Budget: Budget,
            ResourceCount: ResourceCount,
            ResourceDetails: bytes(ResourceDetails),
            Status: Status,
            Remarks: bytes(Remarks)
        });
        ProjectCount++;
        string memory ProjectID = uintToStringWithZeroPadding(ProjectCount, 10);
        ProjectDetails[ProjectID] = ProjectInformationObj;
        projectIDs.push(ProjectID);
        result = true;
        Message = ProjectID;
    }
 function getAllProjectIDs() public view returns (string[] memory) {
        return projectIDs;
    }
    //Utility functions
    function uintToStringWithZeroPadding(uint256 value, uint256 length)
        internal
        pure
        returns (string memory)
    {
        bytes memory buffer = new bytes(length);
        for (uint256 i = length; i > 0; i--) {
            buffer[i - 1] = bytes1(uint8(48 + (value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
