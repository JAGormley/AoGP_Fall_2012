//mSphereRadius radius of the sphere
//subdivisionsU is the number of points around each circular profile (longitude)
//subdivisionsV is the number of profiles in the sphere (latitude)
//stepA is to toggle between the direction in creating the Ribbon
//deltaThetaU computes the angle between each vertex in a profile
//deltaThetaV computes the angle between each profile
//reachedEnd finalized the geometry
var mSphereRadius = 100, subdivisionsU = 32, subdivisionsV = 32, 
    currU = 0, currV = 0, goRight = true, stepA = true, 
    deltaThetaU = Math.PI*2 / subdivisionsU, deltaThetaV = Math.PI / subdivisionsV, reachedEnd = false
 

$( document ).ready( function(){
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage()

	setupThree()
	addLights()
	addControls()
	window.group = new THREE.Object3D()


	var sphereContainer = Object.create( TriStripContainer )

	while(!reachedEnd){
		// Find the current angle within the current longitudinal profile
		var thetaU = deltaThetaU * currU
		// Find the current angle within the latitudinal arc, 
		// offseting by a quarter circle (HALF_PI) so that we start at the pole
		// rather than the equator
		var thetaV = deltaThetaV * currV - Math.PI/2

		// Compute the current position on the surface of the sphere
		var x = mSphereRadius * Math.cos( thetaV ) * Math.cos( thetaU )
		var y = mSphereRadius * Math.cos( thetaV ) * Math.sin( thetaU )
		var z = mSphereRadius * Math.sin( thetaV )
		var currVert = new THREE.Vector3( x, y, z )

		sphereContainer.addVertex( currVert )

		// check if we hit a column ending on the left or right of the mesh -if so turn around and jump to the next row
		if( !stepA && ( ( goRight && currU == subdivisionsU ) || (!goRight && currU == 0 ) ) ){
			goRight = !goRight

			 // When turning around, we add the last point again as a pivot and reverse normal.
			sphereContainer.addVertex( currVert )
			sphereContainer.addVertex( currVert )

			stepA = true; //reset to type A

			//if we're at the end of a row on a step b move to the final colum,
			//then we add the last vertex in the mesh
			reachedEnd = (currV == subdivisionsV )
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

	var sphere = sphereContainer.draw()
	group.add( sphere )

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

var rotateAroundAxis = function(vec, a , t){
	var s = Math.sin(t)
	var c = Math.cos(t)
	var u = new THREE.Vector3( a.x*vec.x, a.x*vec.y, a.x*vec.z )
	var v = new THREE.Vector3( a.y*vec.x, a.y*vec.y, a.y*vec.z )
	var w = new THREE.Vector3( a.z*vec.x, a.z*vec.y, a.z*vec.z )
	var out = new THREE.Vector3( a.x * (u.x + v.y + w.z) + (vec.x * (a.y * a.y + a.z * a.z) - a.x * (v.y + w.z)) * c + (v.z - w.y) * s,
		           				 a.y * (u.x + v.y + w.z) + (vec.y * (a.x * a.x + a.z * a.z) - a.y * (u.x + w.z)) * c + (w.x - u.z) * s,
			   					 a.z * (u.x + v.y + w.z) + (vec.z * (a.x * a.x + a.y * a.y) - a.z * (u.x + v.z)) * c + (u.y - v.x) * s)
	return out
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
