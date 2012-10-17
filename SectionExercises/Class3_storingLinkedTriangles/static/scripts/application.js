var subDivisionU = 4, subDivisionV = 3, subDivLength = 100,
currU = 0, currV = 0, goRight = true, stepA = true, complete = false


$( document ).ready( function(){
	setupThree()
	addLights()
	addControls();
	window.group = new THREE.Object3D()


	window.cubeMaterial0 = new THREE.MeshPhongMaterial( { wireframe: false, transparency: true, opacity: 1, ambient: 0xFF00, color: 0xFFA01F, specular: 0xFFFFFF, shininess: 25, perPixel: true,  metal: false } );
	

	//attempt at double matrix
	//[0][0] first element in first array
	//[0][1] second element in first array
	//[1][0] first element in the second array
	//[1][1] second element in second array
	// window.matrix = []

	// var currPos = Array(2); //an array with 2 slots
	// currPos[0] = new THREE.Vector3( -100, 100, 0 );
	// currPos[1] = new THREE.Vector3( -100, -100, 0 );
	// matrix.push(currPos);
	
	// var currPos2 = Array(2);
	// currPos2[0] = new THREE.Vector3( -200, 100, 0 );
	// currPos2[1] = new THREE.Vector3( -200, -100, 0 );
	// matrix.push(currPos2);

	// var currPos3 = Array(3); //an array with 2 slots
	// currPos3[0] = new THREE.Vector3( -100, 100, 0 );
	// currPos3[1] = new THREE.Vector3( -100, -100, 0 );
	// matrix.push(currPos);

	// var currPos4 = Array(2);
	// currPos4[0] = new THREE.Vector3( -200, 100, 0 );
	// currPos4[1] = new THREE.Vector3( -200, -100, 0 );
	// matrix.push(currPos4);
	
	// var geometry = new THREE.Geometry();
	// for (var i = 0; i <4; i++){
	//   var tacka1 = new THREE.Vector3();
	//   tacka1.x = matrix[i][0];
	//   tacka1.y = 0;
	//   tacka1.z = matrix[i][1];

	//   var tacka2 = new THREE.Vector3();
	//   tacka2.x = matrix[i][0];
	//   tacka2.y = 20;
	//   tacka2.z = matrix[i][1];

	//   geometry.vertices.push(tacka1);
	//   geometry.vertices.push(tacka2);
	// }
	// var ribbon = new THREE.MeshBasicMaterial({ color: 0xFF0000, wireframe: true });
	// ribbon.doubleSided = true;
	// group.add(ribbon);


 	//single triangle
	// var geom = new THREE.Geometry();
	// geom.vertices.push( new THREE.Vector3( -100, 100, 0 ) );
	// geom.vertices.push( new THREE.Vector3( -100, -100, 0 ) );
	// geom.vertices.push( new THREE.Vector3( 100, 100, 0 ) );

	// geom.computeFaceNormals();
	// geom.computeVertexNormals();

	// var mat = new THREE.MeshBasicMaterial({ color: 0xFF0000, wireframe: true });
	// var ribbon = new THREE.Ribbon( geom, mat );
	// scene.add( ribbon );



 	//two triangle
	var geom = new THREE.Geometry();
	geom.vertices.push( new THREE.Vector3( -100, 100, 0 ) );
	geom.vertices.push( new THREE.Vector3( -100, -100, 0 ) );
	geom.vertices.push( new THREE.Vector3( 100, 100, 0 ) );
	geom.vertices.push( new THREE.Vector3( 100, -100, 0 ) );
	// geom.vertices.push( new THREE.Vector3( 200, 100, 0 ) ); //an extra triangle

	geom.computeFaceNormals();
	geom.computeVertexNormals();

	var mat = new THREE.MeshBasicMaterial({ color: 0xFF0000, wireframe: true });
	var ribbon = new THREE.Ribbon( geom, mat );
	scene.add( ribbon );


	
	
	scene.add(group)
	loop()	
})

var triangle = {
	generate : function(_vertA, _vertB, _vertC){
		var vertA = _vertA;
		var vertB = _vertB;
		var vertC = _vertC;
		
		var mVerts = new THREE.Geometry();
		mVerts.vertices.push( vertA ); 
		mVerts.vertices.push( vertB ); 
		mVerts.vertices.push( vertC );

		mVerts.faces.push( new THREE.Face3( 0, 1, 2 ) );
		mVerts.computeFaceNormals();
		
		var object = new THREE.Mesh( mVerts, cubeMaterial0 );
		object.receiveShadow = true
		object.castShadow = true
		group.add(object)
		
		return mVerts; //return the triangle object to fill the mTriangles array in the trianglesContainer
	}
}


var trianglesContainer = {
	mTriangles : [],
	
	addTriangle : function(tri){
		this.mTriangles.push(tri);
	},
	
	draw : function(){
		for (var i = 0; i < this.mTriangles.length-1; i++) {
			this.mTriangles[i].create();
		}
	},
	getTriangle : function(_index){
		i = _index
	    if( i >= 0 && i < this.mTriangles.length-1 ) {
	      return this.mTriangles[i]; //return triangle
	    }
	    return null; //else return null
	}
}


function setupThree(){
	window.scene = new THREE.Scene()
	WIDTH      = $(window).width(),
	HEIGHT     = $(window).height(),
	VIEW_ANGLE = 45,
	ASPECT     = WIDTH / HEIGHT,
	NEAR       = 0.1,
	FAR        = 10000
	
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
	//animateTriangles();

	render()
	controls.update() 
	
	window.requestAnimationFrame( loop )
}


//animate individual triangle objects
function animateTriangles(){
	var tContainerGet = Object.create(trianglesContainer);
	currTri = tContainerGet.getTriangle( index );
	if( currTri != null ) {
	  for(var i = 0; i < 3; i++) {
	    if( goingUp ){
	      currTri.vertices[i].z -= subdivLength;  // z pozition is moved
		}else{
	      currTri.vertices[i].z += subdivLength;
		}
	  }
	}	
}
//timer that updates which triangle being animated
// setInterval(function(){
// 	if( index + 1 < subdivisionsX * subdivisionsY * 2 ) {
//       index++;	      // Increment triangle index
//     }
//     else {
//       index   = 0;	      // Reset triangle index
//       goingUp = !goingUp;	      // Reverse direction
//     }
// }, 1000)


function render(){	
	renderer.render( scene, camera )
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
