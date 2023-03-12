// data source: "How Couples Meet and Stay Together", Stanford University
// https://data.stanford.edu/hcmst
// 2660 relationships visualized
// data cleaning & processing deepnote notebook: http://tiny.cc/d1o0vz

let width
let height
let px = [];
let py;
let dy; 
// let m_widths = [0, 0, 0, 0, 0];
let rows;
let colors;
let labels;
let view ;

function preload() {
	data = loadTable('codes.csv', 'csv', 'header');
	myFont = loadFont('medium.ttf');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	// randomSeed(1);
	noLoop();
	textFont(myFont)
	background(249, 244, 239);
	
	colors = [color(230, 91, 32),  color(7, 75, 247), color(228, 118, 48), color(247, 166, 67),
						 color(51, 147, 171), color(85, 91, 92), color(34, 36, 36)]
	labels = ['Stayed Married', 'Divorced', 'Dating To Married', 'Stayed Dating', 'Broke Up', 'Widowed']
	
	view = 1
	
	width = windowWidth
	height = windowHeight
	curr = -width/4.8
	for (i = 0; i < 3; i++) {
		curr += width/5.5
		px.push(curr)
	}
	for (i = 3; i < 5; i++) {
		curr += width/4
		px.push(curr)
	}
	px[4] -= 30
	py = height/4 + 115
	dy = 3*height/4 - 55
	
	rows = data.getRows();
}

function keyPressed()
{
	if (key == ' ') { 
		view = -1*view
		draw()
	}
}
		

function draw() {
	background(247, 243, 235);
	
	for (let row of rows) {
		st = row.getString('st')
		type = row.getNum('type')
		
		beginShape();
		strokeWeight(0.08);
		smooth();
		noFill();
		if (st == 'True' && type == 0) {
			// married throughout
			stroke(colors[0])
			throughout(py)
		}
		else if (st == 'False' && type >= 10) {
			// divorce
			stroke(colors[1]);
			relationship_end(py, type/10)
		}
		else if (st == 'True' && type > 0) {
			// dating to married
			stroke(colors[2]);
			strokeWeight(0.13);
			dating_to_married(type)
		}
		else if (st == 'True' && type == -1) {
			// dating throughout
			stroke(colors[3])
			throughout(dy)
		}
		else if (st == 'False' && type > 0 && type < 10) {
			// dating break up
			stroke(colors[4])
			strokeWeight(0.1);
			relationship_end(dy, type)
		}
		
		else if (st == 'False' && type < 0 && type > -10) {
			// dating -> partner passed away
			stroke(colors[5])
			strokeWeight(0.1);
			passed_away(dy, -1*type)
		}
		
		else if (st == 'False' && type <= -10) {
			// married -> partner passed away
			stroke(colors[6])
			strokeWeight(0.1);
			passed_away(py, -1*type/10)
		}
		
		endShape();
	}
	
	if (view == 1) {
		textSize(28)
		noStroke()
		fill(80);
		textAlign(RIGHT);
		// text('Romantic Relationships Over Time', windowWidth/20, 55);
		text('How Did 2660 Relationships', width/2, 80)
		text('Change Over Time?', width/2, 115)

		textSize(20)
		fill(80)
		textAlign(CENTER);
		text('Press space to investigate a single relationship.', width/2, height-50)

		textSize(18)
		textAlign(CENTER);
		timestamps = ['Feb 2009', 'March 2010', 'April 2011', 'March 2013', 'December 2014']
		// text(timestamps[0], 50, py - 100);
		for (i = 1; i < 5; i++) {
			text(timestamps[i], px[i] + 10, py - 70);
		}

		fill(255);
		textAlign(RIGHT);
		textSize(20)
		text('Married', 105, py);
		text('Dating', 105, dy);

		// legend
		fill(80);
		textSize(18)
		textAlign(LEFT);
		// leg_x = width*3/4+50
		leg_x = width/2+70
		leg_y = 50
		line_length = 20
		for (i = 0; i < labels.length; i++) {
			if (i == 2) continue
			stroke(colors[i])
			strokeWeight(3.5)
			line(leg_x, leg_y, leg_x + line_length, leg_y)
			noStroke()
			text(labels[i], leg_x + line_length + 10, leg_y + 5);
			leg_y += 24
		}
		
		stroke(120)
		strokeWeight(1.5)
		linex = width/2+20
		liney = 95
		ydiff = 60
		line(linex, liney, linex+30, liney)
		line(linex+30, liney-ydiff, linex+30, liney+ydiff)
		line(linex+30, liney+ydiff, linex+40, liney+ydiff)
		line(linex+30, liney-ydiff, linex+40, liney-ydiff)
	}
	
	if (view == -1) {
		// draw rectangle
		fill(247, 243, 235, 150);
		rect(0, 0, windowWidth, windowHeight)
		
		
		row_index = int(random(0, rows.length))
		row = rows[row_index]
		st = row.getString('st')
		type = row.getNum('type')
		
		beginShape();
		strokeWeight(2);
		smooth();
		noFill();
		returnValue = 0
		if (st == 'True' && type == 0) {
			// married throughout
			stroke(colors[0])
			throughout(py)
		}
		else if (st == 'False' && type >= 10) {
			// divorce
			stroke(colors[1]);
			returnValue = relationship_end(py, type/10)
		}
		else if (st == 'True' && type > 0) {
			// dating to married
			stroke(colors[2]);
			dating_to_married(type)
		}
		else if (st == 'True' && type == -1) {
			// dating throughout
			strokeWeight(3);
			stroke(240, 160, 50)
			throughout(dy)
		}
		else if (st == 'False' && type > 0 && type < 10) {
			// dating break up
			stroke(colors[4])
			returnValue = relationship_end(dy, type)
		}
		
		else if (st == 'False' && type < 0 && type > -10) {
			// dating -> partner passed away
			stroke(colors[5])
			returnValue = passed_away(dy, -1*type)
		}
		else if (st == 'False' && type <= -10) {
			// married -> partner passed away
			stroke(colors[6])
			returnValue = passed_away(py, -1*type/10)
		}
		endShape();
		
		drawFinalText(st, type, returnValue);
		
	}
	
	// saveCanvas('relationships', 'png');
}

