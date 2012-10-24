// Art of Graphics Programming
// Section Example 004: "Storing Geometries: A Generic Approach"
// Example Stage: D (Part B)
// Course Materials by Patrick Hebron

import processing.opengl.*;

TMesh mesh;

void setup() {
  // In this stage, we fix the normals problem from the previous stage 
  // by switching the vertex order within each constituent triangle in the 
  // initMesh() method of TMeshFactory. See that class for more details. 
  // Notice that lighting now appears correctly for the terrain mesh.

  size( 800, 600, OPENGL );
  
  // Choose the number of UVs in the mesh
  int meshPointsU = 10;
  int meshPointsV = 10;
  // Choose a size for the mesh
  float sideLength = 500.0;
  
  // Using noiseSeed so that we get the same terrain
  // every time we run the program (for comparison with 004DA)
  noiseSeed(25);
  
  // Create new mesh factory
  TMeshFactory meshFactory = new TMeshFactory();
  
  // Create a new mesh object
  mesh = new TMesh();
  // Create terrain
  mesh = meshFactory.createTerrain( meshPointsU, meshPointsV, sideLength, sideLength, 0.0, sideLength/3.0, 8, 0.8 );
  
  // Center the mesh in window
  mesh.setPosition( new PVector( width/2.0, height/2.0, -200.0 ) );
}

void draw() {
  // Clear window
  background( 0 );
  // Set colors
  stroke( 255, 0, 0 );
  fill( 0, 255, 0 );
  
  // Use lights to show the effect of normals
  // (We'll look at lights more closely in a later example)
  spotLight( 255, 255, 255, mouseX, 100.0, -200.0, 0.0, 1.0, 0.0, HALF_PI, 10.0 );
  directionalLight( 100, 100, 100, 0, 1, 0 );
  
  // Draw the mesh
  mesh.draw();
}
// Class: NodeBase
// Description: A basic scenegraph object.
// Purpose: It is easy enough to keep track of a few objects within a simple program architecture. 
// As we build increasingly complex 3D scenes, however, it will become more difficult to manage objects
// and the relationships between them. Therefore, it is important to establish a data structure that can
// encapsulate some of this complexity. One common design pattern, used in modeling environments such as
// Maya as well as games and visualizations, is the "scenegraph." In this hierarchical pattern, 
// each object (or "node") can have upto one parent and an unlimited number of children. 
// Nodes that have no parent are called "root" nodes. Nodes can be set to inherit properties from 
// their parents or perform operations on their children, allowing operations to be easily cascaded
// down a scenegraph. For example, a spine object could be established as a root node, with leg objects
// as its children. Each leg would have 5 toe children. When the user moves the spine object in 3D space,
// the legs and toes will move with it automatically. If the user instead moved one of the legs, only its 
// toes would move with it. This hierarchical structure allows us to greatly reduce the complexity 
// of interacting with the scene.

class NodeBase { 
  // Scenegraph properties:
  String              mName;
  NodeBase            mParent;
  ArrayList<NodeBase> mChildren;
  // Rendering properties: 
  boolean             mVisibility;
  
  NodeBase() {
    // Initialize default name
    mName       = "untitled";
    // Initialize default visibility
    mVisibility = true;
    // Set default parent to null (no parent)
    mParent     = null;
    // Initialize child list
    mChildren   = new ArrayList();
  }
  
  void setName(String iName) {
    // Set node's name from input string
    mName = iName;
  }
  
  String getName() {
    // Return node's name
    return mName;
  }
  
  void addChild(NodeBase iChild) {
    // Set child's parent to be this node
    iChild.setParent( this );
    // Add input node to list of children
    mChildren.add( iChild );
  }
  
  void removeChild(int iIndex) {
    // Make sure that the input index is within the arraylist bounds
    if( iIndex >= 0 && iIndex < mChildren.size() ) {
      // Remove the parent reference from child node at the given index
      mChildren.get( iIndex ).setParent( null );
      // Remove the node at the given index from child list
      mChildren.remove( iIndex );
    }
  }
  
  NodeBase getChild(int iIndex) {
    // Make sure that the input index is within the arraylist bounds
    if( iIndex >= 0 && iIndex < mChildren.size() ) {
      // Return the child node at the given index
      return mChildren.get( iIndex );
    }
    // Otherwise return null (no object)
    return null;
  }
  
  int getChildCount() {
    // Return the number of children under current node
    return mChildren.size();
  }
  
  void setParent(NodeBase iParent) {
    // Set the parent reference to a given node
    mParent = iParent;
  }
  
  NodeBase getParent() {
    // Get a reference to the node's parent
    return mParent;
  }
  
  boolean isRootNode() {
    // Return whether the node is a root node
    // A root node is one that does not have a parent
    return (mParent == null);
  }
  
  NodeBase getRootNode() {
    // If node is a root, return it
    if( isRootNode() ) {
      return this;
    }
    // Otherwise, climb up scenegraph until we reach a root
    return mParent.getRootNode();
  }
  
  boolean getVisibility() {
    // Return the node's visibility
    return mVisibility;
  }
  
