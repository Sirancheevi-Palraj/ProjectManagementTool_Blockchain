const TaskMaster = artifacts.require("TaskMaster");

module.exports = function (deployer) {
  const Manager = "0xE2Bf18eE9CE0dE70B9EEC1B1703255B60068FAE5"; 
  deployer.deploy(TaskMaster, Manager, { gas: 3000000, gasPrice: 20000000000 });
};
