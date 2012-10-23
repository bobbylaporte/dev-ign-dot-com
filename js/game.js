var gWidth = 400;
var gHeight = 400;
var ctx;
var ctxStatic;
var world;
var canvasWidth;
var canvasHeight;

var stepping = false;
var timeStep = 1.0/60;
var iteration = 1;

function step() {
	//handleInteractions();
	
	
	world.Step(1 / 32, 10, 10);
    //world.DrawDebugData();
    //world.ClearForces();

	//Draw the Scene, when the browser is ready
	
	window.webkitRequestAnimationFrame(render);
	
	
	setTimeout('step()', 1 / 32);
}
var frame = 0;
function render(){
	
	if(frame === 0)
	{
		drawStaticWorld(world, ctxStatic);
	}
	stats.update();
	
	ctx.clearRect(0, 0, gWidth, gHeight);
	drawWorld(world, ctx);
	
	//TODO: Only Clear and Redraw if bodies are in motion. If everything is resting, fuck it.
	/*
	var bodiesAsleep = 0;
	var dynamicBodies = 0;
	for(var b = world.GetBodyList(); b; b=b.GetNext())
	{
	   if(b.m_type !== 0){
	   	
			dynamicBodies++;
	   	
	   		if(!b.isAwake){
	      		bodiesAsleep++;
	   		}
   		}
	}
	if(bodiesAsleep === dynamicBodies)
	{
	   console.log('fag');
	   ctx.clearRect(0, 0, gWidth, gHeight);
	   drawWorld(world, ctx);
	}else{
	   console.log(bodiesAsleep + " | " + dynamicBodies);
	}
	*/
	frame = frame+1;
}



function handleInteractions(){
	// up arrow
	
	var collision = world.m_contactList;
	player.canJump = false;
	if (collision != null){
		if (collision.GetShape1().GetUserData() == 'player' || collision.GetShape2().GetUserData() == 'player'){
			if ((collision.GetShape1().GetUserData() == 'ground' || collision.GetShape2().GetUserData() == 'ground')){
				var playerObj = (collision.GetShape1().GetUserData() == 'player' ? collision.GetShape1().GetPosition() :  collision.GetShape2().GetPosition());
				var groundObj = (collision.GetShape1().GetUserData() == 'ground' ? collision.GetShape1().GetPosition() :  collision.GetShape2().GetPosition());
				if (playerObj.y < groundObj.y){
					player.canJump = true;
				}
			}
		}
	}
	
	var vel = player.object.GetLinearVelocity();
	if (keys[38] && player.canJump){
		vel.y = -150;	
	}
	
	// left/right arrows
	if (keys[37]){
		vel.x = -60;
	}
	else if (keys[39]){
		vel.x = 60;
	}
	
	
	player.object.SetLinearVelocity(vel);
}


