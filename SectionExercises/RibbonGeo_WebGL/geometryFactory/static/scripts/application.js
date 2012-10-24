$( document ).ready( function(){
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	setupThree()
	addLights()
	addControls();
	window.group = new THREE.Object3D()

	//draw mesh
	var mesh = new RibbonMesh(3, 3, 100) //subdivisions u, v and length of each subdivision
	group.add(mesh)
	
	// var mesh = new RibbonCylinder(100, 200, 40, 10) //subdivisions u, v and length of each subdivision
	// group.add(mesh)

	// var mesh = new RibbonSphere(100, 32, 32)
	// group.add(mesh)

	// var mesh = new RibbonTorus()
	// group.add(mesh)	


	scene.add(group)
	loop()	
})


//triangle strip base container
var TriStripContainer = function(){
	this.mVertices = []

	this.clear = function(){
		this.mVertices = [] //clear the array
	}

	this.addVertex = function(iVert){
		this.mVertices.push(iVert)
	}

	this.getVertex = function(iIndex){
		if( iIndex >= 0 && iIndex < getVertexCount() ){
			return this.mVertices[iIndex]
		}
		return null
	}

	this.getVertexCount = function(){
		return this.mVertices.length-1
	}

	this.draw = function(){
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


var RibbonMesh = function(subDivisionsU, subDivisionsV, subDivLength){
	var subDivisionsU = subDivisionsU, subDivisionsV = subDivisionsV, subDivLength = subDivLength,
	currU = 0, currV = 0, goRight = true, stepA = true, reachedEnd = false

	var meshContainer = new TriStripContainer()

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

			reachedEnd = (currV == subDivisionsV ) //will return false until last vertice
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

	//return ribbon object centered
	var mesh = meshContainer.draw()
	mesh.position.x = subDivisionsU * -subDivLength / 2 //center mesh
	mesh.position.y = subDivisionsV * -subDivLength / 2 //center mesh
	return mesh
}


var RibbonCylinder = function(radius, length, subdivU, subDivV){
	var mProfileRadius = radius, mCylinderLen = length, subdivisionsU = subdivU, subdivisionsV = subDivV, 
    currU = 0, currV = 0, goRight = true, stepA = true, deltaThetaU = Math.PI*2 / subdivisionsU, deltaThetaV = Math.PI / subdivisionsV
    reachedEnd = false

	var cylinderContainer = new TriStripContainer()

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

	var mesh = cylinderContainer.draw()
	mesh.position.y = -mCylinderLen /2 //center cylinder
	return mesh
}


var RibbonSphere = function(radius, subU, subV){
	var mSphereRadius = radius, subdivisionsU = subU, subdivisionsV = subV, 
    currU = 0, currV = 0, goRight = true, stepA = true, 
    deltaThetaU = Math.PI*2 / subdivisionsU, deltaThetaV = Math.PI / subdivisionsV, reachedEnd = false


	var sphereContainer = new TriStripContainer()

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

	var mesh = sphereContainer.draw()
	return mesh
}



var RibbonTorus = function(){
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

	var mProfileRadius = 50, mTorusRadius = 70, subdivisionsU = 20, subdivisionsV = 40, 
    currU = 0, currV = 0, goRight = true, stepA = true, 
    deltaThetaU = Math.PI*2 / subdivisionsU, deltaThetaV = Math.PI*2 / subdivisionsV, 
    reachedEnd = false

	var torusContainer = new TriStripContainer()

	while(!reachedEnd){

		// We find our position along the circumference of the current profile by multiplying the angle of a 
		// single step in the circular profile by the current index in the U axis (radial axis).
		var thetaU = deltaThetaU * currU;
		var thetaV = deltaThetaV * currV

		//calculate teh current pos along the circumfrence of the torus, this will be the center point of the current profile
		var currProfileCenter = new THREE.Vector3( mTorusRadius * Math.cos( thetaV ), 0.0, mTorusRadius * Math.sin(thetaV) )

		//compute the vector between the next profile center point and the current one
		//no need to do anything with y, but am for the heck of it (will stay as 0 throughout)
		var dirToNextCenter = new THREE.Vector3( currProfileCenter.x, currProfileCenter.y, currProfileCenter.z )
		dirToNextCenter.x -= mTorusRadius * Math.cos( thetaV+deltaThetaV )
		dirToNextCenter.y -= 0.0
		dirToNextCenter.z -= mTorusRadius * Math.sin( thetaV+deltaThetaV )
		//find length of vector
		var dirToNextCenterLength = Math.sqrt( dirToNextCenter.x*dirToNextCenter.x + dirToNextCenter.y*dirToNextCenter.y + dirToNextCenter.z*dirToNextCenter.z)
		dirToNextCenter.x /= dirToNextCenterLength //normalize it
		dirToNextCenter.y /= dirToNextCenterLength
		dirToNextCenter.z /= dirToNextCenterLength

		//get the up axis for the plane upon which the current profile resides
		//find this by taking the corss product of our vector between profiles centers and a vector traveling along the y-axis
		//which is the axis of rotation for the placement of profile centers
		var upVec = new THREE.Vector3( dirToNextCenter.x - 0.0, dirToNextCenter.y - 1.0, dirToNextCenter.z - 0.0 )
		//find length of vector
		var upVecLength = Math.sqrt( upVec.x*upVec.x + upVec.y*upVec.y + upVec.z*upVec.z)
		upVec.x /= upVecLength //normalize it
		upVec.y /= upVecLength
		upVec.z /= upVecLength
		upVec.x *= mProfileRadius //multiply the values
		upVec.y *= mProfileRadius
		upVec.z *= mProfileRadius

		//comput ethe position of the current vertex on the prfile plane
		//we can think of the rotateAroundAxis function as being like a clock
		//upVec represents the direction of where the hour hand is pointing
		//dirToNext represents the center pex which holds the clock hand in place
		//when we turn this peg the hour hand rotates around the face of the clock
		var currVert = rotateAroundAxis( upVec, dirToNextCenter, thetaU )
		//now we need to position the current vertex in relation to the current prfiles center point
		currVert.x += currProfileCenter.x
		currVert.y += currProfileCenter.y
		currVert.z += currProfileCenter.z
		//add vertex to torus container
		torusContainer.addVertex( currVert )

		// check if we hit a column ending on the left or right of the mesh -if so turn around and jump to the next row
		if( !stepA && ( ( goRight && currU == subdivisionsU ) || (!goRight && currU == 0 ) ) ){
			goRight = !goRight

			 // When turning around, we add the last point again as a pivot and reverse normal.
			torusContainer.addVertex( currVert )
			torusContainer.addVertex( currVert )

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

	var mesh = torusContainer.draw()
	return mesh
}




// var reset = function(){
//   // Reset cylinder construction state variables
//   reachedEnd = false;
//   goRight    = true;
//   stepA      = true;
//   currU      = 0;
//   currV      = 0;
// }



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