function drawFinalText(st, type, returnValue) {
	textAlign(RIGHT);
	textSize(18)
	noStroke()
	
	offset = 70
	if (returnValue > 0 && returnValue < 1080) {
		textAlign(LEFT)
		x_loc = returnValue + 35
	}
	else {
		if (abs(type) > 10) t = abs(type)/10
		else t = abs(type)
		x_loc = px[t] + 70 
	}
	
	if (st == 'True' && type == 0) {
		// married throughout
		fill(colors[0])
		text('This couple stayed married throughout.', width-50, py - offset);
	}
	else if (st == 'False' && type >= 10) {
		// divorce
		fill(colors[1]);
		text('This couple was married but then divorced.', x_loc, height - 50);
	}
	else if (st == 'True' && type > 0) {
		// dating to married
		fill(colors[2]);
		text('This couple got married!', width-50, py - offset);
	}
	else if (st == 'True' && type == -1) {
		// dating throughout
		fill(240, 160, 50)
		text('This couple was dating throughout.', width-50, dy + offset);
	}
	else if (st == 'False' && type > 0 && type < 10) {
		// dating break up
		fill(colors[4])
		text('This couple was dating but then broke up.', x_loc, height - 50);
	}

	else if (st == 'False' && type < 0 && type > -10) {
		// dating -> partner passed away
		fill(colors[5])
		text('One partner from this couple passed away.', x_loc, height - 50);
	}
	else if (st == 'False' && type <= -10) {
		// married -> partner passed away
		fill(colors[6])
		text('One partner from this couple passed away.', x_loc, height - 50)
	}
	
	noFill();
}

function throughout(y_start) {
	amplitude = randomGaussian(0, 25)
	y = y_start
	curveVertex(0, y + amplitude)
	curveVertex(0, y + amplitude)
	for (i = 0; i < 4; i += 1) {
		if (i == 0)	curveVertex(px[0], y + amplitude)
		else curveVertex(px[i], y)
		curveVertex((px[i] + px[i+1])/2, y + amplitude*(1.3-i*0.2))
	}
	curveVertex(px[4], y)
	amplitude /= 1.5
	curveVertex(px[4] + 180, y + amplitude)
	curveVertex(windowWidth, y + amplitude)
	curveVertex(windowWidth,  y + amplitude)
}

function dating_to_married(time) {
	y = dy 
	amplitude = randomGaussian(0, 30)
	curveVertex(0, y + amplitude)
	curveVertex(0, y + amplitude)
	for (i = 0; i < time; i += 1) {
		if (i == 0)	curveVertex(px[0], y + amplitude)
		else curveVertex(px[i], y)
		curveVertex((px[i] + px[i+1])/2, y + amplitude)
	}
	y = py
	for (i = time; i < 4; i += 1) {
		curveVertex(px[i], y)
		curveVertex((px[i] + px[i+1])/2, y + amplitude)
	}
	curveVertex(px[4], y)
	curveVertex(windowWidth, y + randomGaussian(0, 5))
	curveVertex(windowWidth,  y + randomGaussian(0, 5))
}


function relationship_end(y, time) {
	amplitude = randomGaussian(0, 25)
	curveVertex(0, y + amplitude)
	curveVertex(0, y + amplitude)
	for (i = 0; i < time; i += 1) {
		if (i == 0)	curveVertex(px[0], y + amplitude)
		else curveVertex(px[i], y)
		curveVertex((px[i] + px[i+1])/2, y + amplitude)
	}
	curveVertex(px[time], y)
	x_dest = px[time] + random(100, 270) 
	curveVertex(x_dest, height)
	curveVertex(x_dest-100, height)
	return x_dest
}

function passed_away(y, time) {
	amplitude = randomGaussian(0, 25)
	curveVertex(0, y)
	curveVertex(0, y)
	for (i = 0; i < time; i += 1) {
		curveVertex(px[i], y)
		curveVertex((px[i] + px[i+1])/2, y + amplitude)
	}
	curveVertex(px[time], y)
	x_dest = px[time] + random(70, 100) 
	curveVertex(x_dest, height)
	curveVertex(x_dest-100, height)
	return x_dest
}


