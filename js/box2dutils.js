var b2Math = Box2D.Common.Math.b2Math;
var b2Mat22 = Box2D.Common.Math.b2Mat22;
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2Transform = Box2D.Common.Math.b2Transform;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2MassData = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
var b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef;

//rotate point(p), about origin(o), by degrees(d)
function rotatePoint(p, o, d){
	var np = new b2Vec2;
	p.x += (0 - o.x);
	p.y += (0 - o.y);
	np.x = (p.x * Math.cos(d * (Math.PI/180))) - (p.y * Math.sin(d * (Math.PI/180)));
	np.y = Math.sin(d * (Math.PI/180)) * p.x + Math.cos(d * (Math.PI/180)) * p.y;
	np.x += (0 + o.x);
	np.y += (0 + o.y)
	
	return np;
}

function drawWorld(world, context) {
	context.strokeStyle = 'ffffff';
	for (var j = world.m_jointList; j; j = j.m_next) {
	}
	for (var b = world.m_bodyList; b; b = b.m_next) {
		for (var s = b.GetFixtureList(); s != null; s = s.GetNext()) {
			if(s.GetBody().m_type !== 0){
				drawShape(s, context);
			}
		}
	}
}

function drawStaticWorld(world, context) {
	context.strokeStyle = 'ffffff';
	for (var j = world.m_jointList; j; j = j.m_next) {
	}
	for (var b = world.m_bodyList; b; b = b.m_next) {
		for (var s = b.GetFixtureList(); s != null; s = s.GetNext()) {
			//m_type is 0 if body is static
			if(s.GetBody().m_type === 0){
				drawShape(s, context);
			}
		}
	}
}

function drawJoint(joint, context) {
	var b1 = joint.m_body1;
	var b2 = joint.m_body2;
	var x1 = b1.m_position;
	var x2 = b2.m_position;
	var p1 = joint.GetAnchor1();
	var p2 = joint.GetAnchor2();
	context.strokeStyle = 'ffffff';
	context.beginPath();
	switch (joint.m_type) {
	case b2Joint.e_distanceJoint:
		context.moveTo(p1.x, p1.y);
		context.moveTo(p2.x, p2.y);
		break;

	case b2Joint.e_pulleyJoint:
		// TODO
		break;

	default:
		if (b1 == world.m_groundBody) {
			context.moveTo(p1.x, p1.y);
			context.moveTo(x2.x, x2.y);
		}
		else if (b2 == world.m_groundBody) {
			context.moveTo(p1.x, p1.y);
			context.moveTo(x1.x, x1.y);
		}
		else {
			context.moveTo(x1.x, x1.y);
			context.moveTo(p1.x, p1.y);
			context.moveTo(x2.x, x2.y);
			context.moveTo(p2.x, p2.y);
		}
		break;
	}
	context.stroke();
}
function drawShape(fixture, context) {
	context.strokeStyle = '#ffffff';
	context.fillStyle = 'white';
	context.lineWidth = 1; 
	context.beginPath();	
	
	
	switch (fixture.m_shape.m_type) {
	case 0://circle
    {  
	    var body = fixture.GetBody();
	    var t = body.m_xf;
    	var pos = body.GetPosition();
		var r = body.radius;
		var segments = 16.0;
		var theta = 0.0;
		var dtheta = 2.0 * Math.PI / segments;

		
		// draw circle
		context.moveTo(pos.x + r, pos.y);
		for (var i = 0; i < segments; i++) {
			var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
			var v = b2Math.AddVV(pos, d);
			context.lineTo(v.x, v.y);
			theta += dtheta;
		}
		context.lineTo(pos.x + r, pos.y);
 
		// draw radius
		context.moveTo(pos.x, pos.y);
		var ax = t.R.col1;
		var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
		context.lineTo(pos2.x, pos2.y);
    }  
    break; 
	case 1: //polygon
		{
			
			var body = fixture.GetBody();
			var t = body.m_xf;
			context.translate(t.position.x, t.position.y)
			context.rotate(body.GetAngle());
			

			//context.drawImage(crate_image, -1, -1, 2, 2);
			
			context.strokeRect(-body.w, -body.h, body.w*2, body.h*2);
			
			
			context.rotate(-body.GetAngle());
			context.translate(-t.position.x, -t.position.y)
			
			context.save();
			context.setTransform(1,0,0,1,0,0);
		}
		break;
	}
	ctx.restore();
	context.stroke();
	
}


