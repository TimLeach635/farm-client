import { io } from "socket.io-client";
import Phaser from "phaser";

const socket = io("http://localhost:1995");

const crops = [];
const farms = [];

let hasStoredWorldState = false;

function create ()
{
  socket.on("harvest", ({ farmId, cropId }) => {
    console.debug(`Harvesting farm ${farmId} containing crop ${cropId}`);
  });

  socket.on("world update", (worldState) => {
    if (!hasStoredWorldState) {
      let xValue = 200;

      worldState.crops.forEach(crop => {
        crops.push(crop);
      });
      worldState.farms.forEach(farm => {
        const farmObject = this.add.rectangle(xValue, 200, 100, 100, 0x00dd00);
        const growthDisplay = this.add.text(xValue - 50, 100, farm.growthTime.toFixed(2));

        farms.push({
          ...farm,
          gameObject: farmObject,
          growthDisplayObject: growthDisplay,
        });

        xValue += 150;
      });

      hasStoredWorldState = true;
    } else {
      worldState.farms.forEach(farm => {
        const localFarm = farms.find(f => f.id === farm.id);
        localFarm.growthDisplayObject.text = farm.growthTime.toFixed(2);
      });
    }
  });
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    create: create
  }
};

const game = new Phaser.Game(config);
