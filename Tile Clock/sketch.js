let hr;

function setup() {
	createCanvas(windowWidth, windowHeight);
}

function draw() {
	// color palette
	let pale_yellow = color(240, 210, 180);
	let dark_yellow = color(205, 175, 145);
	let dark_navy = color(25, 65, 90);
	let light_navy = color(60, 100, 125);
	
	hr = hour();
	
	let bkg;
	let square;
	let highlight;
	// define color theme based on am/pm
	if (hr < 12) {
		bkg = pale_yellow
		square = dark_yellow
		highlight = light_navy
	}
	else {
		bkg = dark_navy
		square = light_navy
		highlight = dark_yellow
	}
	
	background(bkg);
	
	height = windowHeight/3;
	
	let padding = height - 20;
	let dim = height - 34;
	let x = (windowWidth - padding*4)/2;
	// print(hr)
	for(let i = 0; i < 4; i++) {
		let y = 28;
		for (let j = 0; j < 3; j++) {
			noStroke();
			
			let hr_mod = hr % 12;
			if (hr_mod == 0) {
				hr_mod = 12;
			}
			if (hr_mod == j*4 + i + 1) {
				
				fill(highlight);
				let x_start = x+15
				let y_start = y+15
				rect(x_start, y_start, dim, dim)
				
				// draw minute lines (vertical)
				let loc = x_start;
				for (let count = 0; count < minute(); count++) {
					loc += dim/61;
					strokeWeight(1.2);
					stroke(bkg);
					line(loc, y_start, loc, y_start + dim);
				}
				
				// draw second line
				let second_y = y_start + dim * second()/60
				stroke(bkg);
				strokeWeight(1.8);
				line(x_start, second_y, x_start + dim, second_y);
				
				
			}
			else {
				fill(square);
				rect(x+15, y+15, dim, dim)
			}
			y += padding
		}
		x += padding
	}
	
}