function createWorld(){
	// Define the gravity vector
	var gravity = new b2Vec2(0.0, 10.0);
	// Allow bodies to sleep
	var doSleep = true;
	// Construct a world object
	return new b2World(gravity, doSleep);
	world.SetWarmStarting(true);
	timestep = 1.0 / 30.0;
	iterations = 10;
}

function createBox(world, x, y, width, height, angle, fixed, userData) {
	//initialize body
    var def=new b2BodyDef();
    
    if (fixed == true){
    	def.type = b2Body.b2_staticBody;
    }else{
    	def.type = b2Body.b2_dynamicBody;
    }
    
    def.position = new b2Vec2(x, y);
 
    var body=this.world.CreateBody(def);
    body.SetUserData(userData);
	body.SetAngle(angle * (Math.PI/180));
	body.SetAwake(true);
	body.w = width;
	body.h = height;
	
    //initialize shape
    var fixdef= new b2FixtureDef;
    fixdef.userData = userData;
    
    
    switch(userData){
    	case 'sensor':
    		fixdef.density=1;
    		fixdef.friction=.1;
    		fixdef.restitution=.1;
    		fixdef.isSensor=true;
    	break;
    	case 'ramp':
    		fixdef.density=1;
    		fixdef.friction=2;
    		fixdef.restitution=.1;
    		fixdef.isSensor=false;
    	break;
    	case 'prop':
    		fixdef.density=.25;
    		fixdef.friction=.1;
    		fixdef.restitution=.1;
    		fixdef.isSensor=false;
    	break;
		case 'wall':
    		fixdef.density=1;
    		fixdef.friction=.1;
    		fixdef.restitution=.001;
    		fixdef.isSensor=false;
    	break;
    	case 'projectile':
    		fixdef.density=1;
    		fixdef.friction=.8;
    		fixdef.restitution=0;
    		fixdef.isSensor=false;
    	break;
    	case 'brick':
    		fixdef.density=10;
    		fixdef.friction=1;
    		fixdef.restitution=0;
    		fixdef.isSensor=false;
    	break;
    	case 'seesaw':
    		fixdef.density=.05;
    		fixdef.friction=1;
    		fixdef.restitution=0;
    		fixdef.isSensor=false;
    	break;
    	default:
    		fixdef.density=3;
    		fixdef.friction=1;
    		fixdef.restitution=0;
    		fixdef.isSensor=false;
    	
    }
    
    
    
    
     
    fixdef.shape=new b2PolygonShape();
    fixdef.shape.SetAsBox(body.w, body.h);
    body.CreateFixture(fixdef);
	return body;
}


function createFulcrum(x,y) {
	//initialize body
    var def=new b2BodyDef();
    def.type = b2Body.b2_staticBody;
    
    def.position = new b2Vec2(x,y);
 
    var body=this.world.CreateBody(def);
    body.SetUserData('ramp');
	body.SetAwake(true);
    //initialize shape
    var fixdef= new b2FixtureDef;
    fixdef.userDate = 'ramp';
    fixdef.density=2;
    fixdef.restitution=.7;
    fixdef.isSensor=false; 
    fixdef.shape=new b2PolygonShape();

  	fixdef.shape.SetAsArray([
		new b2Vec2(0, 30),
		new b2Vec2(15,0),
		new b2Vec2(30,30)
	]);
  	
    body.CreateFixture(fixdef);
	
}





function createCircle(world, x, y, radius, fixed, userData) {

	
	var wheelBodyDef = new b2BodyDef();
    wheelBodyDef.type = b2Body.b2_dynamicBody;
    
    wheelBodyDef.position.Set(x,y);
    var wheelBody = world.CreateBody(wheelBodyDef);
    wheelBody.radius = radius;
    var wheelFixtureDef = new b2FixtureDef();
    wheelFixtureDef.shape = new b2CircleShape(radius);
    
    wheelFixtureDef.restitution = 0.01;
    wheelFixtureDef.friction = 1;
    wheelFixtureDef.density = 5;
    var wheelFixture = wheelBody.CreateFixture(wheelFixtureDef);
	
	
}


function createJoint(body1, body2){
	
	var revoluteJointDef = new  b2RevoluteJointDef();
	revoluteJointDef.Initialize(body1, body2, body1.GetWorldCenter());

	revoluteJointDef.maxMotorTorque = 1.0;
	revoluteJointDef.enableMotor = true;
	world.CreateJoint(revoluteJointDef);
	
}

function createWeldJoint(body1, body2){
	
	var weldJointDef = new b2WeldJointDef();
	weldJointDef.Initialize(body1, body2, body1.GetWorldCenter());

 	world.CreateJoint(weldJointDef);
	
}
