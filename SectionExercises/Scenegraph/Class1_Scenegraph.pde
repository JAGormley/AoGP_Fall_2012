import processing.opengl.*;

NodeGeom root;


void setup() {
  size(500, 500, OPENGL);
  smooth();

  root = new NodeGeom();
  root.setName("root");
  root.setColor(color(40, 40, 155));
  root.setType(0);
  
  NodeGeom childA = new NodeGeom();
  childA.setName("head");
  childA.setColor(color(255,155,0));
  childA.setType(1);
  root.addChild(childA);
  
  NodeGeom childA1A = new NodeGeom();
  childA1A.setName("leftEye");
  childA1A.setColor(color(0,0,0));
  childA1A.setType(2);
  childA.addChild(childA1A);

  NodeGeom childA1B = new NodeGeom();
  childA1B.setName("rightEye");
  childA1B.setColor(color(0,0,0));
  childA1B.setType(3);
  childA.addChild(childA1B);
  
  NodeGeom childA1C = new NodeGeom();
  childA1C.setName("mouth");
  childA1C.setColor(color(0,0,0));
  childA1C.setType(4);
  childA.addChild(childA1C);
  
  NodeGeom childB = new NodeGeom();
  childB.setName("legs");
  childB.setColor(color(155,0,0));
  childB.setType(5);
  root.addChild(childB);
  
  NodeGeom childBA1A = new NodeGeom();
  childBA1A.setName("feet");
  childBA1A.setColor(color(105,0,0));
  childBA1A.setType(6);
  childB.addChild(childBA1A);
  
  NodeGeom childC = new NodeGeom();
  childC.setName("leftArm");
  childC.setColor(color(255,155,0));
  childC.setType(7);
  root.addChild(childC);
  
  NodeGeom childD = new NodeGeom();
  childD.setName("rightArm");
  childD.setColor(color(255,155,0));
  childD.setType(8);
  root.addChild(childD);
}

void draw() {
  background(20);

  translate(width/2-50, height/2-50);
  root.draw();
  
  if ( frameCount % 60 == 0 ) {
    println("-----------------");
    root.print(0);
    
    NodeGeom childA = (NodeGeom)root.getChild( 0 );
    if( childA != null ) {
      childA.toggleVisibility();
    }
  }
}

