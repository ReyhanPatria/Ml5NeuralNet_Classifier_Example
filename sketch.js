let canvas;

let state = "collecting";
let neuralNet;
let neuralNetOptions;

let nodeList = [];
let nodeLabel = "A";

function setup() {
	canvas = createCanvas(windowWidth, windowHeight);

	neuralNetOptions = {
		inputs: ["x", "y"],
		outputs: ["label"],
		task: "classification",
		debug: true
	};
	neuralNet = ml5.neuralNetwork(neuralNetOptions);
}

function draw() {
	background(0, 0, 0);
	drawNodes();
	textSize(20);
	textAlign(LEFT, CENTER);
	text("Current label: " + nodeLabel, 40, 40);
	text("Current state: " + state, 40, 70);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
	nodeLabel = key.toUpperCase();
	if(nodeLabel == "T") {
		state = "training";
		console.log("Training is starting...");
		neuralNet.normalizeData();

		let trainingOptions = {
			epochs: 100
		}
		neuralNet.train(trainingOptions, whileTraining, finishedTraining);
	}
}

function mousePressed() {
	let newNode = {
		x: mouseX,
		y: mouseY,
		label: nodeLabel,
		train: ((state == "collecting") ? true : false)
	}

	if(state == "collecting") {
		let inputs = {
			x: mouseX,
			y: mouseY,
		}
		let target = {
			label: nodeLabel
		}
		neuralNet.addData(inputs, target);
	}
	else if(state == "predicting") {
		let inputs = {
			x: mouseX,
			y: mouseY,
		}
		neuralNet.classify(inputs, function(error, results) {
			newNode.label = results[0].label;
		});
	}

	nodeList.push(newNode);
}

function drawNodes() {
	for(let i = 0; i < nodeList.length; i++) {
		let x = nodeList[i].x;
		let y = nodeList[i].y;
		let label = nodeList[i].label;
		let train = nodeList[i].train;

		stroke(0);
		fill(255, 0, 0);
		if(train) {
			fill(255, 255, 255);
		}
		ellipse(x, y, 24);
		fill(0);
		noStroke();
		textAlign(CENTER, CENTER);
		textSize(15);
		text(label, x, y);
	}
}

function gotResults(error, result) {
	if(error) {
		console.log(error);
		return;
	}
	console.log(result);
}

function whileTraining(epochs, loss) {
	console.log("Current epoch: " + epochs + " Current loss: " + loss);
}

function finishedTraining() {
	console.log("Finished training");
	state = "predicting";
}
