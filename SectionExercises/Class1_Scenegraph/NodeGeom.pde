//sub-class of NodeBase
class NodeGeom extends NodeBase {
  PVector mPosition, mRotation, mScale;
  color mColor;

  int mType; //add method setType - then i can call it after creating it

  NodeGeom() {
    //initialize base class (NodeBase)
    super();
    mPosition = new PVector(0.0, 0.0, 0.0);
    mRotation = new PVector(0.0, 0.0, 0.0);
    mScale = new PVector(1.0, 1.0, 1.0);
    mColor = color(255, 255, 255);
    mType = 0;
  }

  NodeGeom(PVector iPosition, PVector iRotation, PVector iScale) {
    super();
    mPosition   = iPosition.get();
    mRotation   = iRotation.get();
    mScale      = iScale.get();
    mColor      = color( 255, 255, 255 );
    mType = 0;
  }

  void draw() {
    //draw node if visible
    if (getVisibility()) {
      pushMatrix();
      translate(mPosition.x, mPosition.y, mPosition.z);
      rotateX(mRotation.x);
      rotateY(mRotation.y);
      rotateZ(mRotation.z);
      scale(mScale.x, mScale.y, mScale.z);

      noStroke();
      fill(mColor);
      //drawRoot
      //drawRoot(mType);
      drawGeom(mType);
      
      //drawChildren
      int tChildCount = getChildCount();
      for (int i = 0; i < tChildCount; i++) {
        color tempColor = getChild(i).getColor();
        int tempType = getChild(i).getType(); //get type of child
        fill(tempColor);
        getChild(i).draw(); //change this to dynamically change/select shapes
      }

      popMatrix();
    }
  }

  int getType() {
    return mType;
  }


  PVector getPosition() {
    return mPosition;
  }

  PVector getRotation() {
    return mRotation;
  }

  PVector getScale() {
    return mScale;
  }

  void setType(int iValue) {
    mType = iValue;
  }

  void setPosition(PVector iValue) {
    mPosition.set(iValue);
  }

  void setRotation(PVector iValue) {
    mRotation.set(iValue);
  }

  void setScale(PVector iValue) {
    mScale.set(iValue);
  }

  color getColor() {
    return mColor;
  }

  void setColor(color iColor) {
    mColor = iColor;
  }



  void drawGeom(int iType) {
    if (mType == 0) {
      // draw rect here...
      beginShape();
      vertex(10, 0, 0);
      vertex(90, 0, 0);
      vertex(100, 100, 0);
      vertex(0, 100, 0);
      endShape();
    }
    else if (mType == 1) {
      // draw circle here...
      rect(25, -50, 50, 50);
    }
    else if (mType == 2) {
      //draw left eye here
      ellipse(40, -30, 10, 10);
    }
    else if (mType == 3) {
      //draw right eye here
      ellipse(60, -30, 10, 10);
    }
    else if (mType == 4) {
      //draw mouth
      rect(35, -15, 30, 5);
    }
    else if (mType == 5) {
      //draw legs
      rect(0, 100, 100, 30);
    }
    else if (mType == 6) {
      //draw feet
      rect(0, 130, 100, 25);
    }
    else if (mType == 7) {
      //draw left arm
      rect(-10, 0, 20, 60);
    }
    else if (mType == 8) {
      //draw right arm
      rect(90, 0, 20, 60);
    }
  }
}

