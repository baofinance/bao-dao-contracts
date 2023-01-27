task("bao:Network:fastForward", "Fast forward the forked network by a given number of seconds.")
  .addOptionalParam("seconds", "the number of seconds to fast forward", "86400")
  .setAction(async (taskArgs, { network }) => {
    const seconds = parseInt(taskArgs.seconds)
    await network.provider.send("evm_increaseTime", [seconds]);
    await network.provider.send("evm_mine");
    console.log(`Time traveled ${(seconds / 86400).toFixed(4)} days!`);
  })


task("bao:Network:mine", "Mine a block.")
  .setAction(async (taskArgs, { network }) => {
    await network.provider.send("evm_mine");
    console.log("Mined one block.");
  })


task("bao:Network:snapshot:save", "Save the chain state.")
  .setAction(async (taskArgs, { network }) => {
    const snapshotId = await network.provider.send("evm_snapshot");
    console.log(`Snapshot ID: ${snapshotId}`);
  })


task("bao:Network:snapshot:load", "Load a saved chain state.")
  .addParam("id", "The id that you saved from snapshot:save.")
  .setAction(async (taskArgs, { network }) => {
    if (!/0[xX][0-9a-fA-F]{2}/.test(taskArgs.id)) {
      throw new Error(`Bad snapshot ID given: '${taskArgs.id}'`)
    }
    await network.provider.send("evm_revert", [taskArgs.id]);
    console.log(`Loaded evm state from snapshot '${taskArgs.id}'.`);
  })


task("bao:Network:state:dump", "Save the chain state.")
  .setAction(async (taskArgs, { network }) => {
    const snapshotId = await network.provider.send("anvil_dumpState", []);
    console.log(`State ID: ${snapshotId}`);
  })


task("bao:Network:dump:load", "Load a saved chain state from the filesystem.")
  .addParam("id", "The id that you saved from state:save.")
  .setAction(async (taskArgs, { network }) => {
    if (!/0[xX][0-9a-fA-F]{2}/.test(taskArgs.id)) {
      throw new Error(`Bad snapshot ID given: '${taskArgs.id}'`)
    }
    await network.provider.send("anvil_loadState", [taskArgs.id]);
    console.log(`Loaded evm state from snapshot '${taskArgs.id}'.`);
  })
