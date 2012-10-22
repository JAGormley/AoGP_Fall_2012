$( document ).ready( function(){
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	setupThree()
	addLights()
	addControls();
	window.group = new THREE.Object3D()


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


var NodeBase{
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
		if( iIndex >= 0 && iIndex < this.mChildren.length-1 ){
			this.mChildren[iIndex].setParent( null )
			this.mChildren.splice( iIndex, 1 )
		}
	},

	getChild : function( iIndex ){
		if( iIndex >= 0 && iIndex < this.mChildren.length-1 ){
			return this.mChildren[iIndex]
		}
	},

	getChildCount : function(){
		return this.mChildren.length-1
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
		if( isRootNode() ){
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
		if( getVisibility() ){
			var indent = "  "
			var len = indent.length * iIndent
			console.log( indent + this.mName ) //node info string
			var tChildCount = this.getChildCount()
			for ( var i = 0; i < tChildCount; i++ ){
				this.mChildren[i].print( iIndent + 1 )
			}
		}
	}

}

var TriStripContainer = {
	mVertices : [],

	clear : function(){
		this.mVertices = [] //clear the array
	},

	addVertex : function(iVert){
		this.mVertices.push(iVert)
	},

	getVertex : function(iIndex){
		if( iIndex >= 0 && iIndex < getVertexCount() ){
			return this.mVertices[iIndex]
		}
		return null
	},

	getVertexCount : function(){
		return this.mVertices.length-1
	},

	draw : function(){
		var vertCount = this.getVertexCount(); //get vertex count
		var geom = new THREE.Geometry();  //create geometry

		for(var i = 0; i < vertCount; i++){
			var currVert = this.mVertices[i]
			geom.vertices.push( new THREE.Vector3( currVert.x, currVert.y, currVert.z ) );
		}

		var ribbon = new THREE.Ribbon( geom, new THREE.MeshBasicMaterial({ color: 0xFFFF00,  side: THREE.DoubleSide }) ); //vertexColors: true,
		return ribbon
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
