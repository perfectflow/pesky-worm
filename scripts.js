$(document).ready(function(){
	
	// Definitions
	var w = window.innerWidth;
	var h = window.innerHeight;
	var canvas = $("#canvas");
	var ctx = canvas[0].getContext("2d");
	ctx.canvas.width  = w;
	ctx.canvas.height = h;
	
	var cw = (w/8).toFixed();
	var d;
	var hits = 64;
	var holes_arr = new Array;
	
	//Lets create the snake now
	var snake_array; //an array of cells to make up the snake
	
	function init(){
	
		d =  rand(["up", "down", "left", "right"]); //default direction
		//console.log("At start: "+d);
		
		create_snake();
		
		//Lets move the snake now using a timer which will trigger the paint function
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 100);
		
		// Random movement
		random_move();
		
		// listen for all mousedown events on the canvas
		canvas.mousedown(function(e){handleMouseDown(e);});
		
		// handle the mousedown event
		function handleMouseDown(e){
		  mouseX = parseInt(e.clientX)/cw - 0.5; // -0.5 is to move the cursor to center (half the square which is 1.0)
		  mouseY = parseInt(e.clientY)/cw - 0.5;
		  
		  mouseX = mouseX.toFixed();
		  mouseY = mouseY.toFixed();
		  
		  //console.log(mouseX+"-"+mouseY);
		  
		 // add hole to array
		  holes_arr.push([mouseX, mouseY]);
		  
		  //check collision
		  collision = check_collision(mouseX, mouseY, snake_array);
		  //console.log(collision);
		  if (collision == true){
			  alert("You got it");
			  pauseGame();
		  }
		  
		  // decrease hits
		  hits--;
		  		  
		}
		
		
		// restore holes on time interval
		if(typeof restore_loop != "undefined") clearInterval(restore_loop);
		restore_loop = setInterval(restoreHoles, 2000);
		
		
	}
	init();
	
	function create_snake()
	{
		var length = 5; //Length of the snake
		snake_array = []; //Empty array to start with
		var rand_y = Math.floor((Math.random()* (h/cw) ) + cw);
		var rand_x = Math.floor((Math.random()* (w/cw) ) + cw);
		//console.log("XY: "+rand_x+"-"+rand_y);
		for(var i = length-1; i>=0; i--)
		{
			//This will create a horizontal snake
			snake_array.push({x: rand_x-length+i, y: rand_y});
		}
	}
	
	
	//Lets paint the snake now
	function paint(){
		//To avoid the snake trail we need to paint the BG on every frame
		//Lets paint the canvas now
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		
		// paint holes
		for(var i = 0; i < holes_arr.length; i++){
			 paint_hole(holes_arr[i][0], holes_arr[i][1]);
		}		
		
		//The movement code for the snake to come here.
		//The logic is simple
		//Pop out the tail cell and place it infront of the head cell
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;
		//These were the position of the head cell.
		//We will increment it to get the new head position
		//Lets add proper direction based movement now
		if(d == "right") nx++;
		else if(d == "left") nx--;
		else if(d == "up") ny--;
		else if(d == "down") ny++;
	
	
		// If hits a wall return	
		if(nx <= 0){
			d = "right";
			//console.log("nx: "+nx);
		}
		if(nx >= w/cw){
			d = "left";
			//console.log("nx: "+nx);
		}
		if(ny <= 0){
			d = "down";
			//console.log("ny: "+nx);
		}
		if(ny >= h/cw){
			d = "up";
			//console.log("ny: "+nx);
		}
		
		/*
		if(nx == -1){
			rand(["up", "down"]);
		}
		if(nx == w/cw){
			rand(["up", "down"]);
		}
		if(ny == -1){
			rand(["left", "right"]);
		}
		if(ny == h/cw){
			rand(["left", "right"]);
		}
		*/
		
		
		var tail = snake_array.pop(); //pops out the last cell
		tail.x = nx; tail.y = ny;
		
		snake_array.unshift(tail); //puts back the tail as the first cell
		
		for(var i = 0; i < snake_array.length; i++){
			var c = snake_array[i];
			paint_cell(c.x, c.y);
		}
		
		// Paint the hits
		var hits_text = "Hits: " + hits;
		ctx.fillStyle = "red";
		ctx.font = 'normal 40pt Calibri';
		ctx.fillText(hits_text, cw, h-cw);
	}
	
	// Painting cells
	function paint_hole(x, y){
		ctx.fillStyle = "#ccc";
		ctx.fillRect(x*cw, y*cw, cw, cw);
	}
	
	
	function paint_cell(x, y){
		
		//var under_hole = isInArray([x,y], holes_arr);
		
		//var under_hole = holes_arr.indexOf([x, y]);
		under_hole = false;
		for(var i = 0; i < holes_arr.length; i++){
			if (holes_arr[i][0] == x && holes_arr[i][1] == y){
				under_hole = true;
			}
		}
		
		
		//console.log(under_hole);
		
		if (under_hole == true){
			ctx.fillStyle = "pink";
			ctx.fillRect(x*cw, y*cw, cw, cw);
		}else {
			ctx.fillStyle = "#eee"; // aka invisible
			ctx.fillRect(x*cw, y*cw, cw, cw);
		}
		
		
	}
	
	function isInArray(value, array) {
	  return array.indexOf(value) > -1;
	}
	
	function check_collision(x, y, array){
		
		//Check all worm cells against current x/y
		for(var i = 0; i < array.length; i++){
			//console.log(x+"-"+y+" / "+array[i].x+"-"+array[i].y);
			if (array[i].x == x && array[i].y == y){
				return true;
			}
			
		}
		// when loop finishes and there is no collision detected return false
		return false;
	}
	
	function random_move(){
	
		if(typeof random_movement != "undefined") clearInterval(random_movement);
		random_interval = Math.floor((Math.random()*2000)+300);
		//console.log("Interval: "+random_interval);
		random_movement = setInterval(random_move, random_interval);
		
		if(d == "right") d = rand(["up", "down"]);
		else if(d == "left") d = rand(["up", "down"]);
		else if(d == "up") d = rand(["left", "right"]);
		else if(d == "down") d = rand(["left", "right"]);
		//console.log("Next: "+d);
	}
	
	function rand(arr){
		var size = arr.length;
		var rand = Math.floor(Math.random() * size) + 0;
		return arr[rand];
	}
	
	function restoreHoles(){
		if (holes_arr.length > 0){
			holes_arr.splice(0,1);
			console.log("hole removed");
		}
	}
	
	function pauseGame(){
		clearInterval(game_loop);
		clearInterval(restore_loop);
		clearInterval(random_movement);
	}
	
	function ContinueGame(){
		game_loop = setInterval(paint, 100);
		restore_loop = setInterval(restoreHoles, 2000);
		random_move();
	}
	
	
	$("#reload").click(function(){
		ContinueGame();
	});
	
	
	
	
	
})