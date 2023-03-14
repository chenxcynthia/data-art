// data source: http://www.amber-boydstun.com/supplementary-information-for-making-the-news.html
// codebook: http://www.amber-boydstun.com/uploads/1/0/6/5/106535199/nyt_front_page_policy_agendas_codebook.pdf

let filler_words = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 
										'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 
										'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which',
										'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 
										'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 
										'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 
										'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 
										'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 
										'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
										'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', "don't", 'should', "should've", 
										'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", "couldn't", 'didn', "didn't", 'doesn', 
										"doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't",
										'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", "weren't", 'won', "won't",
										'wouldn', "wouldn't", 'may']
let slider;
// let freq_all = {};
let word_info = {};
let rows
let freq_global = {};
let words_global = [];
let num_frames = 20;

function preload() {
	// data = loadTable('nyt2.csv', 'csv', 'header');
	data = loadTable('nyt3.csv', 'csv', 'header');
	// myFont = loadFont('medium.ttf');
	nytFont = loadFont('nyt_font.otf');
	myFont = loadFont('medium.ttf');
}


function setup() {
	createCanvas(windowWidth, windowHeight);
	background(255)
	
	// randomSeed(1);
	randomSeed(5);
	rows = data.getRows();
	for (let row of rows) {
		summary = split(row.getString('summary'), ' ');
		for (let word of summary) { 
			if (!(word in word_info)) {
				word_info[word] = [[120+random(1150), 135+random(400)], row.getNum('majortopic')]
			}
		}
	}
	// slider = createSlider(1996, 2006, 11);
	slider = createSlider(num_frames - 5, 11*num_frames - 1, 8);
  slider.position(windowWidth/3, windowHeight-50);
  slider.style('width', '500px');
	
	for (y = 1996; y <= 2006; y += 1) {
		update_freq_year(y);
	}
	// fill in rest with zeros
	for (let k of words_global) {
		while (freq_global[k].length < num_frames * 10) {
			freq_global[k].push(0)
		}
	}
}

function update_freq_year(year) {
	let word_freq = {}
	let keys = []
	for (let row of rows) {
		if (row.getNum('year') == year) {
			let summary = split(row.getString('summary'), ' ');
			for (let word of summary) { 
				if (word in word_freq) word_freq[word] += 1
				else {
					word_freq[word] = 1
					keys.push(word)
				}
			}
		}
	}
	
	year_i = year - 1996
	for (let k of keys) {
		let is_filler = false
		for (let filler of filler_words) {
			if (k == filler) is_filler = true
		}
		if (word_freq[k] >= 15 && is_filler === false) {
			if (!(k in freq_global)) {
				words_global.push(k)
				freq_global[k] = []
				// add n-1 * num_frames of 0
				for (let i = 1; i <= num_frames * year_i; i += 1) {
					freq_global[k].push(0)
				}
			}
			
			// if not up to date on frames, fill in with 0's
			while (freq_global[k].length < num_frames * year_i) {
				freq_global[k].push(0)
			}
			
			// transition from prev to word_freq[k]
			if (freq_global[k].length == 0) prev_freq = 0
			else prev_freq = freq_global[k][freq_global[k].length  - 1]
			
			step_size = (word_freq[k] - prev_freq)/num_frames
			
			for (let i = 1; i <= num_frames; i += 1) {
				freq_global[k].push(prev_freq + step_size*i)
			}
		}
	}
}

function draw() {
	let val = slider.value();
	let slider_year = int(1996+val/num_frames)
  background(240);
	
	// textFont(myFont);
	textSize(30)
	noStroke()
	fill(10)
	textAlign(CENTER);
	text('What did the U.S. care about in ' + str(slider_year) + '?', windowWidth/2, 70);
	
	strokeWeight(1.5);
	stroke(0);
	line(898, 78, 958, 78)
	noStroke()
	
	textSize(24)
	fill(30)
	text(1996, 430, windowHeight-33)
	text(2006, 1030, windowHeight-33)
	draw_time(val)
}

function draw_time(val) {
	for (let k of words_global) {
		f = freq_global[k][val]
		if (f > 0) {
			textFont(nytFont);
			textSize(15 + f/4)
			textAlign(CENTER)
			fill(color(80, 80, 80, 35+sqrt(f)*18));
			text(k, word_info[k][0][0], word_info[k][0][1])
		}
	}

}

// function draw_year(year) {
// 	let word_freq = {}
// 	let keys = []
// 	for (let row of rows) {
// 		if (row.getNum('year') == year) {
// 			let s = row.getString('summary')
// 			let split_summary = split(s, ' ');
// 			for (let word of split_summary) { 
// 				if (word in word_freq) {
// 					word_freq[word] += 1
// 				}
// 				else {
// 					word_freq[word] = 1
// 					keys.push(word)
// 				}
// 			}
// 		}
// 	}
	
// 	for (let k of keys) {
// 		let is_filler = false
// 		for (let filler of filler_words) {
// 			if (k == filler) is_filler = true
// 		}
// 		if (word_freq[k] >= 18 && is_filler === false) {
// 			textFont(nytFont);
// 			textSize(15+word_freq[k]/5)
// 			textAlign(CENTER)
// 			fill(color(80, 80, 80, 35+sqrt(word_freq[k])*13));
// 			text(k, word_info[k][0][0], word_info[k][0][1])
// 		}
// 	}
// }