  boolean getParentVisibility() {
    // If node is a root, return its visibility
    if( isRootNode() ) {
      return mVisibility;
    }
    // The mVisibility of both current node and its parent (and grandparent, etc) must be true for current to be visible
    return (mParent.getVisibility() && mVisibility);
  }
  
  void setVisibility(boolean iVisibility) {
    // Set the node's visibility from input
    mVisibility = iVisibility;
  }
  
  void toggleVisibility() {
    // Toggle visibility boolean
    mVisibility = !mVisibility;
  }

  void print(int iIndent) {
    if( getVisibility() ) {
      // Format indentation string
      String indent = "  ";
      int    len = indent.length() * iIndent;
      String indentStr = new String(new char[len]).replace( "\0", indent );
      // Print node info string
      println( indentStr + mName );
      // Print children
      int tChildCount = getChildCount();
      for(int i = 0; i < tChildCount; i++) {
        mChildren.get( i ).print( iIndent + 1 );
      }
    }
  }
  
  void draw() {
    // Stub method.
  }
}
// Class: NodeGeom
// Description: A basic scenegraph object, extended to store some basic geometric data.
// Purpose: Rather than adding geometric properties such as position, rotation and scale 
// directly to the NodeBase class, we'll make a sub-class of it called NodeGeom. The programming 
// concept of a "sub-class" is, in some ways, quite like a scenegraph. A sub-class inherits 
// all of the variables and methods defined within the super-class, but can also define additional 
// variables and methods that do not exist within its super. By sub-classing NodeGeom from 
// NodeBase, rather than combining them into a single class, we increase the legibility of each.
// More importantly, we allow for the possibility that we may at some point have use for 
// non-geometric NodeBase objects. We may also want to sub-class NodeBase in other directions that
// diverge from NodeGeom's properties. In this sense, a class hierarchy could also be 
// likened to a taxonomy of species. For instance, mammals possess all animal traits plus various 
// mammal-specific traits. Dogs and cats each possess all animal and mammal traits, plus various 
// other traits that each does not share with the other. As we develop our graphics platform,
// we will build up NodeGeom's capabilities further through the TMesh class. For easy geometry
// creation and parenting, each NodeGeom will have access to a TMeshFactory.

// Define NodeGeom as a sub-class of NodeBase
class NodeGeom extends NodeBase { 
  // Geometric properties:
  PVector mPosition, mRotation, mScale;
  // Geometry factory:
  TMeshFactory    mMeshFactory;

  NodeGeom() {
    // Initialize base class (NodeBase)
    super();
    // Initialize mesh factory
    mMeshFactory = new TMeshFactory();
    // Initialize transformations
    mPosition   = new PVector( 0.0, 0.0, 0.0 );
    mRotation   = new PVector( 0.0, 0.0, 0.0 );
    mScale      = new PVector( 1.0, 1.0, 1.0 );
  }
  
  NodeGeom(PVector iPosition, PVector iRotation, PVector iScale) {
    // Initialize base class (NodeBase)
    super();
    // Initialize mesh factory
    mMeshFactory = new TMeshFactory();
    // Initialize transformations
    mPosition   = iPosition.get();
    mRotation   = iRotation.get();
    mScale      = iScale.get();
  }

  void draw() {  
    // Draw node if visible
    if( getVisibility() ) {
      // Enter node's transformation matrix
      pushMatrix();
      // Perform transformations
      translate( mPosition.x, mPosition.y, mPosition.z );
      scale( mScale.x, mScale.y, mScale.z );
      rotateX( mRotation.x );
      rotateY( mRotation.y );
      rotateZ( mRotation.z );
      // Draw node contents
      drawContents();
      // Draw children
      int tChildCount = getChildCount();
      for(int i = 0; i < tChildCount; i++) {
        getChild(i).draw();
      }
      // Exit node's transformation matrix
      popMatrix();
    }
  }
  
