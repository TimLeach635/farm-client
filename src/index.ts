import { io } from "socket.io-client";
import Phaser from "phaser";
import Rectangle = Phaser.GameObjects.Rectangle;
import Text = Phaser.GameObjects.Text;

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
    const xOffset = 200;
    const yOffset = 200;

    const getGrowthDisplayText = (farm): string => {
      return `${farm.growthTime.toFixed(1)} / ${farm.crop.growthTime.toFixed(1)}`;
    }

    if (!hasStoredWorldState) {
      worldState.crops.forEach(crop => {
        crops.push(crop);
      });
      worldState.farms.forEach(farm => {
        const farmObject: Rectangle = this.add.rectangle(
          farm.area.bottomLeft.x + xOffset,
          farm.area.bottomLeft.y + yOffset,
          farm.area.size.x,
          farm.area.size.y,
          0x00dd00
        );

        // Set origin to bottom left
        farmObject.setOrigin(0, 1);

        const growthDisplay: Text = this.add.text(
          farm.area.bottomLeft.x + xOffset,
          farm.area.bottomLeft.y + yOffset,
          getGrowthDisplayText(farm),
        );

        growthDisplay.setOrigin(0, 1);
        growthDisplay.setPadding(5, 5, 5, 5);
        growthDisplay.setColor("#000");
        growthDisplay.setFontFamily("Tahoma, sans-serif");
        growthDisplay.setFontSize(20);

        farms.push({
          ...farm,
          gameObject: farmObject,
          growthDisplayObject: growthDisplay,
        });
      });

      hasStoredWorldState = true;
    } else {
      worldState.farms.forEach(farm => {
        const localFarm = farms.find(f => f.id === farm.id);
        localFarm.growthDisplayObject.text = getGrowthDisplayText(farm);
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
