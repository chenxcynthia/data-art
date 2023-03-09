// Dates of annual full-flowering of Japanese cherry (Prunus jamasakura) at Kyoto, Japan.
// Years range from 801 AD to 2010. Dates expressed in Gregorian calendar.
// Data was collected from 5 different studies for a total of 785 data points spanning the 9th century until 2010.
// Link to data source: http://atmenv.envi.osakafu-u.ac.jp/aono/kyophenotemp4/

let y_multiplier;
let y_final;

function preload() {
	blossom_data = loadTable('blossoms2.tsv', 'tsv', 'header');
	myFont = loadFont('medium.ttf');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(235);
	noLoop();
	textFont(myFont);
	y_multiplier = 28
	y_final = windowHeight - 50
}

function draw() {
	rows = blossom_data.getRows();
	let c = color(235, 178, 185)
	
	let period_len = 165
	let period = []
	for (let i = 0; i < 5; i += 1) {
		var freq = {}
		var keys = []
		for (let row_num = i*period_len; row_num < (i+1)*period_len; row_num += 1) {
			if (row_num >= rows.length) {
				// print(row_num)
				break
			}
			period = [rows[i*period_len].getNum('year'), rows[min((i+1)*period_len-1, rows.length-1)].getNum('year')] 
			row = rows[row_num]
			day_val = row.getNum('day')
			if (day_val in freq) {
				freq[day_val] += 1
			}
			else {
				freq[day_val] = 1
				keys.push(day_val)
			}
		}
		plotDist(keys, freq, c, i, period)
		
	}
	
	// x + y axes
	strokeWeight(0.8);
	stroke(100)
	line(100, 100, 100, y_final)
	line(100, y_final, 1400, y_final)
	noStroke()
	textSize(16)
	textAlign(CENTER);
	fill(80);
	text('Number of Years (Frequency)', 150, 90);
	text('Blossoming Date', 1320, y_final+20);
	
	// x ticks
	date_info = [[92, 'April 1'], [106, 'April 16'], [122, 'May 1']]
	for (let d of date_info) {
		textSize(14);
		textAlign(CENTER);
		noStroke();
		fill(80);
		text(d[1], calcX(d[0]), y_final+20);
		
		stroke(80);
		strokeWeight(1.3);
		line(calcX(d[0]), y_final-4, calcX(d[0]), y_final+4);
	}
	
	// y ticks
	for (let f of [5, 10, 15]) {
		y_tick = y_final - f * y_multiplier
		strokeWeight(1.3);
		stroke(80);
		line(95, y_tick, 105, y_tick);
		
		textSize(14);
		noStroke();
		fill(80);
		text(f, 75, y_tick+5);
	}
	
	textSize(16);
	text('Legend', 1065, 185);
	
	textSize(14);
	text('Blossoming dates have become earlier in the last century', 250, 260, 150)
	
	// annotation
	stroke(100);
	strokeWeight(1);
	line(330, 330, 400, 350);
	line(330, 308, 330, 330);
	
	// title
	textSize(24)
	noStroke()
	textAlign(CENTER);
	text('Kyoto Cherry Blossoming Dates Since 9th Century', windowWidth/2, 55);
}

function plotDist(keys, freq, color, i, period) {
	// add to legend
	fill(190+i*9, 220-17*i, 124+i*10, 90+i*15)
	x = 1050
	y = 200+i*28
	square_l = 15
	noStroke()
	rect(x-10, y, square_l+10, square_l)
	textSize(14);
	fill(80)
	text(period[0] + ' to ' + period[1], x + square_l + 5, y + 13);
	
	s = sort(keys)
	// 242, 211, 124
	// 240, 158, 176
	fill(190+i*9, 220-17*i, 124+i*10, 90+i*15)
	noStroke()
	stroke(250)
	// strokeWeight(1)
	beginShape();
	smooth();
	curveVertex(calcX(s[0] - 0.5), y_final)
	curveVertex(calcX(s[0]), y_final)
	for (let k of s) {
		if (freq[k] >= 0) { curveVertex(calcX(k), y_final - freq[k] * y_multiplier);}
	}
	curveVertex(calcX(s[keys.length-1]), y_final)
	curveVertex(calcX(s[keys.length-1] + 0.5), y_final)
	endShape();
}

function calcX(day) {
	return windowWidth/50*(day-86) + 100
}