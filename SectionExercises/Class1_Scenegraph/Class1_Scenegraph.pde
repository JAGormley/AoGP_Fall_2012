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
  childA1A.setColor(color(255,0,0));
  childA1A.setType(2);
  childA.addChild(childA1A);
}

void draw() {
  background(0);

  translate(width/2, height/2);
  root.draw();
  
  if ( frameCount % 60 == 0 ) {
    println("-----------------");
    root.print(0);
  }
}

