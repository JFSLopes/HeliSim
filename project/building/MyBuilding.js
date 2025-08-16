import {CGFobject, CGFtexture} from '../../lib/CGF.js';
import {MyLateralModule} from './MyLateralModule.js';
import {MyFloor} from './MyFloor.js';
import {MyRectangle} from './MyRectangle.js';
import { MyCube } from './MyCube.js';

/**
 * The building will be built with the center of the main building on the
 */
export class MyBuilding extends CGFobject {
	constructor(scene, totalWidth, numFloorsSideModules, windowsPerFloor, windowTexturePath, buildingColor, wallTexturePath) {
		super(scene);

        // Common parameters
		this.numFloors = numFloorsSideModules;
		this.floorHeight = 6;
		this.groundFloorHeight = this.floorHeight * 2;
		this.windowsPerFloor = windowsPerFloor;
		this.windowTexture = windowTexturePath;
		this.wallTexturePath = wallTexturePath;
		this.color = buildingColor;
		this.totalHeigh = this.groundFloorHeight + this.numFloors * this.floorHeight;

        // Main building dimensions
        this.centralWidth = totalWidth / (1 + 0.75 * 2);
        this.centralDepth = this.centralWidth;

        // Lateral building dimensions
        this.lateralWidth = this.centralWidth;
        this.lateralDepth = this.centralDepth * 0.75;
        this.lateralHeight = this.numFloors * this.floorHeight;

		// Door, "Bombeiros" sign and helipad
        this.doorTexture = "/project/textures/building/door1.jpg";
        this.signTexture = "/project/textures/building/bombeiros.jpg";
		this.helipadTextures = [
			"/project/textures/building/helipad.png",
			"/project/textures/building/up.png",
			"/project/textures/building/down.png"
		];
		this.textures = [
			new CGFtexture(scene, this.helipadTextures[0]),
			new CGFtexture(scene, this.helipadTextures[1]),
			new CGFtexture(scene, this.helipadTextures[2])
		];

		// Data to control the helipad animation
		this.FPS = 2;
		this.frameDuration = 1 / this.FPS * 1000;
		this.time = Date.now();
		this.animation = false;
		this.up = false;
		this.currentIndex = 0;

		// Light which is placed in the corners of the helipad
		this.lightsFPS = 100 * this.FPS;
		this.cubeDimension = this.centralWidth * 0.05;
		this.frameDurationLights = 1 / this.lightsFPS;
		this.currentFrame = 0;	// Used as input for the sin function used in the lights
		this.baseColor = [1, 0, 0];

		this.build(scene);
	}

	build(scene) {
		// Build the lateral building
		this.lateralBuilding = new MyLateralModule(
			scene,
			this.lateralWidth,
            this.lateralHeight,
            this.lateralDepth,
            this.numFloors,
			this.windowsPerFloor,
			this.windowTexture,
			this.color,
			this.wallTexturePath
		);

		// Build the ground floor for the central building
		this.centralGround = new MyFloor(
			scene,
			this.centralWidth,
			this.groundFloorHeight,
			this.centralDepth,
			0, // No windows in the ground floor
			this.doorTexture,
			this.color,
			this.wallTexturePath,
			this.signTexture,
			true, // isCentral
		)

		// Build ethe central buiding floors
		this.centralUpper = new MyLateralModule(
			this.scene,
			this.centralWidth,	// Witdth is different
			this.lateralHeight, //same number of floors
			this.centralDepth,
			this.numFloors,
			this.windowsPerFloor,
			this.windowTexture,
			this.color,
			this.wallTexturePath
		);

		// Build the light
		this.light = new MyCube(scene, this.cubeDimension, this.lightsFPS, this.baseColor);

		// Build the helipad
		this.helipad = [
			new MyRectangle(scene, this.centralWidth, this.centralDepth, this.helipadTextures[0]),
		 	new MyRectangle(scene, this.centralWidth, this.centralDepth, this.helipadTextures[1]),
		 	new MyRectangle(scene, this.centralWidth, this.centralDepth, this.helipadTextures[2])
		];
	}

	startAnimationGoingUp(){
		if (this.animation) return;

		this.animation = true;
		this.up = true;
	}

	startAnimationGoingDown(){
		if (this.animation) return;

		this.animation = true;
		this.up = false;
	}

	endAnimation(){
		this.animation = false;
		this.up = false;
		this.currentIndex = 0;
		this.currentFrame = 0;
	}