  void drawContents() {
    // This is a stub method. It will overrided by 
    // TMesh's method of the same name.
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
  
  void setPosition(PVector iValue) { 
    mPosition.set( iValue );
  }
  
  void setRotation(PVector iValue) { 
    mRotation.set( iValue );
  }
  
  void setScale(PVector iValue) { 
    mScale.set( iValue );
  }
  
  TMesh addMesh(int iDimU, int iDimV, float iLengthU, float iLengthV) {
    TMesh curr = mMeshFactory.createMesh( iDimU, iDimV, iLengthU, iLengthV );
    curr.setParent( this );
    addChild( curr );
    return curr;
  }
  
  TMesh addTerrain(int iDimU, int iDimV, float iLengthU, float iLengthV, float iMinHeight, float iMaxHeight, int iOctaves, float iFalloff) {
    TMesh curr = mMeshFactory.createTerrain( iDimU, iDimV, iLengthU, iLengthV, iMinHeight, iMaxHeight, iOctaves, iFalloff );
    curr.setParent( this );
    addChild( curr );
    return curr;
  }
  
  TMesh addCylinder(int iDimU, int iDimV, float iProfileRadius, float iLength) {
    TMesh curr = mMeshFactory.createCylinder( iDimU, iDimV, iProfileRadius, iLength );
    curr.setParent( this );
    addChild( curr );
    return curr;
  }
  
  TMesh addCone(int iDimU, int iDimV, float iBaseRadius, float iLength) {
    TMesh curr = mMeshFactory.createCone( iDimU, iDimV, iBaseRadius, iLength );
    curr.setParent( this );
    addChild( curr );
    return curr;
  }
  
  TMesh addTorus(int iDimU, int iDimV, float iProfileRadius, float iTorusRadius) {
    TMesh curr = mMeshFactory.createTorus( iDimU, iDimV, iProfileRadius, iTorusRadius );
    curr.setParent( this );
    addChild( curr );
    return curr;
  }
  
  TMesh addSphere(int iDimU, int iDimV, float iRadius) {
    TMesh curr = mMeshFactory.createSphere( iDimU, iDimV, iRadius );
    curr.setParent( this );
    addChild( curr );
    return curr;
  }
  
  TMesh addCube(int iDimW, int iDimH, int iDimD, float iLengthW, float iLengthH, float iLengthD) {
    TMesh curr = mMeshFactory.createCube( iDimW, iDimH, iDimD, iLengthW, iLengthH, iLengthD );
    curr.setParent( this );
    addChild( curr );
    return curr;
  }
}
// Class: TMesh
// Description: A container class for an individual 3D model.
// Purpose: Building on NodeBase and NodeGeom, TMesh stores data related
// to the representation of a geometric mesh. It uses the Tri and Vert classes
// and a cross-referencing initialization procedure to assist in the 
// straight-forward and generalized creation and manipulation of 3D models.
// All mesh generation helper functions are contained within TMeshFactory.
// To visualize the normals for the various TMesh primitives we've
// added some debug drawing methods.

int POINT_MODE    = 0;
int TRIANGLE_MODE = 1;
int TRISTRIP_MODE = 2;

class TMesh extends NodeGeom {
  int                dimensionU, dimensionV;
  PVector            mBoundsL, mBoundsH;
 
  ArrayList<Vert>    mVertices;
  ArrayList<Tri>     mTriangles;
  ArrayList<Integer> mTriStrip;
  
  int                mDrawMode;
    
  TMesh() {
    // Initialize base class (NodeGeom)
    super();
    // Initialize default bounds
    mBoundsL   = new PVector( 0.0, 0.0, 0.0 );
    mBoundsH   = new PVector( 0.0, 0.0, 0.0 );
    // Initialize arrays
    mVertices  = new ArrayList();
    mTriangles = new ArrayList();
    mTriStrip  = new ArrayList();
    // Draw triangle strips by default
    mDrawMode  = TRISTRIP_MODE;
  }
  
  void drawContents() {
    // DRAW TRIANGLE STRIPS
    if( mDrawMode == TRISTRIP_MODE ) {
      int tsCount = mTriStrip.size();
      beginShape(TRIANGLE_STRIP);
      for(int i = 0; i < tsCount; i++) {
        Vert cVert = mVertices.get( mTriStrip.get(i) );
        // Set the vertex normal
        normal( cVert.mNormal.x, cVert.mNormal.y, cVert.mNormal.z );
        // Set the vertex position
        vertex( cVert.mPosition.x, cVert.mPosition.y, cVert.mPosition.z );
      }
      endShape();
    }
    // DRAW TRIANGLES
    else if( mDrawMode == TRIANGLE_MODE ) {
      int triCount = mTriangles.size();
      beginShape(TRIANGLES);
      for(int i = 0; i < triCount; i++) {
        Tri cTri = mTriangles.get(i);
        for(int j = 0; j < 3; j++) {
          Vert cVert = cTri.getVertex( j );
          // Set the vertex normal
          normal( cVert.mNormal.x, cVert.mNormal.y, cVert.mNormal.z );
          // Set the vertex position
          vertex( cVert.mPosition.x, cVert.mPosition.y, cVert.mPosition.z );
        }
      }
      endShape();
    }
    // DRAW POINTS
    else if( mDrawMode == POINT_MODE ) {
      int tsCount = mTriStrip.size();
      beginShape(POINTS);
      for(int i = 0; i < tsCount; i++) {
        Vert cVert = mVertices.get( mTriStrip.get(i) );
        // Set the vertex position
        vertex( cVert.mPosition.x, cVert.mPosition.y, cVert.mPosition.z );
      }
      endShape();
    }
    
    // DRAW NORMALS (for debug purposes)
    stroke( 0, 0, 255 );
    float tNormLen = 20.0;
    int vCount = mVertices.size();
    beginShape(LINES);
    for(int i = 0; i < vCount; i++) {
      Vert cv = mVertices.get(i);
      vertex( cv.mPosition.x, cv.mPosition.y, cv.mPosition.z );
      vertex( cv.mPosition.x + cv.mNormal.x  * tNormLen, cv.mPosition.y + cv.mNormal.y * tNormLen, cv.mPosition.z + cv.mNormal.z  * tNormLen );
    }
    endShape();
    stroke( 255, 0, 0 );
  }
  
