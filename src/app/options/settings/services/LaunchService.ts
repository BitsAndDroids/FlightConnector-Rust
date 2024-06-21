export const changeLaunchWhenSimStarts = (value: boolean) => {
  value ? enableLaunchWhenSimStarts() : disableLaunchWhenSimStarts();
};

const enableLaunchWhenSimStarts = () => {
  const launchFilePath = "";
  console.log("enable");
};

const disableLaunchWhenSimStarts = () => {
  const launchFilePath = "";
  console.log("disable");
};
