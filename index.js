const socket = io("http://localhost:1995");

socket.on("harvest", ({ farmId, cropId }) => {
  console.debug(`Harvesting farm ${farmId} containing crop ${cropId}`);
});