  Vert getVertex(int iIndex) {
    // Make sure that the input index is within the arraylist bounds
    if( iIndex >= 0 && iIndex < mVertices.size() ) {
      // Return the vertex at the given index
      return mVertices.get( iIndex );
    }
    // Otherwise return null (no object)
    return null;
  }
  
  Tri getTriangle(int iIndex) {
    // Make sure that the input index is within the arraylist bounds
    if( iIndex >= 0 && iIndex < mVertices.size() ) {
      // Return the index at the given index
      return mTriangles.get( iIndex );
    }
    // Otherwise return null (no object)
    return null;
  }

  int getVertexCount() {
    return mVertices.size();
  }
  
  int getTriangleCount() {
    return mTriangles.size();
  }
  
  int getTriangleStripIndexCount() {
    return mTriStrip.size();
  }
  
  void setDrawMode(int iMode) {
    mDrawMode = iMode;
  }
  
  int getDrawMode() {
    return mDrawMode;
  }
  
  PVector getBoundsLow() {
    return mBoundsL;
  }
  
  PVector getBoundsHigh() {
    return mBoundsH;
  }
  
  PVector getCentroid() {
    PVector tCentroid = PVector.sub( mBoundsH, mBoundsL );
    tCentroid.div( 2.0 );
    return tCentroid;
  }
  
  void computeBounds() {
    float maxv  = 999999999.9;
    mBoundsL.set( maxv, maxv, maxv );
    mBoundsH.set( -maxv, -maxv, -maxv );
    int vCount = mVertices.size();
    for(int i = 0; i < vCount; i++) {
      PVector cV = mVertices.get(i).getPosition();
      mBoundsL.x = min( mBoundsL.x, cV.x );
      mBoundsL.y = min( mBoundsL.y, cV.y );
      mBoundsL.z = min( mBoundsL.z, cV.z );
      mBoundsH.x = max( mBoundsH.x, cV.x );
      mBoundsH.y = max( mBoundsH.y, cV.y );
      mBoundsH.z = max( mBoundsH.z, cV.z );
    }
  }
}
// Class: TMeshFactory
// Description: A helper class for the construction of geometric primitives.
// Purpose: Building on the SE_003 example stages, the TMeshFactory class
// encapsulates mesh, terrain, cylinder, cone, torus, and sphere generators
// in a straight-forward API. (Cube coming soon) Each method returns a pre-built
// TMesh object based on the input specifications. In addition to UV and vertex positioning,
// TMeshFactory also handles the automatic generation of vertex normals. For some primitives,
// this is done using Vert's computeNormal() method and in other cases a simpler, less 
// computationally-heavy approach is taken. In the initMesh() method, we've reconfigured the
// vertex order for the triangles within each rectangular subdivision. (See below)
// Old order: ABC, BCD, ABC, BCD
// New order: CBA, BCD, ABC, DBC 

class TMeshFactory {
  
  TMeshFactory() {
  }
  
  TMesh createMesh(int iDimU, int iDimV, float iLengthU, float iLengthV) {
    // Initialize a basic mesh
    TMesh tMesh = initMesh( iDimU, iDimV );
    
    // Center the mesh about the TMesh's origin
    float halfLenU = iLengthU/2.0;
    float halfLenV = iLengthV/2.0;
    
    // Set vertex positions and normals
    int vCount = tMesh.mVertices.size();
    for(int i = 0; i < vCount; i++) {
      PVector currUV = tMesh.mVertices.get(i).getUV();
      tMesh.mVertices.get(i).setPosition( new PVector( currUV.x * iLengthU - halfLenU, currUV.y * iLengthV - halfLenV, 0.0 ) );
      tMesh.mVertices.get(i).setNormal( new PVector( 0.0, 0.0, 1.0 ) );
    }
    // Compute bounding box for mesh geometry
    tMesh.computeBounds();

    // Return the geometry
    return tMesh;
  }
  
  TMesh createTerrain(int iDimU, int iDimV, float iLengthU, float iLengthV, float iMinHeight, float iMaxHeight, int iOctaves, float iFalloff) {
    // Initialize a basic mesh
    TMesh tMesh = initMesh( iDimU, iDimV );
    
    // Center the mesh about the TMesh's origin
    float halfLenU = iLengthU/2.0;
    float halfLenV = iLengthV/2.0;
    
    // Set perlin noise properties
    noiseDetail( iOctaves, iFalloff );
    
    // Set vertex positions
    int vCount = tMesh.mVertices.size();
    for(int i = 0; i < vCount; i++) {
      PVector currUV  = tMesh.mVertices.get(i).getUV();
      float tHeight   = map( noise( currUV.x,  currUV.y ), 0.0, 1.0, iMinHeight, iMaxHeight );
      PVector currPos = new PVector( currUV.x * iLengthU - halfLenU, tHeight , currUV.y * iLengthV - halfLenV );
      tMesh.mVertices.get(i).setPosition( currPos );
    }
    // Compute normals
    for(int i = 0; i < vCount; i++) {
      tMesh.mVertices.get(i).computeNormal();
    }
    // Compute bounding box for mesh geometry
    tMesh.computeBounds();

    // Return the geometry
    return tMesh;
  }
  
