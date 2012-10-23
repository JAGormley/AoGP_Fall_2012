$( document ).ready( function(){
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	setupThree()
	addLights()
	addControls();
	window.group = new THREE.Object3D()

	
	$.extend(NodeGeom, NodeBase) //extend NodeBase to NodeGeom
	$.extend(TMesh, NodeGeom) //extend NodeGeom to TMesh

	var meshPointsU = 20
	var meshPointsV = 20

	var mesh = Object.create( TMesh )
	mesh.initMesh ( meshPointsU, meshPointsV )

	//side length for square mesh
	var sideLength = 500

	//set vertex position for mesh
	for( var v = 0; v < meshPointsV; v++ ){
		for( var u = 0; u < meshPointsU; u++ ){

			//get 1D index for current vertex
			var i = v * meshPointsU + u
			//get the vertex from mesh
			var currVert = Object.create( Vert )
			currVert = mesh.getVertex( i )
			//get its uv's (this will be mapped to 0.0,1.0 in each axis)
			var currUV = new THREE.Vector3( currVert.getUV() )
			//multiply by the square's side length
			var cPos = new THREE.Vector3( currUV.x * sideLength, currUV.y * sideLength, 0.0 )
			currVert.setPosition( cPos )
		}
	}

	var m = mesh.draw()
	group.add( m )



	// var mesh = meshContainer.draw()
	// mesh.position.x = subDivisionsU * -subDivLength / 2 //center mesh
	// mesh.position.y = subDivisionsV * -subDivLength / 2 //center mesh
	// group.add(mesh)



	scene.add(group)
	loop()	
})



var Vert = {
	mPosition : new THREE.Vector3( 0.0, 0.0, 0.0 ),
	mUV : {x: 0.0, y: 0.0},
	mTriangleSet : [],

	addTriangleRef : function( iTriangle ){
		this.mTriangleSet.push( iTriangle )
	},

	setPosition : function( iPosition ){
		this.mPosition.x = iPosition.x
		this.mPosition.y = iPosition.y
		this.mPosition.z = iPosition.z
	},

	getPosition : function(){
		return this.mPosition
	},

	setUV : function( iU, iV ){
		this.mUV.x = iU
		this.mUV.y = iV
	}

	getUV : function(){
		return this.mUV
	}
}

var Tri = {
	mVertices : [],
	mVertexIndices : [],

	max : function( a, b ){
		if (a > b) ? return a : return b
	},
	min : function( a, b ){
		if (a < b) ? return a : return b
	},

	setVertices : function( iVA, iVB, iVC ){
		//add triangle reference to each vertex
		iVA.addTriangleRef( this )
		iVB.addTriangleRef( this )
		iVC.addTriangleRef( this )
		//set vertices
		this.mVertices[0] = iVA
		this.mVertices[1] = iVB
		this.mVertices[2] = iVC
	},

	setIndices : function( iA, iB, iC ){
		//set indices
		this.mVertexIndices[0] = iA
		this.mVertexIndices[1] = iB
		this.mVertexIndices[2] = iC
	},

	getVertex : function( iVertexNumber ){
		//make sure that the vertex number is in range
		//0: vertex A, 1: vertex B, 2: vertex C
		iVertexNumber = this.max( 0, iVertexNumber )
		iVertexNumber = this.min( 2, iVertexNumber )
		//return the vertex associated with given vertex number
		return this.mVertices[ iVertexNumber ]
	},

	getVertexIndex : function( iVertexNumber ){
		//make sure that the vertex number is in range
		//0: vertex A, 1: vertex B, 2: vertex C
		iVertexNumber = this.max( 0, iVertexNumber )
		iVertexNumber = this.min( 2, iVertexNumber )
		//return the index associated with given vertex number
		return this.mVertexIndices[ iVertexNumber ]
	},
	generate : function( iVA, iVB, iVC, iA, iB, iC ){
		setVertices( iVA, IVB, IVC )
		setIndices( iA, iB, iC )
	}
}

