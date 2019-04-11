//THREEJS RELATED VARIABLES 

var scene,
  camera, fieldOfView, aspectRatio, nearPlane, farPlane,
  gobalLight, shadowLight, backLight,
  renderer,
  container,
  controls;

// OTHER VARIABLES

var PI = Math.PI;
var hero;
var container;

// MATERIALS

var brownMat = new THREE.MeshStandardMaterial({
	color: 0x401A07,
	side:THREE.DoubleSide,
	shading:THREE.SmoothShading,
	roughness:1,
  });

var blackMat = new THREE.MeshPhongMaterial({
	color: 0x100707,
	shading:THREE.FlatShading,
  });
  
var redMat = new THREE.MeshPhongMaterial({
	color: 0xAA5757,
	shading:THREE.FlatShading,
  });

var blueMat = new THREE.MeshPhongMaterial({
	color: 0x5b9696,
	shading:THREE.FlatShading,
  });

var whiteMat = new THREE.MeshPhongMaterial({
	color: 0xffffff,
	shading:THREE.FlatShading,
  });

var currentMaterial = new THREE.MeshPhongMaterial({
	color: 0xff0000,
	shading:THREE.FlatShading,
  });
  

//INIT THREE JS, SCREEN AND MOUSE EVENTS

function initScreenAnd3D() {
  container = document.getElementById('world');
  HEIGHT = container.offsetHeight;
  WIDTH = container.width;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;

  scene = new THREE.Scene();
  
  scene.fog = new THREE.Fog(0xd6eae6, 150,300);
  
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 50;
  nearPlane = 1;
  farPlane = 2000;
  camera = new THREE.PerspectiveCamera(
	fieldOfView,
	aspectRatio,
	nearPlane,
	farPlane
  );
  camera.position.x = 0;
  camera.position.z = 100;
  camera.position.y = 0;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  renderer = new THREE.WebGLRenderer({
	alpha: true,
	antialias: true
  });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
  renderer.shadowMap.enabled = true;

  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);

  handleWindowResize();
}