  TMesh createCylinder(int iDimU, int iDimV, float iProfileRadius, float iLength) {
    // Initialize a basic mesh
    TMesh tMesh = initMesh( iDimU, iDimV );
    
    int vCount = tMesh.getVertexCount();
    for(int i = 0; i < vCount; i++) {
      // Get current UV
      PVector currUV = tMesh.mVertices.get(i).getUV();
      
      // We find our position along the circumference of the current profile by
      // lerping the U coordinate (radial axis) in the range 0.0 .. 2PI
      float thetaU = TWO_PI * currUV.x;
      
      // Using thetaU, we find the coordinates of the current point in relation to the center of the current profile
      // and then multiply these coordinates by the profile radius to size it appropriately.
      // Here we are thinking of the current profile as a circle inscribed in a plane spanning the X and Y axes.
      float x = iProfileRadius * cos(thetaU);
      float y = iProfileRadius * sin(thetaU);
    
      // We find the z-value of the current vertex by computing the length of one cylinder segment
      // and then multiplying this by current index in the V axis (non-radial axis) of our mesh.
      // Also, subtract half the cylinder's length to center about the origin.
      float z = iLength * currUV.y - iLength/2.0;

      // Set vertex position
      tMesh.mVertices.get(i).setPosition( new PVector( x, y, z ) );
      
      // Set vertex normal
      PVector currNorm = new PVector( x, y, 0.0 );
      currNorm.normalize();
      tMesh.mVertices.get(i).setNormal( currNorm );
    }
    // Compute bounding box for mesh geometry
    tMesh.computeBounds();

    // Return the geometry
    return tMesh;
  }
  
  TMesh createCone(int iDimU, int iDimV, float iBaseRadius, float iLength) {
    // Initialize a basic mesh
    TMesh tMesh = initMesh( iDimU, iDimV );
    
    // A cone is much like a cylinder, except that its radius tapers to zero as we move down its length.
    
    int vCount = tMesh.getVertexCount();
    for(int i = 0; i < vCount; i++) {
      // Get current UV
      PVector currUV = tMesh.mVertices.get(i).getUV();
      
      // We find our position along the circumference of the current profile by
      // lerping the U coordinate (radial axis) in the range 0.0 .. 2PI
      float thetaU = TWO_PI * currUV.x;
      
      // Using thetaU, we find the coordinates of the current point in relation to the center of the current profile
      // and then multiply these coordinates by the profile radius to size it appropriately.
      // Here we are thinking of the current profile as a circle inscribed in a plane spanning the X and Y axes.
      // Taper the radius of each profile based on our position along the V axis
      float x = (iBaseRadius * currUV.y) * cos(thetaU);
      float y = (iBaseRadius * currUV.y) * sin(thetaU);
    
      // We find the z-value of the current vertex by computing the length of one cylinder segment
      // and then multiplying this by current index in the V axis (non-radial axis) of our mesh.
      // Also, subtract half the cylinder's length to center about the origin.
      float z = iLength * currUV.y - iLength/2.0;

      // Set vertex position
      tMesh.mVertices.get(i).setPosition( new PVector( x, y, z ) );
    }
    // Compute normals
    for(int i = 0; i < vCount; i++) {
      tMesh.mVertices.get(i).computeNormal();
    }
    // Compute bounding box for mesh geometry
    tMesh.computeBounds();

    // Return the geometry
    return tMesh;
  }
  
