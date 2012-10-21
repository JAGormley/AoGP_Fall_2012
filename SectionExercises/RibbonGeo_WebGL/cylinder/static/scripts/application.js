//mProfile radius is the radius of the cylinder
//mCylinderLen is the length of the cylinder
//subdivisionsU is the number of subdivisions aorund each circular profile
//subdivisionsV is the number of profiles in the cylinder
//stepA is to toggle between the direction in creating the Ribbon
//deltaThetaV is the angle between each vertex in a profile
//reachedEnd finalized the geometry
var mProfileRadius = 100, mCylinderLen = 200, subdivisionsU = 40, subdivisionsV = 10, 
    currU = 0, currV = 0, goRight = true, stepA = true, deltaThetaU = Math.PI*2 / subdivisionsU, reachedEnd = false

$( document ).ready( function(){
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage()

	setupThree()
	addLights()
	addControls()
	window.group = new THREE.Object3D()



	var cylinderContainer = Object.create( TriStripContainer )

	while(!reachedEnd){
		// To create a 3D cylinder, we will associate the U axis of the 2D mesh with the circumference of 
		// each of the cylinder's circular profiles and associate the V axis with the cylinder's length.
		// We could easily turn this into a cone by varying the radius of each profile in accordance with our
		// current position along the V axis.

		// We find our position along the circumference of the current profile by multiplying the angle of a 
		// single step in the circular profile by the current index in the U axis (radial axis).
		var thetaU = deltaThetaU * currU;
		// Using thetaU, we find the coordinates of the current point in relation to the center of the current profile
		// and then multiply these coordinates by the profile radius to size it appropriately.
		// Here we are thinking of the current profile as a circle inscribed in a plane spanning the X and Z axes.
		var x = mProfileRadius * Math.cos( thetaU );
		var z = mProfileRadius * Math.sin( thetaU );

		// We find the y-value of the current vertex by computing the length of one cylinder segment
		// and then multiplying this by current index in the V axis (non-radial axis) of our mesh.
		var y = ( mCylinderLen / subdivisionsV ) * currV;


		//Add the current vertex to the triangle strip
		var currVert = new THREE.Vector3( x, y, z )
		cylinderContainer.addVertex( currVert )

		// check if we hit a column ending on the left or right of the mesh -if so turn around and jump to the next row
		if( !stepA && ( ( goRight && currU == subdivisionsU ) || (!goRight && currU == 0 ) ) ){
			goRight = !goRight

			 // When turning around, we add the last point again as a pivot and reverse normal.
			cylinderContainer.addVertex( currVert )
			cylinderContainer.addVertex( currVert )

			stepA = true; //reset to type A

			//if we're at the end of a row on a step b move to the final colum,
			//then we add the last vertex in the mesh
			reachedEnd = (currV == subdivisionsV)
		}

		if( goRight ){
			if(stepA){
				currV++
			}else{
				currU++
				currV--
			}
		}else{
			if(stepA){
				currV++
			}else{
				currU--
				currV--
			}
		}

		stepA = !stepA
	}

	var cylinder = cylinderContainer.draw()
	cylinder.position.y = -mCylinderLen /2 //center cylinder
	group.add( cylinder )

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

  // Compute the angle between each vertex in a profile
  deltaThetaU = Math.PI*2 / subdivisionsU;
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
