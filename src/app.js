/**
 * GLOBAL VARS
 */
lastTime = Date.now();
cameras = {
    default: null,
    current: null
};
canvas = {
    element: null,
    container: null
}
labels = {}
cameraControl = null;
scene = null;
renderer = null

raycaster = new THREE.Raycaster();
var mouseRayCaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var hoveredList = [];
var hoverList = [];

colorCube = new THREE.Color(0x10ac84);
boxGeo = new THREE.BoxGeometry(10, 10, 10);

mode = 0;
collidableList = [];



/**
 * Function to start program running a
 * WebGL Application trouhg ThreeJS
 */
let webGLStart = () => {
    initScene();
    window.onresize = onWindowResize;
    window.onmousemove = onMouseMove;
    lastTime = Date.now();
    animateScene();
};

function onMouseMove(event) {

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

}

function mouseClick(event) {

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    // canvas.container.clientWidth, canvas.container.clientHeight
    mouse.x = (event.clientX / canvas.container.clientWidth) * 2 - 1;
    mouse.y = - (event.clientY / canvas.container.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, cameras.default);
    var intersections = raycaster.intersectObjects(hoverList);
    if (intersections.length > 0) {
        switch (mode) {
            case 0:
                var intersect = intersections[0];
                let boxMaterial = new THREE.MeshPhongMaterial({
                    color: colorCube,
                    specular: 0xffffff,
                    shininess: 1,
                    shading: THREE.FlatShading,
                    reflectivity: 1
                });
                let box = new THREE.Mesh(boxGeo, boxMaterial);
                // console.log(intersect.point);
                // console.log(intersect.face.normal);
                // console.log(box.position.divideScalar(10).floor());
                // console.log(box.position.divideScalar(10).floor().multiplyScalar(10));
                // console.log(box.position.divideScalar(10).floor().multiplyScalar(10).addScalar(5));
                box.position.copy(intersect.point).add(intersect.face.normal);
                box.position.divideScalar(10).floor().multiplyScalar(10).addScalar(5);
                // box.position.y = 100;
                this.collidableBox = new CollidableBox(box, 5);
                collidableList.push(box);

                console.log(box);
                box.castShadow = true;
                box.receiveShadow = true;
                scene.add(box);
                hoverList.push(box);
                console.log('Click hover');
                break;
            case 1:
                if (intersections[0].object.name != "Base") {
                    var pos = hoverList.indexOf(intersections[0].object);
                    hoverList.splice(pos, 1);
                    scene.remove(intersections[0].object);
                }
                break;

            default:
                break;
        }


    }
}

function modeBrush() {
    mode = 0;
    var modeDiv = document.querySelector(".mode");
    modeDiv.innerHTML = "Brush Mode";
}

function modeDelete() {
    mode = 1;
    var modeDiv = document.querySelector(".mode");
    modeDiv.innerHTML = "Trash Mode";
}


function changeColor(event) {
    let colorStr = document.getElementById("color").value;
    colorCube.setStyle(colorStr);
}
/**
 * Here we can setup all our scene noobsters
 */
function initScene() {
    document.addEventListener('mousedown', mouseClick, false);
    document.addEventListener("input", changeColor, false);
    //Selecting DOM Elements, the canvas and the parent element.
    canvas.container = document.querySelector("#app");
    canvas.element = canvas.container.querySelector("#appCanvas");

    /**
     * SETTING UP CORE THREEJS APP ELEMENTS (Scene, Cameras, Renderer)
     * */
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ canvas: canvas.element });
    renderer.setSize(canvas.container.clientWidth, canvas.container.clientHeight);
    renderer.setClearColor(0x0abde3, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    canvas.container.appendChild(renderer.domElement);

    //positioning cameras
    cameras.default = new THREE.PerspectiveCamera(45, canvas.container.clientWidth / canvas.container.clientHeight, 0.1, 10000);
    cameras.default.position.set(0, 300, 400);
    cameras.default.lookAt(new THREE.Vector3(0, 0, 0));

    //CAMERAS
    var tracking = new THREE.PerspectiveCamera(45, canvas.container.clientWidth / canvas.container.clientHeight, 1, 10000);
    tracking.position.set(1600, 1600, -1600);
    tracking.lookAt(new THREE.Vector3(0, 0, 0));

    var fixed = new THREE.PerspectiveCamera(45, canvas.container.clientWidth / canvas.container.clientHeight, 1, 10000);
    fixed.position.set(-600, 300, -600);
    fixed.lookAt(new THREE.Vector3(0, 0, 0));

    var tpersona = new THREE.PerspectiveCamera(45, canvas.container.clientWidth / canvas.container.clientHeight, 1, 10000);
    tpersona.position.set(1600, 1600, -1600);
    tpersona.lookAt(new THREE.Vector3(0, 0, 0));

    var observer = new THREE.PerspectiveCamera(45, canvas.container.clientWidth / canvas.container.clientHeight, 1, 10000);
    observer.position.set(1600, 1600, -1600);
    observer.lookAt(new THREE.Vector3(0, 0, 0));

    cameras.tracking = tracking;
    cameras.fixed = fixed;
    cameras.tpersona = tpersona;
    cameras.observer = observer;
    //Setting up current default camera as current camera
    cameras.current = cameras.default;

    //Camera control Plugin
    cameraControl = new THREE.OrbitControls(cameras.current, renderer.domElement);

    lAmbiente = new THREE.AmbientLight(0xffffff);
    scene.add(lAmbiente);

    spotLight = new THREE.SpotLight(0xffffff, 1.5, 2000, 0.3, 1, 1);
    spotLight.position.set(600, 800, 0);
    spotLight.castShadow = true;
    spotLight.lookAt(new THREE.Vector3(0, 0, 0));
    spotLight.shadow.mapSize.width = 3000;
    spotLight.shadow.mapSize.height = 3000;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;
    scene.add(spotLight);
    // scene.add(new THREE.SpotLightHelper(spotLight));

    //FPS monitor
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = stats.domElement.style.left = '10px';
    stats.domElement.style.zIndex = '100';
    document.body.appendChild(stats.domElement);



    initObjects();
}