  TMesh createTorus(int iDimU, int iDimV, float iProfileRadius, float iTorusRadius) {
    // Initialize a basic mesh
    TMesh tMesh = initMesh( iDimU, iDimV );
    
    // This method of building a torus will center the geometry about the origin.
    
    int vCount = tMesh.getVertexCount();
    for(int i = 0; i < vCount; i++) {
      // Get current UV
      PVector currUV = tMesh.mVertices.get(i).getUV();
      
      // We find our position along the circumference of the current profile by
      // multiplying the angle of a single step in the circular profile by the current index in the U axis (radial axis).
      float thetaU  = TWO_PI * currUV.x;
      float thetaV  = TWO_PI * currUV.y;
      
      float thetaUn = TWO_PI * (currUV.x * (tMesh.dimensionU - 1) + 1.0) / (tMesh.dimensionU - 1);
      float thetaVn = TWO_PI * (currUV.y * (tMesh.dimensionV - 1) + 1.0) / (tMesh.dimensionV - 1);
      
      // Calculate the current position along the circumference of the torus, this will be the center point of the current profile
      PVector currProfileCenter = new PVector( iTorusRadius * cos(thetaV), iTorusRadius * sin(thetaV), 0.0 );
      // Compute the vector between the next profile center point to the current one
      PVector dirToNextCenter = currProfileCenter.get();
      dirToNextCenter.sub(new PVector( iTorusRadius * cos(thetaVn), iTorusRadius * sin(thetaVn), 0.0 ));
      dirToNextCenter.normalize();
      
      // Get the up axis for the plane upon which the current profile resides.
      // We can find this by taking the cross product of our vector between profiles centers and a vector traveling along the z-axis, 
      // which is the axis of rotation for the placement of profile centers.
      PVector upVec = dirToNextCenter.cross(new PVector(0.0,0.0,1.0));
      upVec.normalize();
      upVec.mult(iProfileRadius);  
      
      // Compute the position of the current vertex on the profile plane.
      // We can think of the rotateAroundAxis() function as being somewhat like a clock:
      // upVec represents the direction of the hour hand is pointing.
      // dirToNextCenter represents the center peg, which holds the clock's hand in place.
      // When we turn this center peg, the hour hand rotates around the face of the clock.
      PVector currPoint = rotateAroundAxis( upVec, dirToNextCenter, thetaU );
      
      // Set normal
      PVector currNorm = currPoint.get();
      currNorm.normalize();
      tMesh.mVertices.get(i).setNormal( currNorm );
      // Now we need position the current vertex in relation to the current profile's center point.
      currPoint.add(currProfileCenter);
      // Set vertex position
      tMesh.mVertices.get(i).setPosition( currPoint );
    }
    // Compute bounding box for mesh geometry
    tMesh.computeBounds();

    // Return the geometry
    return tMesh;
  }
  
  TMesh createSphere(int iDimU, int iDimV, float iRadius) {
    // Initialize a basic mesh
    TMesh tMesh = initMesh( iDimU, iDimV );
    
    // This method of building a sphere will center the geometry about the origin.
    
    int vCount = tMesh.getVertexCount();
    for(int i = 0; i < vCount; i++) {
      // Get current UV
      PVector currUV = tMesh.mVertices.get(i).getUV();
      
      // Find the current angle within the current longitudinal profile
      float thetaU  = TWO_PI * currUV.x;
      // Find the current angle within the latitudinal arc, 
      // offseting by a quarter circle (HALF_PI) so that we start at the pole
      // rather than the equator
      float thetaV  = PI * currUV.y - HALF_PI;
      
      // Compute the current position on the surface of the sphere
      float x = iRadius * cos(thetaV) * cos(thetaU);
      float y = iRadius * cos(thetaV) * sin(thetaU);
      float z = iRadius * sin(thetaV);
      tMesh.mVertices.get(i).setPosition( new PVector( x, y, z ) );
      
      // Set normal
      PVector currNorm = new PVector( x, y, z );
      currNorm.normalize();
      tMesh.mVertices.get(i).setNormal( currNorm );
    }
    
    // Compute bounding box for mesh geometry
    tMesh.computeBounds();

    // Return the geometry
    return tMesh;
  }
  
  TMesh createCube(int dimW, int dimH, int dimD, float lengthW, float lengthH, float lengthD) {
    return null; // TODO!!
  }
  
