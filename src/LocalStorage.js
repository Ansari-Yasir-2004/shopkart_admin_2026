export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("reduxState", serializedState);
  } catch (error) {
    console.log("Save State Error ==> ", error);
  }
};

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("reduxState");
    if (serializedState === null) {
      return undefined;
    }

    const loadState = JSON.parse(serializedState);
    return loadState;
  } catch (error) {
    console.log("Load State Error ==> ", error);
  }
};
