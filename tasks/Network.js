task(
  "bao:Network:fastForward",
  "Fast forward the forked network by a given number of seconds."
).setAction(async (taskArgs, { network }) => {
  await network.provider.send("evm_increaseTime", [1209600]);
  await network.provider.send("evm_mine");
  console.log("Time traveled!");
});