  TMesh initMesh(int iDimensionU, int iDimensionV) {
    TMesh tMesh = new TMesh();
    
    // Initialize the mesh for the given UV dimensions
    // Notice that we do not set vertex positions within this method.
    // We setup our UV coordinates and create the connections necessary
    // to access data in vertex, triangle or triangle strip format.
    
    // Mesh must have at least 2 points per axis
    iDimensionU = max(iDimensionU,2);
    iDimensionV = max(iDimensionV,2);
    // Set mesh dimensions
    tMesh.dimensionU = iDimensionU;
    tMesh.dimensionV = iDimensionV;
    
    // Initialize vertices and setup the mesh UV coordinates
    for(int v = 0; v < iDimensionV; v++) {
      for(int u = 0; u < iDimensionU; u++) {
        Vert cVert = new Vert();
        cVert.setUV( (float)u/(iDimensionU - 1), (float)v/(iDimensionV - 1) );  
        tMesh.mVertices.add( cVert );
      }
    }
    
    // Setup subdivisions (triangles and triangle strip)
    for(int v = 0; v < iDimensionV - 1; v++) {
      // Determine the direction of the current row
      boolean goingRight = (v % 2 == 0);
      
      // Find the indices for the first and last column of the row
      int firstCol = 0;
      int lastCol  = iDimensionU - 1;
      
      // Get the current column index, direction dependent
      int u = ( goingRight ) ? ( firstCol ) : ( lastCol );
      
      // Iterate over each column in the row
      boolean rowComplete = false;
      while( !rowComplete ) {
        // For each column, determine the indices of the current rectangular subdivision
        // This depends on whether we're going right or left in the current row
        int iA, iB, iC, iD;
        if( goingRight ) {
          // Rightward triangles cba, bcd:
          // a   c
          // 
          // b   d
          //
          // Note the vertex order abc/cba and bcd/dcb is important for correct surface normal orientation
        
          // Get the four indices of the current subdivision
          iA = (v) * (iDimensionU) + (u);
          iB = (v + 1) * (iDimensionU) + (u);
          iC = (v) * (iDimensionU) + (u + 1);
          iD = (v + 1) * (iDimensionU) + (u + 1);
          
          // Add the two triangles of the current subdivision
          Tri iCBA = new Tri( tMesh.mVertices.get( iC ), tMesh.mVertices.get( iB ), tMesh.mVertices.get( iA ), iC, iB, iA );
          tMesh.mTriangles.add( iCBA );
          Tri iBCD = new Tri( tMesh.mVertices.get( iB ), tMesh.mVertices.get( iC ), tMesh.mVertices.get( iD ), iB, iC, iD );
          tMesh.mTriangles.add( iBCD );
        }
        else {
          // Leftward triangles abc, dcb
          // c   a
          // 
          // d   b
          //
          // Note the vertex order abc/cba and bcd/dcb is important for correct surface normal orientation
          
          // Get the four indices of the current subdivision
          iA = (v) * (iDimensionU) + (u);
          iB = (v + 1) * (iDimensionU) + (u);
          iC = (v) * (iDimensionU) + (u - 1);
          iD = (v + 1) * (iDimensionU) + (u - 1);
          
          // Add the two triangles of the current subdivision
          Tri iABC = new Tri( tMesh.mVertices.get( iA ), tMesh.mVertices.get( iB ), tMesh.mVertices.get( iC ), iA, iB, iC );
          tMesh.mTriangles.add( iABC );
          Tri iDCB = new Tri( tMesh.mVertices.get( iD ), tMesh.mVertices.get( iC ), tMesh.mVertices.get( iB ), iD, iC, iB );
          tMesh.mTriangles.add( iDCB );          
        }
        
        // Add the four indices of current subdivision to triangle strip
        tMesh.mTriStrip.add( iA );
        tMesh.mTriStrip.add( iB );
        tMesh.mTriStrip.add( iC );
        tMesh.mTriStrip.add( iD );
        
        // Iterate through each column in the row, direction dependent 
        if( goingRight ) {
          u++;
        }
        else {
          u--;
        }
        
        // Check whether we've reached the end of the row
        if( ( goingRight && u == lastCol ) || ( !goingRight && u == firstCol ) ) {
          // At the end of the row, add last index of current subdivision
          // two more times to create "degenerate triangles"
          tMesh.mTriStrip.add( iD );
          tMesh.mTriStrip.add( iD );
          // Prepare to exit row
          rowComplete = true;
        }
      }
    }
    return tMesh;
  }
  
  PVector rotateAroundAxis(PVector vec, PVector a, float t) {
    float s = sin(t);
    float c = cos(t);
    PVector u = new PVector(a.x*vec.x,a.x*vec.y,a.x*vec.z);
    PVector v = new PVector(a.y*vec.x,a.y*vec.y,a.y*vec.z);
    PVector w = new PVector(a.z*vec.x,a.z*vec.y,a.z*vec.z);
    PVector out = new PVector(a.x * (u.x + v.y + w.z) + (vec.x * (a.y * a.y + a.z * a.z) - a.x * (v.y + w.z)) * c + (v.z - w.y) * s,
  		              a.y * (u.x + v.y + w.z) + (vec.y * (a.x * a.x + a.z * a.z) - a.y * (u.x + w.z)) * c + (w.x - u.z) * s,
  			      a.z * (u.x + v.y + w.z) + (vec.z * (a.x * a.x + a.y * a.y) - a.z * (u.x + v.z)) * c + (u.y - v.x) * s);
    return out;       
  }
}
// Class: Tri
// Description: A container class for the components of an individual triangle.
// Purpose: In order to assist the creation and intuitive manipulation of geometries, it is
// helpful to cross-reference the components and sub-components of a geometry.
// A Tri object stores a reference to the three Verts that comprise the triangle.
// The Tri object also store the index numbers for the position of each Vert object within
// a TMesh's mVertices arraylist. These two modes of accessing the constituent vertices
// allow us to manipulate geometries more easily. To assist with vertex normal and related
// calculations, Tri also implements getSurfaceNormal() and getCentroid().

class Tri {
  Vert[]    mVertices;
  int[]     mVertexIndices;
  
  Tri(Vert iVA, Vert iVB, Vert iVC, int iA, int iB, int iC) {
    // Initialize index array
    mVertexIndices = new int[3];
    // Initialize vertex array
    mVertices      = new Vert[3];

    setVertices( iVA, iVB, iVC );
    setIndices( iA, iB, iC );
  }
  
  void setVertices(Vert iVA, Vert iVB, Vert iVC) {
    // Add triangle reference to each vertex
    iVA.addTriangleRef( this );
    iVB.addTriangleRef( this );
    iVC.addTriangleRef( this );
    // Set vertices
    mVertices[0] = iVA;
    mVertices[1] = iVB;
    mVertices[2] = iVC;
  }
  
  void setIndices(int iA, int iB, int iC) {
    // Set indices
    mVertexIndices[0] = iA;
    mVertexIndices[1] = iB;
    mVertexIndices[2] = iC;
  }
  
