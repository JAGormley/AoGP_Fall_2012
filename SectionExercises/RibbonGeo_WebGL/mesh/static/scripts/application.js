var subDivisionsU = 3, subDivisionsV = 3, subDivLength = 100,
currU = 0, currV = 0, goRight = true, stepA = true, reachedEnd = false


$( document ).ready( function(){
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	setupThree()
	addLights()
	addControls();
	window.group = new THREE.Object3D()


 	//single triangle
	// var geom = new THREE.Geometry();
	// geom.vertices.push( new THREE.Vector3( -100, 100, 0 ) );
	// geom.vertices.push( new THREE.Vector3( -100, -100, 0 ) );
	// geom.vertices.push( new THREE.Vector3( 100, 100, 0 ) );

	// geom.computeFaceNormals();
	// geom.computeVertexNormals();

	// var mat = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
	// var ribbon = new THREE.Ribbon( geom, mat );
	// scene.add( ribbon );



 	//two triangle
	// var geom = new THREE.Geometry();
	// geom.vertices.push( new THREE.Vector3( -100, 100, 0 ) );
	// geom.vertices.push( new THREE.Vector3( -100, -100, 0 ) );
	// geom.vertices.push( new THREE.Vector3( 100, 100, 0 ) );
	// geom.vertices.push( new THREE.Vector3( 100, -100, 0 ) );

	// geom.computeFaceNormals();
	// geom.computeVertexNormals();

	// var mat = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
	// var ribbon = new THREE.Ribbon( geom, mat );
	// scene.add( ribbon );



	var meshContainer = Object.create( TriStripContainer )

	while(!reachedEnd){
		var currVert = new THREE.Vector3( currU * subDivLength, currV * subDivLength, 0 )
		meshContainer.addVertex( currVert )

		// check if we hit a column ending on the left or right of the mesh -if so turn around and jump to the next row
		if(!stepA && ( ( goRight && currU == subDivisionsU ) || (!goRight && currU == 0) )){
			goRight = !goRight
			
			//create degenerate triangle (needs two points to fully turn around)
			meshContainer.addVertex( currVert )
			meshContainer.addVertex( currVert )

			stepA = true //reset to step type A
			goRight != goRight //alternate between row types

			reachedEnd = (currV == subDivisionsV) //will return false until last vertice
		}

	    // For rightward rows (goRight):
	    //   A  C
	    //   | /
	    //   B
	    
	    // For leftward rows (!goRight):
	    //   C  A
	    //    \ |
	    //      B
		if(goRight){
			if(stepA){
				currV ++
			}else{
				currU ++
				currV --
			}
		}else{
			if(stepA){
				currV ++
			}else{
				currU --
				currV --
			}
		}
		
		stepA = !stepA //alternate between step types
	}

	var mesh = meshContainer.draw()
	mesh.position.x = subDivisionsU * -subDivLength / 2 //center mesh
	mesh.position.y = subDivisionsV * -subDivLength / 2 //center mesh
	group.add(mesh)



	scene.add(group)
	loop()	
})

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