	get_helipad_coors(realCoor) {
		// The helipad is centered on the building, so its (x, z) position is the same as the building's.
		// Only the y-coordinate is offset slightly above the building's total height.
		let helipadCoor = { ...realCoor };  // Create a shallow copy of the coordinates
		helipadCoor.y = this.totalHeigh + 0.15;
		return helipadCoor;
	}

	update(now){
		if (this.animation && (now - this.time > this.frameDuration)){
			this.time = now;
			if (this.up){
				this.currentIndex = (this.currentIndex == 0) ? 1 : 0;
			} else{
				this.currentIndex = (this.currentIndex == 0) ? 2 : 0;
			}
		}
		if (this.animation && (now - this.time > this.frameDurationLights)){
			this.currentFrame = (this.currentFrame + 1) % this.lightsFPS;
		}
	}

	activateHelipadShader(now){
		const timeElapsed = now - this.time;
		
		// Using sine so the transitions are smooth
		const clampedElapsed = Math.min(timeElapsed, this.frameDuration);
		const progress = clampedElapsed / this.frameDuration;
		const mixFactor = Math.sin((Math.PI / 2) * progress);

		this.scene.setActiveShader(this.scene.helipadShader);
		this.scene.helipadShader.setUniformsValues({
			mixFactor: mixFactor,
			uTexture2: 1  // bind sampler uTexture2 to texture unit 1
		});

		const nextIndex = (this.currentIndex != 0) ? 0 : (this.up ? 1 : 2);
		this.textures[nextIndex].bind(1);	// Bind "next" texture
		return nextIndex;
	}

	drawLightAt(x, y, z) {
		this.scene.pushMatrix();
		this.scene.translate(x, y, z);
		this.light.display();
		this.scene.popMatrix();
	}

	display() {
		const zShift = (this.centralDepth - this.lateralDepth);

		// Draw the central building
		this.scene.pushMatrix();
		this.scene.translate(-this.centralWidth/2, 0, this.centralDepth/2);
		this.centralGround.display();
	
		this.scene.translate(0, this.groundFloorHeight, 0); // Move up to the floor above the ground floor
		this.centralUpper.display();
		this.scene.popMatrix();


		// Draw the helipad (must rotated -90º x-axis)
		this.scene.pushMatrix();
		this.scene.translate(-this.centralWidth/2, this.totalHeigh + 0.25, this.centralDepth/2);
		this.scene.rotate(-Math.PI/2, 1, 0, 0);

		// Data for drawing the light
		const lightOffset = this.cubeDimension / 2;
		const halfWidth = this.centralWidth / 2;
		const halfDepth = this.centralDepth / 2;
		const lightY = this.totalHeigh + 0.15 + this.cubeDimension / 2;

		const now = Date.now();
		this.update(now);
		if (this.animation){
			const nextIndex = this.activateHelipadShader(now);
			this.textures[nextIndex].bind(1);
			this.helipad[this.currentIndex].display();
			this.scene.popMatrix();

			// For the lights
			this.scene.setActiveShader(this.scene.lightShader);
				this.scene.lightShader.setUniformsValues({
				uTime: this.currentFrame,
				uBaseColor: this.baseColor,
				uFrequency: this.lightsFPS
			});
			this.drawLightAt(-halfWidth + lightOffset, lightY, -halfDepth + lightOffset);
			this.drawLightAt(halfWidth - lightOffset, lightY, -halfDepth + lightOffset);
			this.drawLightAt(-halfWidth + lightOffset, lightY, halfDepth - lightOffset);
			this.drawLightAt(halfWidth - lightOffset, lightY, halfDepth - lightOffset);

			this.scene.setActiveShader(this.scene.defaultShader);
		} else {
			this.helipad[this.currentIndex].display();
			this.scene.popMatrix();

			this.drawLightAt(-halfWidth + lightOffset, lightY, -halfDepth + lightOffset);
			this.drawLightAt(halfWidth - lightOffset, lightY, -halfDepth + lightOffset);
			this.drawLightAt(-halfWidth + lightOffset, lightY, halfDepth - lightOffset);
			this.drawLightAt(halfWidth - lightOffset, lightY, halfDepth - lightOffset);
		}

		// Draw the left lateral building
		this.scene.pushMatrix();
		this.scene.translate(- (this.lateralWidth + this.centralWidth/2), 0, zShift);
		this.lateralBuilding.display();
		this.scene.popMatrix();
	
		// Draw the right lateral building
		this.scene.pushMatrix();
		this.scene.translate(this.centralWidth/2, 0, zShift);
		this.lateralBuilding.display();
		this.scene.popMatrix();
	}
}