function initGame(){
	
	//setup debug draw
	/*    
	var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(document.getElementById("game").getContext("2d"));
    debugDraw.SetDrawScale(1.0);
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw);
	*/	
	//createBox(world, x, y, width, height, angle, fixed, userData)
	
	// create walls
	//top
	//createBox(world, 0, 0, gWidth, 10, 0, true, 'ramp');
	//left
	createBox(world, 6, gHeight/2, 5, (gHeight/2)-25, 0, true, 'wall');
	//right
	createBox(world, gWidth-6, gHeight/2, 5, (gHeight/2)-25, 0, true, 'wall');
	//bottom
	createBox(world, gWidth/2, gHeight-6, gWidth/2, 5, 0, true, 'wall');
	
	
	
	//top slant
	createBox(world, 150, 75, 5, 130, 100, true, 'ramp');
	//mid plank
	createBox(world, 250, 150, 5, 130, 90, true, 'ramp');
	//second slant
	createBox(world, 150, 225, 5, 130, 100, true, 'ramp');
	//bottom plank
	createBox(world, 250, 300, 5, 130, 90, true, 'ramp');
	//last slant
	createBox(world, 150, 360, 5, 130, 100, true, 'ramp');
	
	
	//row 1
	//See Saw
	var seesaw = createBox(world, 290, 95, 5, 35, 0, false, 'seesaw');
	var fulcrum = createBox(world, 290, 95, 2, 2, 0, true, 'prop');
	createJoint(seesaw,fulcrum);
	
	//circle
	createCircle(world, 270, 115, 15, false, 'projectile');
	
	
	//row 2
	//See Saw
	var seesaw = createBox(world, 290, 245, 5, 35, 0, false, 'seesaw');
	var fulcrum = createBox(world, 290, 245, 2, 2, 0, true, 'prop');
	createJoint(seesaw,fulcrum);
	
	//circle
	createCircle(world, 270, 265, 15, false, 'projectile');
	
	
	
	//First X
	//var vert = createBox(world, 330, 450, 5, 35, 0, false, 'seesaw');
	var horz = createBox(world, 330, 450, 5, 35, 90, false, 'seesaw');
	//createWeldJoint(vert,horz);
	var fulcrum = createBox(world, 330, 450, 2, 2, 0, true, 'prop');
	createJoint(horz,fulcrum);
	
	
	//Second X
	//var vert = createBox(world, 330, 550, 5, 35, 0, false, 'seesaw');
	var horz = createBox(world, 330, 550, 5, 35, 90, false, 'seesaw');
	//createWeldJoint(vert,horz);
	var fulcrum = createBox(world, 330, 550, 2, 2, 0, true, 'prop');
	createJoint(horz,fulcrum);
	
	
	//Third X
	//var vert = createBox(world, 330, 650, 5, 35, 0, false, 'seesaw');
	var horz = createBox(world, 330, 650, 5, 35, 90, false, 'seesaw');
	//createWeldJoint(vert,horz);
	var fulcrum = createBox(world, 330, 650, 2, 2, 0, true, 'prop');
	createJoint(horz,fulcrum);
	
	
	
	//Seesaw 1
	var seesaw = createBox(world, 320, gHeight-45, 5, 60, 90, false, 'seesaw');
	var fulcrum = createBox(world, 320, gHeight-45, 2, 2, 0, true, 'prop');
	createJoint(seesaw,fulcrum);
	//stopper
	createBox(world, 275, gHeight-35, 5, 5, 0, true, 'seesaw');
	
	
	//Seesaw 2
	var seesaw = createBox(world, 100, gHeight-45, 5, 75, 70, false, 'seesaw');
	var fulcrum = createBox(world, 100, gHeight-45, 2, 2, 0, true, 'prop');
	createJoint(seesaw,fulcrum);
	createBox(world, 40, gHeight-45, 15, 15, 70, false, 'projectile');
	
	
	//piston walls
	createBox(world, 270, 700, 5, 75, 0, true, 'prop');
	createBox(world, 245, 700, 5, 75, 0, true, 'prop');
	
	//piston
	createBox(world, 260, 730, 7, 120, 0, false, 'prop');
	
	
	
	//Seesaw 3
	var seesaw = createBox(world, 215, 450, 5, 40, 90, false, 'seesaw');
	var fulcrum = createBox(world, 215, 450, 2, 2, 0, true, 'prop');
	createJoint(seesaw,fulcrum);
	
	//box
	createBox(world, 215, 425, 7, 10, 0, false, 'brick');
	
	
	//circle
	//createCircle(world, 260, 525, 15, false, 'projectile');
	//createBox(world, 270, 510, 15, 15, 0, false, 'projectile');
	//createBox(world, 320, 510, 15, 15, 0, false, 'projectile');
	
	
	
	
	
	
	
	//create ball
	//createCircle(world, x, y, radius, fixed, userData)
	createCircle(world, 30, 20, 15, false, 'ball');

}
function handleKeyDown(evt){
	keys[evt.keyCode] = true;
}


function handleKeyUp(evt){
	keys[evt.keyCode] = false;
}
var chalk;
var stats;
Event.observe(window, 'load', function() {
	
	//Create Stats Thing
	stats = new Stats();

	// Align top-left
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';

	jQuery('body').append( stats.domElement );
	
	// render the crate sprite
	chalk = new Image();
		chalk.src = "imgs/chalk.png";
		chalk.onload = function(){
	
			world = createWorld();
			ctx = $('game').getContext('2d');
			ctxStatic = $('static').getContext('2d');
			var canvasElm = $('game');
			gWidth = parseInt(canvasElm.width);
			gHeight = parseInt(canvasElm.height);
			initGame();
			step();
			window.addEventListener('keydown',handleKeyDown,true);
			window.addEventListener('keyup',handleKeyUp,true);
	};
});


// disable vertical scrolling from arrows :)
document.onkeydown=function(){return event.keyCode!=38 && event.keyCode!=40}



