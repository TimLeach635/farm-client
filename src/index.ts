import { io } from "socket.io-client";
import Phaser from "phaser";

const socket = io("http://localhost:1995");

const farmsDiv = document.getElementById("farms");
const crops = [];
const farms = [];

let hasStoredWorldState = false;

function preload ()
{
  this.load.setBaseURL('http://labs.phaser.io');

  this.load.image('sky', 'assets/skies/space3.png');
}

function create ()
{
  this.add.image(400, 300, 'sky');
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create
  }
};

const game = new Phaser.Game(config);

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
