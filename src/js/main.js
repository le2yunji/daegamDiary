import * as THREE from 'three';
import * as CANNON from 'cannon-es'
// import * as BufferGeometryUtils from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Player } from './classes/Player';
import { Onion } from './classes/Onion';
import { ClassroomGamza } from './classes/ClassroomGamza';
import { Classmate } from './classes/Classmate'
import gsap from 'gsap';
import { GUI } from 'dat.gui'
import { Model } from './classes/Model';


// Texture
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load('./images/grid.png');
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.x = 50;
floorTexture.repeat.y = 50;

// Renderer
const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({
	canvas,
	antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Scene
const scene = new THREE.Scene();

// AxesHelper
const axesHelper = new THREE.AxesHelper(1000); // 축 크기
axesHelper.position.y = 0.5
// scene.add(axesHelper);

// Camera
const camera = new THREE.OrthographicCamera(
	-(window.innerWidth / window.innerHeight), // left
	window.innerWidth / window.innerHeight, // right,
	1, // top
	-1, // bottom
	-1000,
	1000
);

const cameraPosition = new THREE.Vector3(1, 5, 5);
camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
camera.zoom = 0.07; // OrthographicCamera는 줌 설정 가능
camera.updateProjectionMatrix();
scene.add(camera);

// GUI
const gui = new GUI();
const cameraFolder = gui.addFolder('Camera');
cameraFolder.add(camera, 'zoom', 0.01, 0.3, 0.001) // 줌 범위 설정 (최소값, 최대값, 스텝)
	.name('Zoom')
	.onChange(() => {
		camera.updateProjectionMatrix(); // 줌 변경 후 업데이트 필요
	});
cameraFolder.open();


// Cannon(물리 엔진)
const cannonWolrd = new CANNON.World();
cannonWolrd.gravity.set(0, -10, 0); // 중력 가속도 설정. 지구는 9.8, 측(방향)별로 세팅. y만 하면 됨.



// Light
const ambientLight = new THREE.AmbientLight('FFF8DA', 2.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('white', 0.5);
const directionalLightOriginPosition = new THREE.Vector3(1, 1, 1);
directionalLight.position.x = directionalLightOriginPosition.x;
directionalLight.position.y = directionalLightOriginPosition.y;
directionalLight.position.z = directionalLightOriginPosition.z;
directionalLight.castShadow = true;

// mapSize 세팅으로 그림자 퀄리티 설정
directionalLight.shadow.mapSize.width = 2024;
directionalLight.shadow.mapSize.height = 2024;
// 그림자 범위
directionalLight.shadow.camera.left = -100;
directionalLight.shadow.camera.right = 100;
directionalLight.shadow.camera.top = 100;
directionalLight.shadow.camera.bottom = -100;
directionalLight.shadow.camera.near = -100;
directionalLight.shadow.camera.far = 100;
scene.add(directionalLight);

// Mesh
const meshes = [];
const floorMesh = new THREE.Mesh(
	new THREE.PlaneGeometry(1000, 1000),
	new THREE.MeshStandardMaterial({
		map: floorTexture
	})
);
floorMesh.name = 'floor';
floorMesh.rotation.x = -Math.PI/2;
floorMesh.receiveShadow = true;
scene.add(floorMesh);
meshes.push(floorMesh);
// camera.lookAt(floorMesh)

// 바닥 이미지 - 돌 감자
const dolgamzaTexture = new THREE.TextureLoader().load('./images/rock_gamza.png')
const dolgamzaPlaneGeometry = new THREE.PlaneGeometry(1, 1);
const dolgamzaMaterial = new THREE.MeshBasicMaterial({
	map: dolgamzaTexture,
	transparent: true, // PNG의 투명도 반영                                   
	alphaTest: 0.5 // 알파 값 기준
});
dolgamzaTexture.colorSpace = THREE.SRGBColorSpace; // sRGB 색 공간 설정
dolgamzaTexture.needsUpdate = true;
const dolgamza = new THREE.Mesh(dolgamzaPlaneGeometry, dolgamzaMaterial);
dolgamza.castShadow = true; 
dolgamza.position.x = 33
dolgamza.position.z = 32
dolgamza.position.y = 0.5
dolgamza.scale.set(7, 10, 10)
dolgamza.rotation.x = THREE.MathUtils.degToRad(-90)
// dolgamza.rotation.z = THREE.MathUtils.radToDeg(90)
scene.add(dolgamza);

// 바닥 이미지 - 양파 감자 고구마
const oniongamzagogumaTexture = new THREE.TextureLoader().load('./images/onion_gamza_goguma.png')
const oniongamzagogumaPlaneGeometry = new THREE.PlaneGeometry(1, 1);
const oniongamzagogumaMaterial = new THREE.MeshBasicMaterial({
	map: oniongamzagogumaTexture,
	transparent: true, // PNG의 투명도 반영
	alphaTest: 0.5 // 알파 값 기준
});
oniongamzagogumaTexture.colorSpace = THREE.SRGBColorSpace; // sRGB 색 공간 설정
oniongamzagogumaTexture.needsUpdate = true;
const oniongamzagoguma = new THREE.Mesh(oniongamzagogumaPlaneGeometry, oniongamzagogumaMaterial);
oniongamzagoguma.castShadow = true; 
oniongamzagoguma.position.x = 69
oniongamzagoguma.position.z = 37
oniongamzagoguma.position.y = 0.5
oniongamzagoguma.scale.set(8, 11, 11)
oniongamzagoguma.rotation.x = THREE.MathUtils.degToRad(-90)
// dolgamza.rotation.z = THREE.MathUtils.radToDeg(90)
scene.add(oniongamzagoguma);


const pointerMesh = new THREE.Mesh(
	new THREE.PlaneGeometry(1, 1),
	new THREE.MeshBasicMaterial({
		color: 'crimson',
		transparent: true,
		opacity: 0.5,
		visible: false
	})
);
pointerMesh.rotation.x = -Math.PI/2;
pointerMesh.position.y = 0.01;
pointerMesh.receiveShadow = true;
scene.add(pointerMesh);


const gltfLoader = new GLTFLoader();

// 감자
const player = new Player({
	scene,
	meshes,
	gltfLoader,
	modelSrc: './models/Gamza_Cycle01.glb',
	x: -20,
	z: -10,
});


// 감자 머리 위 삼각형
const triangleTexture = new THREE.TextureLoader().load('./images/smile.png')
const trianglePlaneGeometry = new THREE.PlaneGeometry(2, 2);
const triangleMaterial = new THREE.MeshBasicMaterial({
	map: triangleTexture,
	transparent: true, // PNG의 투명도 반영
	alphaTest: 0.5, // 알파 값 기준
});
triangleTexture.colorSpace = THREE.SRGBColorSpace; // sRGB 색 공간 설정
triangleTexture.needsUpdate = true;
const triangle = new THREE.Mesh(trianglePlaneGeometry, triangleMaterial);
// triangle.position.x = 10
triangle.rotation.x = THREE.MathUtils.degToRad(-10)
triangle.rotation.y = THREE.MathUtils.degToRad(8)

// triangle.position.z = 10


//// 감자 발자국
// const footprintTexture = new THREE.TextureLoader().load('./images/footprint.png')
// const footprintPlaneGeometry = new THREE.PlaneGeometry(0.6, 0.6);
// const footprintMaterial = new THREE.MeshBasicMaterial({
// 	map: footprintTexture,
// 	transparent: true, // PNG의 투명도 반영
// 	alphaTest: 0.5, // 알파 값 기준
// 	opacity: 0
// });
// footprintTexture.colorSpace = THREE.SRGBColorSpace; // sRGB 색 공간 설정
// footprintTexture.needsUpdate = true;
// const footprint = new THREE.Mesh(footprintPlaneGeometry, footprintMaterial);
// footprint.position.y = 0.05
// footprint.rotation.x = THREE.MathUtils.degToRad(-90)


// footprint 생성 함수
function createFootprint(texturePath, position, rotation) {
	const footprintTexture = new THREE.TextureLoader().load(texturePath);
	const footprintPlaneGeometry = new THREE.PlaneGeometry(0.6, 0.6);
	const footprintMaterial = new THREE.MeshBasicMaterial({
		map: footprintTexture,
		transparent: true, // PNG의 투명도 반영
		alphaTest: 0.5, // 알파 값 기준
		opacity: 0.7
	});
	footprintTexture.colorSpace = THREE.SRGBColorSpace; // sRGB 색 공간 설정
	footprintTexture.needsUpdate = true;
	const footprint = new THREE.Mesh(footprintPlaneGeometry, footprintMaterial);

	footprint.position.y = 0.05
	footprint.rotation.x = THREE.MathUtils.degToRad(-90)
	
	// 위치와 회전 값 적용
	footprint.position.set(position.x, position.y, position.z);
	footprint.rotation.set(rotation.x, rotation.y, rotation.z);

	return footprint;
}


// #S-4 강의실에서 발표하는 대감이

// 강의실 스팟 메쉬
const classroomSpotMesh = new THREE.Mesh(
	new THREE.PlaneGeometry(3, 3),
	new THREE.MeshStandardMaterial({
		color: 'skyblue',
		transparent: true,
		opacity: 0.5
	})
);
classroomSpotMesh.position.set(50, 0.005, 20);
classroomSpotMesh.rotation.x = THREE.MathUtils.degToRad(-90)
classroomSpotMesh.receiveShadow = true;
scene.add(classroomSpotMesh);

// 강의실 햇빛
// const classroomSunLight = new THREE.DirectionalLight('#FFF8DA', 2)
// classroomSunLight.position.set(40, 10, 20)
// classroomSunLight.target.position.set(50, 0.3, 20);
// const sunlightHelper = new THREE.DirectionalLightHelper(classroomSunLight);

// // scene.add(classroomSunLight);
// scene.add(classroomSunLight.target);
// scene.add(sunlightHelper);

// 강의실 전등
const classroomLight = new THREE.PointLight('white', 30, 30, 2); 
classroomLight.position.set(50, 7, 20)
const lightHelper = new THREE.PointLightHelper(classroomLight);
// 강의실 전등 그림자 설정
classroomLight.castShadow = true;
classroomLight.shadow.camera.left = -1;
classroomLight.shadow.camera.right = 1;
classroomLight.shadow.camera.top = 1;
classroomLight.shadow.camera.bottom = -1;
classroomLight.shadow.mapSize.width = 2024; // 기본값 = 512
classroomLight.shadow.mapSize.height = 2024;
classroomLight.shadow.camera.near = 1;
classroomLight.shadow.camera.far = 5;

// ppt화면
const pptTexture1 = new THREE.TextureLoader().load('./images/ppt1.png')
const pptTexture2 = new THREE.TextureLoader().load('./images/ppt2.png')
const pptTexture3 = new THREE.TextureLoader().load('./images/ppt3.png')

const planeGeometry = new THREE.PlaneGeometry(9.6, 5.4)

const pptMaterial1 = new THREE.MeshBasicMaterial({
	map: pptTexture1,
});
const pptMaterial2 = new THREE.MeshBasicMaterial({
	map: pptTexture2,
});
const pptMaterial3 = new THREE.MeshBasicMaterial({
	map: pptTexture3,
});

const ppt1 = new THREE.Mesh(planeGeometry, pptMaterial1);
const ppt2 = new THREE.Mesh(planeGeometry, pptMaterial2);
const ppt3 = new THREE.Mesh(planeGeometry, pptMaterial3);

ppt1.position.set(50.3, 5.45, 15.5)
ppt1.scale.set(1.435, 1.45, 1.45)
ppt2.position.set(50.3, 5.45, 15.5)
ppt2.scale.set(1.435, 1.45, 1.45)
ppt3.position.set(50.3, 5.45, 15.5)
ppt3.scale.set(1.435, 1.45, 1.45)


scene.add(ppt1, ppt2, ppt3);

ppt1.visible = false
ppt2.visible = false
ppt3.visible = false


// 강의실
const classroom = new Model({
	gltfLoader,
	scene,
	modelSrc: './models/s4_classroom.glb',
	x: 44,  
	y: -10.3,
	// y: 5.05,
	z: 20, 
	rotationY: THREE.MathUtils.degToRad(90),
	// scaleX: 4,
	// scaleY: 4,
	// scaleX: 4,
	onLoad: (modelMesh) => {
		// 모델이 로드된 후에 GSAP 애니메이션 실행
		gsap.to(modelMesh.position, {
			duration: 1,
			y: 5.08,
			ease: 'Bounce.easeOut',
		});
	},
});

const sweat = new Model({
	gltfLoader,
	scene,
	modelSrc: './models/sweat.glb',
	x: 58,  
	y: 5,
	// y: 5.05,
	z: 17.5, 
	rotationY: THREE.MathUtils.degToRad(90),
	// scaleX: 4,
	// scaleY: 4,
	// scaleX: 4,
	onLoad: (modelMesh) => {
		// 모델이 로드된 후에 GSAP 애니메이션 실행
		gsap.to(modelMesh.position, {
			duration: 1,
			y: 4,
			ease: 'Bounce.easeOut',
		});
	},
})

// 강의실 감자
const classroomgamza = new ClassroomGamza({
	scene,
	meshes,
	gltfLoader,
	modelSrc: './models/s4_ipadGamza.glb',
	x: 57,
	y: 5,
	z: 17.5,
	rotationY: THREE.MathUtils.degToRad(180),
	onLoad: (modelMesh) => {
		// 모델이 로드된 후에 GSAP 애니메이션 실행
		gsap.to(modelMesh.position, {
			duration: 1,
			x: 57,
			y: 0.3,
			z: 17.5,
			ease: 'Bounce.easeOut',
		});
	},
});

// 양파교수
const onion = new Onion({
	scene,
	meshes,
	gltfLoader,
	modelSrc: './models/ProOnion.glb',
	// rotationY: Math.PI/2,
	x: 44.5,
	y: 5,
	z: 16.8,
	rotationY: THREE.MathUtils.degToRad(65),
	onLoad: (modelMesh) => {
		// 모델이 로드된 후에 GSAP 애니메이션 실행
		gsap.to(modelMesh.position, {
			duration: 1,
			x: 44.5,
			y: 0.8,
			z: 16.8,
			ease: 'Bounce.easeOut',
		});
	},
});

// 학생 감자들
const classmate1 = new Classmate({
	gltfLoader,
	scene,
	modelSrc: './models/s4_classmate1.glb',
	x: 46,
	y: 9,
	z: 24,
	rotationY: THREE.MathUtils.degToRad(90),
	// scaleX: 4,
	// scaleY: 4,
	// scaleZ: 4,
	onLoad: (modelMesh) => {
		// 모델이 로드된 후에 GSAP 애니메이션 실행
		gsap.to(modelMesh.position, {
			duration: 1,
			y: 2.86,
			ease: 'Bounce.easeOut',
		});
	},
});
const classmate2 = new Classmate({
	gltfLoader,
	scene,
	modelSrc: './models/s4_classmate2.glb',
	x: 50.9,  // + 4 
	y: 9,
	z: 24.5,    // + 1
	rotationY: THREE.MathUtils.degToRad(90),
	// scaleX: 4,
	// scaleY: 4,
	// scaleX: 4,
	onLoad: (modelMesh) => {
		// 모델이 로드된 후에 GSAP 애니메이션 실행
		gsap.to(modelMesh.position, {
			duration: 1,
			y: 1,
			ease: 'Bounce.easeOut',
		});
	},
});
const classmate3 = new Classmate({
	gltfLoader,
	scene,
	modelSrc: './models/s4_classmate1.glb',
	x: 56,
	y: 9,
	z: 25,
	rotationY: THREE.MathUtils.degToRad(90),
	// scaleX: 4,
	// scaleY: 4,
	// scaleX: 4,
	onLoad: (modelMesh) => {
		// 모델이 로드된 후에 GSAP 애니메이션 실행
		gsap.to(modelMesh.position, {
			duration: 1,
			y: 2.86,
			ease: 'Bounce.easeOut',
		});
	},
});
const classmate4 = new Classmate({
	gltfLoader,
	scene,
	modelSrc: './models/s4_classmate2.glb',
	x: 46,
	y: 5,
	z: 31,
	rotationY: THREE.MathUtils.degToRad(90),
	// scaleX: 4,
	// scaleY: 4,
	// scaleX: 4,
	onLoad: (modelMesh) => {
		// 모델이 로드된 후에 GSAP 애니메이션 실행
		gsap.to(modelMesh.position, {
			duration: 1,
			y: 1.5,
			ease: 'Bounce.easeOut',
		});
	},
});
const classmate5 = new Classmate({
	gltfLoader,
	scene,
	modelSrc: './models/s4_classmate1.glb',
	x: 50.6,
	y: 9,
	z: 30.5,
	rotationY: THREE.MathUtils.degToRad(90),
	// scaleX: 4,
	// scaleY: 4,
	// scaleX: 4,
	onLoad: (modelMesh) => {
		// 모델이 로드된 후에 GSAP 애니메이션 실행
		gsap.to(modelMesh.position, {
			duration: 1,
			y: 2.86,
			ease: 'Bounce.easeOut',
		});
	},
});
const classmate6 = new Classmate({
	gltfLoader,
	scene,
	modelSrc: './models/s4_classmate2.glb',
	x: 56,
	y: 5,
	z: 31.5,
	rotationY: THREE.MathUtils.degToRad(90),
	// scaleX: 4,
	// scaleY: 4,
	// scaleX: 4,
	onLoad: (modelMesh) => {
		// 모델이 로드된 후에 GSAP 애니메이션 실행
		gsap.to(modelMesh.position, {
			duration: 1,
			y: 1.5,
			ease: 'Bounce.easeOut',
		});
	},
});

const raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let destinationPoint = new THREE.Vector3();
let startDestinationPoint = new THREE.Vector3();
let angle = 0;
let isPressed = false; // 마우스를 누르고 있는 상태
let started = false;


// 그리기
const clock = new THREE.Clock();

function draw() {
	const delta = clock.getDelta();
	const elapsedTime = clock.getElapsedTime(); // 전체 경과 시간
	// player.loadModel();

	if (player.mixer) player.mixer.update(delta);
	if (onion.mixer) onion.mixer.update(delta)
	if (classroomgamza.mixer) classroomgamza.mixer.update(delta); 
	
	if (!started) {
		setTimeout(() => {
			startRun();
			player.moving = true;  // 이동 시작
		}, 7000);
		started = true;
	}

	if (player.modelMesh && started) camera.lookAt(player.modelMesh.position);

	if (player.modelMesh && started) {

		// 마우스를 누르고있을 때
		if (isPressed) {
			raycasting();
		}

		// 감자가 움직일 때
		if (player.moving) {

			scene.add(triangle)
			if (triangle) {
			// Y 좌표를 부드럽게 오르락내리락
			triangle.position.y = 7 + Math.sin(elapsedTime * 3) * 0.4; // 3.5 ~ 4.5 범위에서 움직임
			}

			// 걸어가는 상태
			angle = Math.atan2(   	// 현재 위치와 목표지점의 거리를 통해 각도 계산
				destinationPoint.z - player.modelMesh.position.z,
				destinationPoint.x - player.modelMesh.position.x
			);
			// 구한 각도를 이용해 좌표를 구하고 그 좌표로 이동
			player.modelMesh.position.x += Math.cos(angle) * 0.2;  // 걷는 속도
			player.modelMesh.position.z += Math.sin(angle) * 0.2;

			// 카메라도 같이 이동
			camera.position.x = cameraPosition.x + player.modelMesh.position.x;
			camera.position.z = cameraPosition.z + player.modelMesh.position.z;

			// 머리 위 삼각형도 따라가기
			if (triangle) {
				triangle.position.x = player.modelMesh.position.x;
				triangle.position.z = player.modelMesh.position.z;
			}

			player.actions[1].play();
			
			if (
				Math.abs(destinationPoint.x - player.modelMesh.position.x) < 0.1 &&
				Math.abs(destinationPoint.z - player.modelMesh.position.z) < 0.1
			) {
				player.moving = false;
			}
			console.log(destinationPoint.x , destinationPoint.z)

			// 강의실 인터랙션
			if (   // 파란색 포인트 지점(3*3사각형) 안에 도달시 
			Math.abs(classroomSpotMesh.position.x - player.modelMesh.position.x) < 1.5 &&
			Math.abs(classroomSpotMesh.position.z - player.modelMesh.position.z) < 1.5
			){
				if(!classroom.visible){

					classroomSpotMesh.material.color.set('seagreen');
					[classroom, classmate1, classmate2, classmate3, classmate4, classmate5, classmate6].forEach(obj => obj.loadModel());

					// 카메라 각도 변환
					gsap.to(
						camera.position,
						{
							duration: 1,
							y: 3
						}
					);
			
					setTimeout(()=>{
						scene.add(classroomLight);
						ppt1.visible = true;
						ppt2.visible = false;
						ppt3.visible = false;
					}, 1000)
					
					setTimeout(()=>{
						onion.loadModel();
						classroomgamza.loadModel();
						sweat.loadModel();
					}, 200)

					setTimeout(()=>{
					}, 500)

					player.moving = false;
					triangle.visible = false;
					// player 사라짐
					gsap.to(
						player.modelMesh.scale,
						{
							duration: 0.4,
							x: 0,
							y: 0,
							z: 0,
							ease: 'expo.easeOut'   // 튀어나옴 효과. 라이브러리가 가지고 있는 값.
						}
					);
					
					classroomSpotMesh.visible = false
					// pointerMesh.visible = false
					isPressed = false;
					// 마우스 이벤트 비활성화
					disableMouseEvents();


					setTimeout(()=>{
						ppt1.visible = false;
						ppt2.visible = true;
						ppt3.visible = false;

						gsap.to(
						ppt2,
						{
							duration: 1.4,
							ease: 'Bounce.easeOut'   // 튀어나옴 효과. 라이브러리가 가지고 있는 값.
						});
					}, 3000)


					setTimeout(()=>{
						ppt1.visible = false;
						ppt2.visible = false;
						ppt3.visible = true;

						gsap.to(
						ppt3,
						{
							duration: 1.4,
							ease: 'Bounce.easeOut'   // 튀어나옴 효과. 라이브러리가 가지고 있는 값.
						}
						);
						
						onion.actions[0].play();
						classroomgamza.actions[0].play();
							

					}, 8000)

					// classroomMusic.stop()

					// 발표 인터랙션
					// if (   // 파란색 포인트 지점(3*3사각형) 안에 도달시 
					// Math.abs(presentSpotMesh.position.x - player.modelMesh.position.x) < 1 &&
					// Math.abs(presentSpotMesh.position.z - player.modelMesh.position.z) < 1
					// ) { 
					// 	presentSpotMesh.material.color.set('seagreen');
					// }
				}
			}
		} else {
			player.moving = false;
			// 서 있는 상태
			player.actions[1].stop();
		}
	}

	renderer.render(scene, camera);
	renderer.setAnimationLoop(draw);
}








/////// -------------------- 건들지 않는 부분 -------------------------

// 시작 지점으로 가는 함수
function startRun() {
	// raycaster.setFromCamera(mouse, camera);
	startDestinationPoint.x = 1;  // destinationPoint 목표 지점
	startDestinationPoint.y = 0.3; // 위아래로는 움직이지 않기때문에 고정값
	startDestinationPoint.z = 1;

	if (player.moving) {
		player.modelMesh.lookAt(destinationPoint);
	}
	player.modelMesh.lookAt(startDestinationPoint);  // 광선이 맞은 포인트 위치를 바라봄

	if (player.modelMesh.position.x === startDestinationPoint.x) {
		player.modelMesh.lookAt(camera)
	}
	player.modelMesh.rotation.y += Math.PI; // 180도 회전 추가 (필요하면 조정)
}

// 좌표 얻어내는 함수
function checkIntersects() {
	// raycaster.setFromCamera(mouse, camera);

	const intersects = raycaster.intersectObjects(meshes);
	for (const item of intersects) {
		if (item.object.name === 'floor') {   // 바닥을 클릭했을 때
			destinationPoint.x = item.point.x;  // destinationPoint 목표 지점
			destinationPoint.y = 0.3; // 위아래로는 움직이지 않기때문에 고정값
			destinationPoint.z = item.point.z;
			player.modelMesh.lookAt(destinationPoint);  // 광선이 맞은 포인트 위치를 바라봄
            player.modelMesh.rotation.y += Math.PI; // 180도 회전 추가 (필요하면 조정)

			player.moving = true;

			pointerMesh.position.x = destinationPoint.x;
			pointerMesh.position.z = destinationPoint.z;

			// console.log(destinationPoint.x, destinationPoint.z)
		}
		break;
	}
}



function setSize() {
	camera.left = -(window.innerWidth / window.innerHeight);
	camera.right = window.innerWidth / window.innerHeight;
	camera.top = 1;
	camera.bottom = -1;

	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.render(scene, camera);
}

// 이벤트
window.addEventListener('resize', setSize);

// 마우스 좌표를 three.js에 맞게 변환 
function calculateMousePosition(e) {
	mouse.x = e.clientX / canvas.clientWidth * 2 - 1;
	mouse.y = -(e.clientY / canvas.clientHeight * 2 - 1);
}

// // 변환된 마우스 좌표를 이용해 래이캐스팅
// function run() {
// 	raycaster.setFromCamera(mouse, camera);
// 	startRun();
// }

// 변환된 마우스 좌표를 이용해 래이캐스팅
function raycasting() {
	raycaster.setFromCamera(mouse, camera);
	checkIntersects();
}


// 마우스 이벤트 핸들러 정의
function onMouseDown(e) {
    isPressed = true;
    calculateMousePosition(e);
}

function onMouseUp() {
    isPressed = false;
}

function onMouseMove(e) {
    if (isPressed) {
        calculateMousePosition(e);
    }
}

function onTouchStart(e) {
    isPressed = true;
    calculateMousePosition(e.touches[0]);
}

function onTouchEnd() {
    isPressed = false;
}

function onTouchMove(e) {
    if (isPressed) {
        calculateMousePosition(e.touches[0]);
    }
}


// 이벤트 등록
canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mouseup', onMouseUp);
canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('touchstart', onTouchStart);
canvas.addEventListener('touchend', onTouchEnd);
canvas.addEventListener('touchmove', onTouchMove);


// 마우스 이벤트 제거 함수
function disableMouseEvents() {
    canvas.removeEventListener('mousedown', onMouseDown);
    canvas.removeEventListener('mouseup', onMouseUp);
    canvas.removeEventListener('mousemove', onMouseMove);
    canvas.removeEventListener('touchstart', onTouchStart);
    canvas.removeEventListener('touchend', onTouchEnd);
    canvas.removeEventListener('touchmove', onTouchMove);
}

// 마우스 이벤트 활성화 함수
function enableMouseEvents() {
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchstart', onTouchStart);
    canvas.addEventListener('touchend', onTouchEnd);
    canvas.addEventListener('touchmove', onTouchMove);
}

draw();



