var subDivisionsU = 3, subDivisionsV = 3, subDivLength = 100,
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

	// var mat = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
	// var ribbon = new THREE.Ribbon( geom, mat );
	// scene.add( ribbon );



 	//two triangle
	// var geom = new THREE.Geometry();
	// geom.vertices.push( new THREE.Vector3( -100, 100, 0 ) );
	// geom.vertices.push( new THREE.Vector3( -100, -100, 0 ) );
	// geom.vertices.push( new THREE.Vector3( 100, 100, 0 ) );
	// geom.vertices.push( new THREE.Vector3( 100, -100, 0 ) );
	// // geom.vertices.push( new THREE.Vector3( 200, 100, 0 ) ); //an extra triangle

	// geom.computeFaceNormals();
	// geom.computeVertexNormals();

	// var mat = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
	// var ribbon = new THREE.Ribbon( geom, mat );
	// scene.add( ribbon );


	//create geom object to access in loop
	var geom = new THREE.Geometry();
	while(!complete){
		//plot vertice in mesh
		geom.vertices.push( new THREE.Vector3( currU, currV, 0 ) );

		// check row ending
		if(!stepA && ( ( goRight && currU == subDivisionsU * subDivLength ) || (!goRight && currU == 0) )){
			goRight = !goRight
			console.log('turning point')
			//create degenerate triangle (needs two points to fully turn around)
			geom.vertices.push( new THREE.Vector3( currU, currV, 0 ) );
			geom.vertices.push( new THREE.Vector3( currU, currV, 0 ) );

			stepA = true //reset to step type A
			goRight != goRight //alternate between row types

			complete = (currV == subDivisionsV * subDivLength ) //will return false until last vertice
		}
		// complete = (currU == subDivisionsU * (subDivLength*2) ) 

		console.log('currU: '+currU+', currV: '+ currV)
		if(goRight){
			if(stepA){
				currV += subDivLength
			}else{
				currU += subDivLength
				currV -= subDivLength
			}
		}else{
			if(stepA){
				currV += subDivLength
			}else{
				currU -= subDivLength
				currV -= subDivLength
			}
		}

		//alternate between step types
		stepA = !stepA
	}

	geom.computeFaceNormals()
	geom.computeVertexNormals()
	var ribbon = new THREE.Ribbon( geom, new THREE.MeshBasicMaterial({ color: 0xFFFF00 }) );
	group.add(ribbon)


	scene.add(group)
	loop()	
})



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
