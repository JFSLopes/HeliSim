import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture, CGFshader } from "../lib/CGF.js";
import { MyForest } from "./forest/MyForest.js";
import { MyPlane } from "./MyPlane.js";
import { MyPanorama } from "./MyPanorama.js";
import { MyBuilding } from "./building/MyBuilding.js";
import { MyLake } from "./MyLake.js";
import { MyHelicopter } from "./MyHelicopter.js";
import {MyBucket} from "./helicopter/MyBucket.js"

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
	constructor() {
		super();
	}

	init(application) {
		super.init(application);

		//-------Objects connected to MyInterface
		this.displayPlane = true;
		this.displayPanorama = true;
		this.buildingColor = [204, 204, 182];
		this.buildingSize = 80;
		this.numFloors = 7;
		this.numWindows = 4;
		this.speedFactor = 1;
		this.selectedWindow = 'textures/building/window1.jpeg';
		this.windowTextures = {
		    "Window Style 1": 'textures/building/window1.jpeg',
    		"Window Style 2": 'textures/building/window2.jpg'
		}
		this.selectedWall = 'textures/building/wall1.jpeg';
		this.wallTextures = {
			"Wall Style 1": "textures/building/wall1.jpeg",
    		"Wall Style 2": "textures/building/wall2.jpg",
		}
		this.povChange = false;
		
		// Control data
		this.turnAngle = 0.1;
		this.acceleration = 0.1;

		this.initCameras();
		this.initLights();

		//Background color
		this.gl.clearColor(0, 0, 0, 1.0);

		this.gl.clearDepth(100.0);
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.enable(this.gl.CULL_FACE);
		this.gl.depthFunc(this.gl.LEQUAL);

		this.enableTextures(true);

		this.setUpdatePeriod(50);

		// Positions of objects
		this.buildingCoors = {x: -70, y:0, z: -70};
		this.forestCoors = {x: -90, y:0, z: 60};
		this.lakeCoors = {x: 50, y:0, z: -80};

		// Textures
		this.sphereTexture = new CGFtexture(this, "textures/tex1.jpg");
		this.planeTexture = new CGFtexture(this, "textures/grass.jpg");

		//Initialize scene objects
		this.axis = new CGFaxis(this, 20, 1);
		this.plane = new MyPlane(this, 64);
		this.panorama = new MyPanorama(this, this.sphereTexture);
		this.forest = new MyForest(this, 5, 4, this.forestCoors);
		this.building = new MyBuilding(this, this.buildingSize, this.numFloors, this.numWindows, this.selectedWindow, this.normalizeColor(this.buildingColor), this.selectedWall);
		const helipadCoors = this.building.get_helipad_coors(this.buildingCoors);
		this.helicopter = new MyHelicopter(this, helipadCoors.x, helipadCoors.y, helipadCoors.z);
		this.lake = new MyLake(this, this.lakeCoors.x, this.lakeCoors.z, 70, 140, './textures/water1.jpg');


		// Material
		this.sphereMaterial = new CGFappearance(this);
		this.planeMaterial = new CGFappearance(this);
	
		//Shaders
        this.flameShader = new CGFshader(this.gl,"shaders/fire.vert", "shaders/fire.frag");
		this.fireShader = new CGFshader(this.gl, "shaders/bigFire.vert", "shaders/bigFire.frag");
		this.helipadShader = new CGFshader(this.gl, "shaders/helipad.vert", "shaders/helipad.frag");
		this.lightShader = new CGFshader(this.gl, "shaders/light.vert", "shaders/light.frag");
		this.waterShader = new CGFshader(this.gl, "shaders/water.vert", "shaders/water.frag");

		this.sphereMaterial.setTexture(this.sphereTexture);
		this.planeMaterial.setTexture(this.planeTexture);
		this.planeMaterial.setTextureWrap('REPEAT', 'REPEAT');
	}
	normalizeColor(rgb) {
		return rgb.map(c => c / 255);
	}
	windowSelected(selectedTexturePath) {
		this.selectedWindow = selectedTexturePath;
	}
	wallSelected(selectedTexturePath) {
		this.selectedWall = selectedTexturePath;
	}
	updateScene() {
		console.log("Scene updated!");
		// Build the new building
		this.building = new MyBuilding(this, this.buildingSize, this.numFloors, this.numWindows, this.selectedWindow, this.normalizeColor(this.buildingColor), this.selectedWall);

		// Update the helistart position
		this.helicopter.setStartCoors(this.building.get_helipad_coors(this.buildingCoors));
	}
	initLights() {
		this.lights[0].setPosition(0, 180, 0, 1);
		this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
		this.lights[0].enable();
		this.lights[0].update();

		this.lights[1].setPosition(-150, 50, -150, 1);
		this.lights[1].setDiffuse(1.0, 1.0, 1.0, 1.0);
		this.lights[1].enable();
		this.lights[1].update();
	}
	initCameras() {
		this.camera = new CGFcamera(
		0.7,
		0.1,
		1000,
		vec3.fromValues(5, 120, 270),
		vec3.fromValues(0, 0, 0)
		);
	}

	updateCameraPosition() {

		if (this.povChange){	// Camera following heli
			const heliPos = this.helicopter.getCoordinates();
		
			// Position the camero close to the helicopter
			const offset = {
				x: -60 * Math.sin(this.helicopter.angle),
				y: 40,
				z: -60 * Math.cos(this.helicopter.angle)
			};
		
			// Update camera position
			this.camera.setPosition(vec3.fromValues(
				heliPos.x + offset.x,
				heliPos.y + offset.y,
				heliPos.z + offset.z
			));
		
			this.camera.setTarget(vec3.fromValues(heliPos.x, heliPos.y, heliPos.z));
		} else {
			const desiredY = 120;
			const targetDistance = Math.hypot(5, 270);
			const allowedOffset = 10;

			const currentPos = this.camera.position;
			let x = currentPos[0];
			let z = currentPos[2];

			const currentDist = Math.hypot(x, z);	// Distance
			const clampedDist = Math.max(targetDistance - allowedOffset,
								Math.min(targetDistance + allowedOffset, currentDist));

			// Normalize (x, z)
			const angle = Math.atan2(z, x);
			x = clampedDist * Math.cos(angle);
			z = clampedDist * Math.sin(angle);

			this.camera.setPosition(vec3.fromValues(x, desiredY, z));
			this.camera.setTarget(vec3.fromValues(0, 0, 0));
		}
		
	}

	checkKeys() {
		var text = "Keys pressed: ";
		var keysPressed = false;

		this.helicopter.removeInclination();
		// Check for key codes e.g. in https://keycode.info/
		if (this.gui.isKeyPressed("KeyW")) {
			text += " W ";
			keysPressed = true;
			this.helicopter.inclineForward(); // Incline the helicopter forward
			this.helicopter.accelerate(this.acceleration);  // Move forward
		}

		if (this.gui.isKeyPressed("KeyS")) {
			text += " S ";
			keysPressed = true;
			this.helicopter.inclineBackward(); // Incline the helicopter backward
			this.helicopter.accelerate(-this.acceleration);  // Move backward
		}

		if (this.gui.isKeyPressed("KeyA")) {
			text += " A ";
			keysPressed = true;
			this.helicopter.turn(this.turnAngle); // Rotate left
		}

		if (this.gui.isKeyPressed("KeyD")) {
			text += " D ";
			keysPressed = true;
			this.helicopter.turn(-this.turnAngle); // Rotate right
		}

		if (this.gui.isKeyPressed("KeyR")) {
			text += " R ";
			keysPressed = true;
			this.helicopter.reset(true);
			this.forest.reset();
		}

		if (this.gui.isKeyPressed("KeyP")) {
			text += " P ";
			keysPressed = true;
			this.helicopter.ascend();
		}

		if (this.gui.isKeyPressed("KeyL")) {
			text += " L ";
			keysPressed = true;

			let heli_coors = this.helicopter.getCoordinates();

			if (this.lake.isOverLake(heli_coors)){	// Can descend
				this.helicopter.descend(this.helicopter.lowestHeightWithBucket);
			} else {			// Needs to move to the building
				let helipadCoors = this.building.get_helipad_coors(this.buildingCoors);
				const offset = this.building.centralWidth / 4;
				this.helicopter.moving_to_position(helipadCoors, offset);
			}
		}

		if (this.gui.isKeyPressed("KeyO")) {
			text += " O ";
			keysPressed = true;

			// Check if the helicopter is over the forest
			const heli_coors = this.helicopter.getCoordinates();
			if (this.forest.isInside(heli_coors.x, heli_coors.z)){
				this.helicopter.drop_water();
				this.for
			}
			
		}

		if (this.helicopter.isAscending() && !this.lake.isOverLake(this.helicopter.getCoordinates())){	// To prevent showing the animation when is ascending from the lake
			this.building.startAnimationGoingUp();
		} else if (this.helicopter.isDescending()){
			this.building.startAnimationGoingDown();
		} else {
			this.building.endAnimation();
		}

		if (this.helicopter.fireExtinguished){
			this.forest.hasFire = false;
		}

		if (keysPressed)
			console.log(text);
	}

	update(t) {
		this.checkKeys();
		this.helicopter.updatePosition();
		this.time = t / 100 % 100;
		this.updateCameraPosition();
	}

	setDefaultAppearance() {
		this.setAmbient(0.5, 0.5, 0.5, 1.0);
		this.setDiffuse(0.5, 0.5, 0.5, 1.0);
		this.setSpecular(0.5, 0.5, 0.5, 1.0);
		this.setShininess(10.0);
	}

	// Called when the speed factor is changed
	onSpeedFactorChanged(v){
		this.helicopter.updateSpeedFactor(v);
	}

	display() {
		// ---- BEGIN Background, camera and axis setup
		// Clear image and depth buffer everytime we update the scene
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		// Initialize Model-View matrix as identity (no transformation
		this.updateProjectionMatrix();
		this.loadIdentity();
		// Apply transformations corresponding to the camera position relative to the origin
		this.applyViewMatrix();
		this.lights[0].update();
		this.lights[1].update();

		// Draw axis
		this.axis.display();

		this.helicopter.display();
		this.lake.display();

		this.forest.display();

		// Display the building

		this.pushMatrix();
		this.translate(this.buildingCoors.x, this.buildingCoors.y, this.buildingCoors.z)
		this.building.display();
		this.popMatrix();
		
		
		if (this.displayPanorama){
			this.panorama.display();
		}

		this.setDefaultAppearance();

		if (this.displayPlane){
			this.pushMatrix();
			this.scale(400, 1, 400);
			this.rotate(-Math.PI / 2, 1, 0, 0);
			this.planeMaterial.apply();
			this.plane.display();
			this.popMatrix();
		}
			
	}
}
