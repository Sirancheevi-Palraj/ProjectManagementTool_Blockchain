const actions = {
  init: "INIT"
};

const initialState = {
  Projectartifact: null,
  TaskArtifact: null,
  web3: null,
  accounts: null,
  networkID: null,
  ProjectContract: null,
  TaskContract: null,
  ProjectDetails: null,
  TaskDetails : null
};

const reducer = (state, action) => {
  const { type, data } = action;
  switch (type) {
    case actions.init:
      return { ...state, ...data };
    default:
      throw new Error("Undefined reducer action type");
  }
};

export { actions, initialState, reducer };