/**
 * Function to add all objects and stuff to scene
 */
function initObjects() {
    //Base
    let plane = new THREE.Mesh(
        new THREE.BoxGeometry(400, 400, 0.1, 40, 40, 40),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    )
    plane.rotation.x = -Math.PI / 2;
    plane.name = "Base";
    hoverList.push(plane);
    collidableList.push(plane);
    scene.add(plane);

    var size = 400;
    var divisions = 40;

    var gridHelper = new THREE.GridHelper(size, divisions);
    gridHelper.position.y = 0.3;
    scene.add(gridHelper);
    // items.forEach(element => {
    //     if (element["properties"] == null) { return false; } //prevenir errores si no existen propiedades
    //     let properties = {}; //objeto vacío de propiedades
    //     properties = getProperties(element["properties"]);

    //     switch (properties["type"]["value"]) {
    //         case "cube":
    //             createCube(element, properties);
    //             break;
    //         case "sphere":
    //             createSphere(element, properties);
    //             break;
    //     }
    // });
}

function createCube(element, properties) {
    let [w, h, d, color] = [ //Definición de múltiples variables para crear el objeto
        getProperty(properties, "width") || 20,
        getProperty(properties, "height") || 20,
        getProperty(properties, "depth") || 20,
        parseInt(getProperty(properties, "color")) || 0xffffff,
    ];
    let obj = new THREE.Mesh(
        new THREE.CubeGeometry(w, h, d),
        new THREE.MeshPhongMaterial({ color: color })
    );
    obj.myId = element.id;
    setPosition(obj, getProperty(properties, "posX"), getProperty(properties, "posY"), getProperty(properties, "posZ"));
    hoverList.push(obj);
    console.log(obj)
    scene.add(obj);
}

function createSphere(element, properties) {
    let [radius, ws, hs, color] = [ //Definición de múltiples variables para crear el objeto
        getProperty(properties, "radius") || 10,
        getProperty(properties, "ws") || 10,
        getProperty(properties, "hs") || 10,
        parseInt(getProperty(properties, "color")) || 0xffffff,
    ];
    let obj = new THREE.Mesh(
        new THREE.SphereGeometry(radius, ws, hs),
        new THREE.MeshPhongMaterial({ color: color })
    );
    obj.myId = element.id;
    setPosition(obj, getProperty(properties, "posX"), getProperty(properties, "posY"), getProperty(properties, "posZ"));
    hoverList.push(obj);
    console.log(obj);
    scene.add(obj);
}

function getProperty(properties, property) {
    let keys = Object.keys(properties);
    let resultado = keys.find((element) => {
        return element == property;
    });

    return (resultado != undefined) ? properties[property]["value"] : undefined;
}

function getProperties(p) {
    let properties = [];
    for (let i = 0; i < p.length; i++) { //ciclo que recorre las propiedades
        const property = p[i]; //constante para un llamado más fácil
        properties[property["name"]] = property; //Asigno al ojeto un atributo con el nombre de la 
    }
    return properties;
}

function setPosition(obj, x, y, z) {
    var [x, y, z] = [x || 0, y || 0, z || 0];
    obj.position.set(x, y, z);
}

/**
 * Function to render application over
 * and over.
 */
function animateScene() {
    requestAnimationFrame(animateScene);
    renderer.render(scene, cameras.current);
    updateScene();
}

/**
 * Function to evaluate logic over and
 * over again.
 */
function updateScene() {
    lastTime = Date.now();

    //Updating camera view by control inputs
    cameraControl.update();
    //Updating FPS monitor
    stats.update();



    ///// RAYCASTER DEL MOUSE
    // // update the picking ray with the camera and mouse position
    // mouseRayCaster.setFromCamera(mouse, cameras.default);

    // // calculate objects intersecting the picking ray
    // var intersects = mouseRayCaster.intersectObjects(hoverList);

    // for (var i = 0; i < intersects.length; i++) {

    //     let isHovered = hoveredList.find((obj) => {
    //         return obj == intersects[i].object;
    //     });
    //     if (!isHovered) {
    //         hoveredList.push(intersects[i].object);
    //         intersects[i].object.material.color.set(0xff0000);
    //     }
    // }

    // if (intersects.length <= 0) {
    //     hoveredList.forEach(obj => {
    //         var color = "";
    //         //console.log(i);
    //         for (let i = 0; i < items.length; i++) {
    //             const element = items[i];
    //             if (element.id == obj.myId) {
    //                 let p = getProperties(element.properties);
    //                 color = getProperty(p, "color");
    //                 obj.material.color.set(parseInt(color));
    //             }
    //         }

    //     });
    // }

}

function onWindowResize() {
    cameras.current.aspect = window.innerWidth / window.innerHeight;
    cameras.current.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}