var TMesh = {
	POINT_MODE : 0,
	TRIANGLE_MODE : 1,
	TRISTRIP_MODE : 2,

	dimensionsU : undefined,
	dimensionsV : undefined,
	mVertices : [],
	mTriangles : [],
	mTriStrip : [],

	mDrawMode : TRISTRIP_MODE,

	drawContents : function(){
		//DRAW TRIANGLE STRIPS
		if(mDrawMode == TRISTRIP_MODE){
			var tsCount = this.mTriStrip.length

			for( var i=0; i < tsCount; i++ ){
				var cVert = this.mVertices[ this.mTriStrip[i] ] //***
				//***missing part of creating triangle object
			}
		}

		//DRAW TRIANGLES
		if(mDrawMode == TRIANGLE_MODE){
			var triCount = this.mTriangles.length

			for( var i=0; i < triCount; i++ ){
				var cTri = mTriangles[i]

				for( var j = 0; j < 3; j++ ){
					var cVert = cTri.getVertex( j )
					//***missing part of creating triangle object
				}
			}
		}

		//DRAW POINTS
		if(mDrawMode == POINT_MODE){
			var tsCount = this.mTriStrip.length

			for( var i=0; i < tsCount; i++ ){
				var cVert = this.mVertices[i]
			}
		}
	},

	getVertex : function( iIndex ){
		//make sure that the input index is within the arrays bounds
		if( iIndex >= 0 && iIndex < this.mVertices.length ){
			return this.mVertices[iIndex]
		}else{
			return null
		}
	},

	getTriangle : function(){
		if( iIndex >= 0 && iIndex < this.mVertices.length ){
			return this.mTriangles[iIndex]
		}else{
			return null
		}
	},

	getVertexCount : function(){
		return mVertices.length
	},

	getTriangleCount : function(){
		return this.mTriangles.length
	},

	getTriangleStripIndexCount : function(){
		return mTriStrip.length
	},

	setDrawMode : function( iMode ){
		this.mDrawMode = iMode
	},

	getDrawMode : function(){
		return this.mDrawMode
	},

	max : function( a, b ){
		if (a > b) ? return a : return b
	},

	initMesh : function( iDimensionU, iDimensionV ){
		//initialize the mesh for the given UV dimensions
		//notice that we do not set vertex positions with this method
		//we setup our UV coordinates and create connections neccessary
		//to access data in vertex, triangle, or triangle-strip format

		//mesh must have at least 2 points per axis
		iDimensionU = this.max( iDimensionU, 2 )
		iDimensionV = this.max( iDimensionV, 2 )

		//set mesh dimensions
		this.dimensionsU = iDimensionU
		this.dimensionsV = iDimensionV

		//initialize vertice and setup th mesh UV coordinates
		for( var v = 0; v< iDimensionV; v++ ){
			for( var u = 0; u< iDimensionU; u++ ){
				//*** missing code here
			}
		}

		//setup subdivisions (triangles and triangle strip)
	},

}

var NodeGeom = {
	mPosition : {x: 0, y: 0, z: 0},
	mRotation : {x: 0, y: 0, z: 0},
	mScale : {x: 1, y: 1, z: 1},
	mColor : "0xFFFFFF",
	mType : 0, //add method setType to determine what is being drawn

	draw : function(){
		if( getVisibility() ){

			drawGeom( mType )

			var tChildCount = getChildCount();
			for(var i = 0; i < tChildCount; i++){
				var tmpColor = getChild(i).getColor()
				var tmpType = getChild(i).getType();
				getChild(i).draw();
			}
		}
	},

	getType : function(){
		return this.mType
	},

	getPosition : function(){
		return this.mPosition
	},

	getRotation : function(){
		return this.mRotation
	},

	getScale : function(){
		return this.mScale
	},

	getColor : function(){
		return this.mColor
	},

	setType : function( iValue ){
		this.mType = iValue
	},

	setPosition : function( iValue ){
		this.mPosition.x = iValue.x
		this.mPosition.y = iValue.y
		this.mPosition.z = iValue.z
	},

	setRotation : function( iValue ){
		this.mRotation.x = iValue.x
		this.mRotation.y = iValue.y
		this.mRotation.z = iValue.z
	},

	setScale : function( iValue ){
		this.mScale.x = iValue.x
		this.mScale.y = iValue.y
		this.mScale.z = iValue.z
	},

	setColor : function( iColor ){
		this.mColor = iColor
	},

	drawGeom : function( iType ){
		if( this.mType = 0 ){
			console.log("insert draw mType 0 here")
		}
		if( this.mType = 1 ){
			console.log("insert draw mType 1 here")
		}
		if( this.mType = 2 ){
			console.log("insert draw mType 2 here")
		}
	}

}