function handleWindowResize() {
  HEIGHT = container.offsetHeight;
  WIDTH = container.offsetWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

function createLights() {
  globalLight = new THREE.AmbientLight(0xffffff, 1);
  shadowLight = new THREE.DirectionalLight(0xffffff, 1);
  shadowLight.position.set(10, 8, 8);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -40;
  shadowLight.shadow.camera.right = 40;
  shadowLight.shadow.camera.top = 40;
  shadowLight.shadow.camera.bottom = -40;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;
  shadowLight.shadow.mapSize.width = shadowLight.shadow.mapSize.height = 2048;
  scene.add(globalLight);
  scene.add(shadowLight);
}

Hero = function() {
  this.mesh = new THREE.Group();
  this.body = new THREE.Group();
  this.mesh.add(this.body);

  //added code

  this.motions = NaN;
  this.currentFrame = NaN;

  this.root = new THREE.Object3D();
  this.root.position.x = 0;
  this.root.position.y = 0;
  this.root.position.z = 0;
  this.body.add(this.root);

  var torsoGeom = new THREE.CubeGeometry(8,8,8, 1);
  this.torso = new THREE.Mesh(torsoGeom, blueMat);
  this.torso.position.y = 4;
  this.torso.position.z = 4;
  this.torsoPivot = new THREE.Mesh(new THREE.CubeGeometry(1,1,1,1), redMat);
  this.root.add(this.torsoPivot);
  this.torsoPivot.add(this.torso);

  var handGeom = new THREE.CubeGeometry(3,3,3, 1);
  this.handR = new THREE.Mesh(handGeom, brownMat);
  this.handR.position.x=8;
  this.handR.position.y=0;
  this.handRPivot = new THREE.Mesh(new THREE.CubeGeometry(1,1,1,1), redMat);
  this.handRPivot.position.x = 4;
  this.handRPivot.position.y = 4;
  this.torso.add(this.handRPivot);
  this.handRPivot.add(this.handR);

  this.handL = this.handR.clone();
  this.handL.position.x = - this.handR.position.x;
  this.handLPivot = new THREE.Mesh(new THREE.CubeGeometry(1,1,1,1), redMat);
  this.handLPivot.position.x = -4;
  this.handLPivot.position.y = 4;
  this.torso.add(this.handLPivot);
  this.handLPivot.add(this.handL);

  var headGeom = new THREE.CubeGeometry(6,6,6, 1);//
  this.head = new THREE.Mesh(headGeom, blueMat);
  this.head.position.y = 4;
  this.headPivot = new THREE.Mesh(new THREE.CubeGeometry(1,1,1,1), redMat);
  this.headPivot.position.y = 4;
  this.torso.add(this.headPivot);
  this.headPivot.add(this.head);

  var legGeom = new THREE.CubeGeometry(5,3,8, 1);
  
  this.legR = new THREE.Mesh(legGeom, brownMat);
  this.legR.position.z = 0;
  this.legR.position.x = 0;
  this.legR.position.y = -8;
  this.legRPivot = new THREE.Mesh(new THREE.CubeGeometry(1,1,1,1), redMat);
  this.legRPivot.position.x = 4;
  this.legRPivot.position.y = -4;
  this.legRPivot.position.z = 0;
  this.torso.add(this.legRPivot);
  this.legRPivot.add(this.legR);
  
  this.legL = this.legR.clone();
  this.legL.position.x = - this.legR.position.x;
  this.legLPivot = new THREE.Mesh(new THREE.CubeGeometry(1,1,1,1), redMat);
  this.legLPivot.position.x = -4;
  this.legLPivot.position.y = -4;
  this.legLPivot.position.z = 0;
  this.torso.add(this.legLPivot);
  this.legLPivot.add(this.legL);

  // let rv = new THREE.Vector3(-167.839, -84.3141, 178.559).multiplyScalar(PI/180);
  // this.root.rotation.setFromVector3(rv);
  // rv.set(43.6121, 0.329504, -6.08611).multiplyScalar(PI/180);
  // this.torsoPivot.rotation.setFromVector3(rv);

  //end added code

  // var torsoGeom = new THREE.CubeGeometry(8,8,8, 1);//
  // this.torso = new THREE.Mesh(torsoGeom, blueMat);
  // this.torso.position.y = 8;
  // this.torso.castShadow = true;
  // this.body.add(this.torso);
  
  // var handGeom = new THREE.CubeGeometry(3,3,3, 1);
  // this.handR = new THREE.Mesh(handGeom, brownMat);
  // this.handR.position.z=7;
  // this.handR.position.y=8;
  // this.body.add(this.handR);
  
  // this.handL = this.handR.clone();
  // this.handL.position.z = - this.handR.position.z;
  // this.body.add(this.handL);
  
  // var headGeom = new THREE.CubeGeometry(16,16,16, 1);//
  // this.head = new THREE.Mesh(headGeom, blueMat);
  // this.head.position.y = 21;
  // this.head.castShadow = true;
  // this.body.add(this.head);
  
  // var legGeom = new THREE.CubeGeometry(8,3,5, 1);
  
  // this.legR = new THREE.Mesh(legGeom, brownMat);
  // this.legR.position.x = 0;
  // this.legR.position.z = 7;
  // this.legR.position.y = 0;
  // this.legR.castShadow = true;
  // this.body.add(this.legR);
  
  // this.legL = this.legR.clone();
  // this.legL.position.z = - this.legR.position.z;
  // this.legL.castShadow = true;
  // this.body.add(this.legL);

  // this.body.traverse(function(object) {
	// if (object instanceof THREE.Mesh) {
	//   object.castShadow = true;
	//   object.receiveShadow = true;
	// }
  // });
}

Hero.prototype.isViolatingConstraint = function(boneName, scene) {
  switch (boneName) {
    case "root":
      if (root.rotation.x != 0 || root.rotation.z != 0) {
        return false;
      }
  }
  return true;
}

Hero.prototype.reconcileScene = function(lhs, rhs, boneName) {
  let outScene = rhs;
  for (let i = 0; i < lhs[boneName].length; i++) {
    outScene[boneName][i] = (lhs[boneName][i] + rhs[boneName][i])/2;
  }
  return outScene;
}

Hero.prototype.setAMC = function(amc) {
  for (let i = 1; i < amc.sceneCount; i++) {
    if (this.isViolatingConstraint("torso",amc.scenes[i])) {
      amc.scenes[i] = this.reconcileScene(amc.scenes[i-1],amc.scenes[i],"lowerback");
    }
    if (this.isViolatingConstraint("head",amc.scenes[i])) {
      amc.scenes[i] = this.reconcileScene(amc.scenes[i-1],amc.scenes[i],"head");
    }
    if (this.isViolatingConstraint("handR",amc.scenes[i])) {
      amc.scenes[i] = this.reconcileScene(amc.scenes[i-1],amc.scenes[i],"rhumerus");
    }
    if (this.isViolatingConstraint("handL",amc.scenes[i])) {
      amc.scenes[i] = this.reconcileScene(amc.scenes[i-1],amc.scenes[i],"lhumerus");
    }
    if (this.isViolatingConstraint("legR",amc.scenes[i])) {
      amc.scenes[i] = this.reconcileScene(amc.scenes[i-1],amc.scenes[i],"rtibia");
    }
    if (this.isViolatingConstraint("legL",amc.scenes[i])) {
      amc.scenes[i] = this.reconcileScene(amc.scenes[i-1],amc.scenes[i],"ltibia");
    }
  }

  this.motions = amc;
  this.currentFrame = 0;
}

Hero.prototype.run = function(){
  if (!this.motions) {
    return;
  }
  if (this.currentFrame >= this.motions.sceneCount) {
    this.currentFrame = 0;
  }
  var currentScene = this.motions.scenes[this.currentFrame];
  let deg2radFactor = PI/180;

  this.root.position.set(currentScene.root[0],currentScene.root[1],currentScene.root[2]);
  var rot = new THREE.Vector3(currentScene.root[3],currentScene.root[4],currentScene.root[5]);
  rot.multiplyScalar(deg2radFactor);
  this.root.rotation.setFromVector3(rot);
  // rot.addScaledVector(this.root.rotation.toVector3(), -1);
  
  rot.set(currentScene.lowerback[0],currentScene.lowerback[1],currentScene.lowerback[2]);
  rot.multiplyScalar(deg2radFactor);
  this.torsoPivot.rotation.setFromVector3(rot);

  rot.set(currentScene.rhumerus[0],currentScene.rhumerus[1],currentScene.rhumerus[2]);
  rot.multiplyScalar(deg2radFactor);
  this.handRPivot.rotation.setFromVector3(rot);

  rot.set(currentScene.lhumerus[0],currentScene.lhumerus[1],currentScene.lhumerus[2]);
  rot.multiplyScalar(deg2radFactor);
  this.handLPivot.rotation.setFromVector3(rot);

  rot.set(currentScene.head[0],currentScene.head[1],currentScene.head[2]);
  rot.multiplyScalar(deg2radFactor);
  this.headPivot.rotation.setFromVector3(rot);

  rot.set(currentScene.rtibia[0],currentScene.rtibia[1],currentScene.rtibia[2]);
  rot.multiplyScalar(deg2radFactor);
  this.legRPivot.rotation.setFromVector3(rot);

  rot.set(currentScene.ltibia[0],currentScene.ltibia[1],currentScene.ltibia[2]);
  rot.multiplyScalar(deg2radFactor);
  this.legLPivot.rotation.setFromVector3(rot);

  // console.log(this.currentFrame);
  // console.log(this.root.position);
  // console.log(this.root.rotation.toVector3().multiplyScalar(180/PI));

  document.getElementById("frame").innerHTML = this.currentFrame;

  this.currentFrame++;
}

function createHero() {
  hero = new Hero();
  hero.mesh.position.y=-15;
  scene.add(hero.mesh);
}

function loop(){
  hero.run();
  render();
  requestAnimationFrame(loop);
}

function render(){
  renderer.render(scene, camera);
}