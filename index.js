const socket = io("http://localhost:1995");

const farmsDiv = document.getElementById("farms");
const crops = [];
const farms = [];

let hasStoredWorldState = false;

socket.on("harvest", ({ farmId, cropId }) => {
  console.debug(`Harvesting farm ${farmId} containing crop ${cropId}`);
});

socket.on("world update", (worldState) => {
  if (!hasStoredWorldState) {
    worldState.crops.forEach(crop => {
      crops.push(crop);
    });
    worldState.farms.forEach(farm => {
      const farmDiv = document.createElement("div");
      farmDiv.classList.add("farm");
      farmDiv.id = `farm-${farm.id}`;
      farmDiv.innerText = farm.growthTime;
      farmsDiv.appendChild(farmDiv);
      farms.push({
        ...farm,
        htmlElement: farmDiv,
      });
    });

    hasStoredWorldState = true;
  } else {
    worldState.farms.forEach(farm => {
      const localFarm = farms.find(f => f.id === farm.id);
      localFarm.htmlElement.innerText = farm.growthTime;
    });
  }
});
