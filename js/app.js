var vrMode = false;

var loader = new THREE.JSONLoader();

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var person = new THREE.Object3D();
person.position.y = 1;
person.position.z = 5;
scene.add(person);
person.add(camera);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var light = new THREE.AmbientLight(0x404040);
scene.add(light);

var light2 = new THREE.PointLight(0xffffff, 0.5, 15);
light2.position.set(0,1,10);
scene.add(light2);

var texture = THREE.ImageUtils.loadTexture('images/grid.jpg');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat = new THREE.Vector2(50,50);
texture.anisotropy = renderer.getMaxAnisotropy();

var geometry = new THREE.PlaneBufferGeometry(1000, 1000);
var material = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  specular: 0xffffff,
  shininess: 20,
  shading: THREE.FlatShading,
  map: texture
});
var grid = new THREE.Mesh(geometry, material);
grid.rotation.x = -Math.PI/2;
scene.add(grid);

var onModelLoad = function(object, materials) {
  materials[0].ambient = new THREE.Color(0x0000ff);
  materials[0].color = new THREE.Color(0x0000ff);
  var mesh = new THREE.Mesh(object, new THREE.MeshFaceMaterial(materials));
  mesh.rotation.y = Math.PI/2
  scene.add(mesh);
};

loader.load('models/lightcycle.json', onModelLoad);

var controls = new THREE.VRControls(camera);

var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

var enterVR = function() {
  effect.setFullScreen(true);
  vrMode = true;
};

var exitVR = function() {
  effect.setFullScreen(false);
  vrMode = false;
};

var toggleVR = function() {
  if (!vrMode) {
    enterVR();
  } else {
    exitVR();
  }
}

var onKey = function(event) {
  if (event.keyCode == 70) { // f
    toggleVR();
  }
};

window.addEventListener('keydown', onKey, true);

var onWindowResize = function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  effect.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener('resize', onWindowResize, false);

var render = function () {
  requestAnimationFrame(render);
  person.rotation.y += 0.005;
  if(vrMode) {
    controls.update();
  }
  effect.render(scene, camera);
};
render();
