NodeBase root;

void setup() {
  root = new NodeBase();
  root.setName("root");

  NodeBase childA = new NodeBase();
  childA.setName("childA");
  root.addChild(childA);

  NodeBase childB = new NodeBase();
  childB.setName("childB");
  root.addChild(childB);

  NodeBase childC = new NodeBase();
  childC.setName("childC");
  root.addChild(childC);


  NodeBase childA1 = new NodeBase();
  childA1.setName("childA1");
  childA.addChild(childA1);

  NodeBase childA2 = new NodeBase();
  childA2.setName("childA2");
  childA.addChild(childA2);

  NodeBase childB1 = new NodeBase();
  childB1.setName("childB1");
  childB.addChild(childB1);

  NodeBase childC1 = new NodeBase();
  childC1.setName("childC1");
  childC.addChild(childC1);


  NodeBase childA1A = new NodeBase();
  childA1A.setName("childA1A");
  childA1.addChild(childA1A);
}

void draw() {
  if (frameCount % 60 == 0) {
    println("---------------------");
    root.print( 0 ); // print graph/tree
  
    //toggle childA visibility
    NodeBase childA = root.getChild(0);
    if(childA != null){
      childA.toggleVisibility(); 
    }
    
    
  }
}