  PVector getCentroid() {
    // The centroid is the average position of the three vertices
    PVector centroid = new PVector( 0.0, 0.0, 0.0 );
    centroid.add( mVertices[0].mPosition );
    centroid.add( mVertices[1].mPosition );
    centroid.add( mVertices[2].mPosition );
    centroid.div( 3 );
    return centroid;
  }
  
  Vert getVertex(int iVertexNumber) {
    // Make sure that the vertex number is in range
    // 0: Vertex A, 1: Vertex B, 2: Vertex C
    iVertexNumber = max( 0, iVertexNumber );
    iVertexNumber = min( 2, iVertexNumber );
    // Return the vertex associated with given vertex number
    return mVertices[iVertexNumber];
  }
  
  int getVertexIndex(int iVertexNumber) {
    // Make sure that the vertex number is in range
    // 0: Vertex A, 1: Vertex B, 2: Vertex C
    iVertexNumber = max( 0, iVertexNumber );
    iVertexNumber = min( 2, iVertexNumber );
    // Return the index associated with given vertex number
    return mVertexIndices[iVertexNumber];
  }
  
  PVector getSurfaceNormal() {
    // Compute the vectors for sides BA and CA
    PVector ba = PVector.sub( getVertex(1).mPosition, getVertex(0).mPosition );
    PVector ca = PVector.sub( getVertex(2).mPosition, getVertex(0).mPosition );
    // The cross product of BA and CA give us the surface normal
    PVector n  = ba.cross( ca );
    n.normalize();
    return n;
  }
}
// Class: Vert
// Description: A container object storing data relevant to the representation of an individual vertex.
// Purpose: In order to assist the creation and intuitive manipulation of geometries, there are 
// several points of information that we should store for each vertex in addition to its position.
// This includes the 2D UV coordinates used in mesh initialization and texture mapping. We also store a list of the 
// triangles of which the vertex is a member as well as a normal vector, which represents the "orientation" 
// of the vertex and is necessary for proper lighting calculations. Since a single point in space, by definition,
// has no dimension, its orientation is a bit of an abstraction. We determine the vertex normal by aggregating
// the surface normals of the triangles of which the vertex is a component. For this reason, it is important
// that we've already cross-referenced vertices with mTriangleSet. To further simplify calculations of this kind,
// we've added computeNormal() and getConnectedVertices().

import java.util.Set;

class Vert {
  PVector   mPosition;
  PVector   mNormal;
  PVector   mUV;
  
  Set<Tri>  mTriangleSet;
    
  Vert() {
    mPosition    = new PVector( 0.0, 0.0, 0.0 );
    mNormal      = new PVector( 0.0, 0.0, 0.0 );
    mUV          = new PVector( 0.0, 0.0 );
    mTriangleSet = new HashSet();
  }
  
  void addTriangleRef(Tri iTriangle) {
    // Store references to the triangles that
    // contain this vertex
    mTriangleSet.add( iTriangle );
  }
  
  void setPosition(PVector iPosition) {
    mPosition.set( iPosition );
  }
  
  PVector getPosition() {
    return mPosition;
  }
  
  Set<Vert> getConnectedVertices() {
    // Return the set of vertices that are connected
    // to this one by one or more triangles in mTriangleSet
    Set<Vert> tConnected = new HashSet();
    Iterator it = mTriangleSet.iterator();
    while( it.hasNext() ) {
      Tri currTri = (Tri)it.next();
      for(int i = 0; i < 3; i++) {
        tConnected.add( currTri.getVertex(i) );
      }
    } 
    return tConnected;
  }
  
  void computeNormal() {
    // For the 2D and 3D primitives, it is generally straight-forward to compute the vertex normal.
    // For a sphere, each vertex normal can be computed as the normalized vector between the sphere's center and the given vertex position.
    // With many complex geometries, such as our Perlin terrain, vertex normals are harder to compute.
    // First we get the surface normal for every triangle of which the current vertex is a part.
    // (TMeshFactory inserts the necessary connections into mTriangleSet when the geometry is initialized.)
    // We sum all connected surface normals
    PVector tNormal = new PVector( 0.0, 0.0, 0.0 );
    Iterator it = mTriangleSet.iterator();
    while( it.hasNext() ) {
      Tri currTri = (Tri)it.next();
      tNormal.add( currTri.getSurfaceNormal() );
    } 
    // Then normalize this sum and set the normal value
    tNormal.normalize();
    mNormal.set(tNormal);
    // We could use this function with all of our TMeshFactory methods, 
    // but when normal value is obvious, it is more efficient to skip this process.
  }
  
  void reverseNormal() {
    mNormal.mult( -1.0 );
  }
  
  void setNormal(PVector iNormal) {
    mNormal.set( iNormal );
  }
  
  PVector getNormal() {
    return mNormal;
  }
  
  void setUV(float iU, float iV) {
    // Set the 2D UV coordinate
    mUV.set( iU, iV, 0.0 );
  }
  
  PVector getUV() {
    return mUV;
  }
}