var NodeBase = {
	mName : "untitled",
	mParent : null,
	mChildren : [],
	mVisibility : true,

	setName : function( iName ){
		this.mName = iName
	},

	getName : function(){
		return this.mName
	},

	addChild : function( iChild ){
		iChild.setParent( this )
		this.mChildren.push( iChild )
	},

	removeChild : function( iIndex ){
		if( iIndex >= 0 && iIndex < this.mChildren.length ){
			this.mChildren[iIndex].setParent( null )
			this.mChildren.splice( iIndex, 1 )
		}
	},

	getChild : function( iIndex ){
		if( iIndex >= 0 && iIndex < this.mChildren.length ){
			return this.mChildren[iIndex]
		}
	},

	getChildCount : function(){
		return this.mChildren.length
	},

	setParent : function( iParent ){
		this.mParent = iParent
	},

	getParent : function(){
		return this.mParent
	},

	isRootNode : function(){
		return (this.mParent == null)
	},

	getRootNode : function(){
		if( this.isRootNode() ){
			return this
		}else{
			return this.mParent.getRootNode()
		}
	},

	getVisibility : function(){
		return this.mVisibility
	},

	getParentVisibility : function(){
		if( isRootNode() ){
			return mVisibility
		}else{
			return (mParent.getVisibility() && mVisibility )
		}
	},

	setVisibility : function( iVisibility ){
		this.mVisibility = iVisibility
	},

	toggleVisibility : function(){
		this.mVisibility = !this.mVisibility
	},

	print : function( iIndent ){
		if( this.getVisibility() ){
			var indent = "  " //indentationstring
			var len = indent.length * iIndent
			var indentStr = String(len).replace("0", indent)
			console.log( indentStr + this.mName ) //node info string
			var tChildCount = this.getChildCount()
			for( var i = 0; i < tChildCount; i++ ){
				// this.mChildren[i].print( iIndent + 1 )
				if( this.mChildren[i].getParent().mName == "root" ){
					if( this.mChildren[i].getVisibility() )
						console.log( "    " +this.mChildren[i].getName() )
				}else{
					if( this.mChildren[i].getVisibility() )
						console.log( "        " +this.mChildren[i].getName() )
				}
			}
		}
	}
}




var reset = function(){
  // Reset cylinder construction state variables
  reachedEnd = false;
  goRight    = true;
  stepA      = true;
  currU      = 0;
  currV      = 0;
}



function render(){	

	renderer.render( scene, camera )
}


function setupThree(){
	window.scene = new THREE.Scene()
	WIDTH      = $(window).width(),
	HEIGHT     = $(window).height(),
	VIEW_ANGLE = 45,
	ASPECT     = WIDTH / HEIGHT,
	NEAR       = 0.1,
	FAR        = 10000
	// scene.fog = new THREE.FogExp2( 0x000000, 0.0016 );

	window.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR )
	camera.position.set( 0, 100, 400 )
	camera.lookAt( scene.position )
	scene.add( camera )
	
	window.renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize( WIDTH, HEIGHT )
	renderer.shadowMapEnabled = true
	renderer.shadowMapSoft = true

	$( '#three' ).append( renderer.domElement )
}	


function addLights(){
	var
	ambient,
	directional
	
	ambient = new THREE.AmbientLight( 0x666666 )
	scene.add( ambient )	
	

	directional = new THREE.DirectionalLight( 0xCCCCCC )
	directional.castShadow = true	
	scene.add( directional )


	directional.position.set( 100, 200, 300 )
	directional.target.position.copy( scene.position )
	directional.shadowCameraTop     =  600
	directional.shadowCameraRight   =  600
	directional.shadowCameraBottom  = -600
	directional.shadowCameraLeft    = -600
	directional.shadowCameraNear    =  600
	directional.shadowCameraFar     = -600
	directional.shadowBias          =   -0.0001
	directional.shadowDarkness      =    0.3
	directional.shadowMapWidth      = directional.shadowMapHeight = 2048
	// directional.shadowCameraVisible = true
}

		
function loop(){

	render()
	controls.update() 
	
	window.requestAnimationFrame( loop )
}





function addControls(){
	window.controls = new THREE.TrackballControls( camera )
	
	controls.rotateSpeed = 1.0
	controls.zoomSpeed   = 1.2
	controls.panSpeed    = 0.8
	
	controls.noZoom = false
	controls.noPan  = true
	controls.staticMoving = true
	controls.dynamicDampingFactor = 0.3
	controls.keys = [ 65, 83, 68 ]//  ASCII values for A, S, and D
	
	controls.addEventListener( 'change', render )
}


//resize method
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
