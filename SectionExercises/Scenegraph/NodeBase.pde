class NodeBase {
  String mName;
  NodeBase mParent;
  ArrayList<NodeGeom> mChildren;
  boolean mVisibility;

  NodeBase() {
    mName = "untitled";//initialize default name
    mParent = null; //set default parent to null
    mChildren = new ArrayList(); //initialize child list
    mVisibility = true;//initialize default visibility
  } 

  void setName(String iName) {
    mName = iName; //set nodes name from input string
  }

  String getName() {
    return mName; //return nodes name
  }

  void addChild(NodeGeom iChild) {
    iChild.setParent(this); //set childs parent to be this node
    mChildren.add(iChild); //add input node to list of children
  }

  void removeChild(int iIndex) {
    //make sure that the input index is within the arraylist bounds
    if (iIndex >= 0 && iIndex < mChildren.size()) {
      mChildren.get(iIndex).setParent(null); //remove the parent from child node at given index
      mChildren.remove(iIndex); //remove the node at the given index
    }
  }

  NodeGeom getChild(int iIndex) {
    //make sure that the input index is within the array bounds
    if (iIndex >= 0 && iIndex < mChildren.size()) {
      return mChildren.get(iIndex); //return the child node at given index
    }
    return null; //else return null
  }

  int getChildCount() {
    return mChildren.size(); //return the number of children under current node
  }

  void setParent(NodeBase iParent) {
    mParent = iParent; //set the parent reference to a given node
  }

  NodeBase getParent() {
    return mParent; // Get a reference to the nodes parent
  }

  boolean isRootNode() {
    return(mParent == null);//return whether the node is a root.  Roots dont have parents
  }

  NodeBase getRootNode() {
    if (isRootNode()) {
      return this;
    }
    return mParent.getRootNode(); //otherwise climb up graph until we reach node
  }

  boolean getVisibility() {
    return mVisibility;
  }

  boolean getParentVisibility() {
    if (isRootNode()) {
      return mVisibility;
    } 
    return (mParent.getVisibility() && mVisibility);
  }

  void setVisibility(boolean iVisibility) {
    mVisibility = iVisibility; //set the node visibility from input
  }

  void toggleVisibility() {
    mVisibility = !mVisibility; //toggle visibility boolean
  }

  void print(int iIndent) {
    if (getVisibility()) {
      String indent = "  "; //format indentation string
      int len = indent.length() * iIndent;
      String indentStr = new String(new char[len]).replace("\0", indent);
      println(indentStr + mName);//print node info string
      int tChildCount = getChildCount();
      for (int i=0; i< tChildCount; i++) {
        mChildren.get(i).print(iIndent + 1);
      }
    }
  }
  
  //void draw(){
    
  //}

}

