import * as THREE from 'three';
// import * as BufferGeometryUtils from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';
import { CafeGamza } from './classes/CafeGamza';
import { Player } from './classes/Player';
import { Onion } from './classes/Onion';
import { ClassroomGamza } from './classes/ClassroomGamza';
import { Classmate } from './classes/Classmate'
import { NomoneyGamza } from './classes/NomenyGamza'; 
import { AlbaGamza } from './classes/AlbaGamza';
import { GUI } from 'dat.gui'
import { Model } from './classes/Model';
import { Bakery } from './classes/Bakery';
import { BakeryGamza } from './classes/BakeryGamza';
import { BakeryProps } from './classes/BakeryProps';
import { Bam } from './classes/Bam';
import { MailGamza } from './classes/MailGamza';
import { MailBox } from './classes/MailBox';
import { File } from './classes/File';
import { Bankbook } from './classes/Bankbook';
import { Coffee } from './classes/Coffee';  
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Metro } from './classes/Metro'

// Texture
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load('images/load.png');
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.x = 1;
floorTexture.repeat.y = 1;

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
camera.zoom = 0.075; // OrthographicCamera는 줌 설정 가능
camera.updateProjectionMatrix();


// Camera2 - 알바몽 게시판 알바찾기
const camera2 = new THREE.OrthographicCamera(
	-(window.innerWidth / window.innerHeight), // left
	window.innerWidth / window.innerHeight, // right,
	1, // top
	-1, // bottom
	-1000,
	1000
);
camera2.position.x = 45
camera2.position.y = 4
camera2.position.z = 57
camera2.zoom = 0.13
camera2.updateProjectionMatrix();
camera2.lookAt(45, 1, 52)





// ⚪️ 🚆🚈
// Camera3 - 지하철 등교 씬
const camera3 = new THREE.OrthographicCamera(
	-(window.innerWidth / window.innerHeight), // left
	window.innerWidth / window.innerHeight, // right,
	1, // top
	-1, // bottom
	-1000,
	1000
);
camera3.position.x = -75
camera3.position.y = 20
camera3.position.z = -62.5
camera3.zoom = 0.1
camera3.updateProjectionMatrix();
camera3.lookAt(-52, 1, -82)




scene.add(camera, camera2, camera3);





const gltfLoader = new GLTFLoader()


// GUI
const gui = new GUI();
const cameraFolder = gui.addFolder('Camera');
cameraFolder.add(camera, 'zoom', 0.01, 0.3, 0.001) // 줌 범위 설정 (최소값, 최대값, 스텝)
	.name('Zoom')
	.onChange(() => {
		camera.updateProjectionMatrix(); // 줌 변경 후 업데이트 필요
	});
cameraFolder.open();

// Light
const ambientLight = new THREE.AmbientLight('#fff', 2.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('white', 0.5);
const directionalLightOriginPosition = new THREE.Vector3(1, 1, 1);
// directionalLight.position.x = directionalLightOriginPosition.x;
// directionalLight.position.y = directionalLightOriginPosition.y;
// directionalLight.position.z = directionalLightOriginPosition.z;
directionalLight.position.set(1, 1, 1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);

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
	new THREE.PlaneGeometry(400, 400),
	new THREE.MeshStandardMaterial({ map: floorTexture })
);
floorMesh.name = 'floor';
floorMesh.rotation.x = -Math.PI/2;
floorMesh.receiveShadow = true;
scene.add(floorMesh);
meshes.push(floorMesh);
// camera.lookAt(floorMesh)


// Scene 배경

// 🧑‍🏫 강의실
const classroom = new Model({
	gltfLoader,
	scene,
	modelSrc: './models/classroom33.glb',
	x: -10,  // 65 -> -10  : -75
	y: -20,
	z: -20,  // 30 -> -20  : -50
	scaleX: 1.5,
	scaleY: 1.5, 
	scaleZ: 1.5,
	rotationY: THREE.MathUtils.degToRad(60),
});

classroom.loadModel()

// 베이커리
const bakery = new Bakery({
	scene,
	meshes,
	gltfLoader,
	scaleX: 1.5,
	scaleY: 1.5, 
	scaleZ: 1.5, 
	modelSrc: './models/CafeScene.glb',
	x: 74,
	y: -15,
	z: 76,
	rotationY: THREE.MathUtils.degToRad(65)
});

bakery.loadModel()



/// 바닥 이미지 ------
// 바닥 이미지 - 돌 감자
const dolgamzaTexture = new THREE.TextureLoader().load('images/tree.png')
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
dolgamza.rotation.x = THREE.MathUtils.degToRad(0)
// dolgamza.rotation.z = THREE.MathUtils.radToDeg(90)
// scene.add(dolgamza);



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
// scene.add(pointerMesh);



// 플레이어
// 감자
const player = new Player({
	scene,
	meshes,
	gltfLoader,
	scaleX: 0.8,
	scaleY: 0.8, 
	scaleZ: 0.8, 
	modelSrc: './models/Gamza_cycle.glb',
	x: -52,
	z: -80,
});



// 감자 발자국
const footprints = [];
const footprintDistanceThreshold = 0.6;
let lastFootprintPosition = new THREE.Vector3();
let isLeftFoot = true; // 왼쪽 발 여부

function createFootprint(texturePath, position, rotation) {
    const textureLoader = new THREE.TextureLoader();

    // 비동기적으로 텍스처를 로드한 후, 발자국을 생성합니다.
    textureLoader.load(texturePath, (footprintTexture) => {
        const footprintGeometry = new THREE.PlaneGeometry(0.4, 0.4);
        const footprintMaterial = new THREE.MeshBasicMaterial({
            map: footprintTexture,
            transparent: true,
            alphaTest: 0.5,
            opacity: 0.6
        });

        footprintTexture.colorSpace = THREE.SRGBColorSpace;
        footprintTexture.needsUpdate = true;

        const footprint = new THREE.Mesh(footprintGeometry, footprintMaterial);
        footprint.position.set(position.x, position.y, position.z);
        footprint.rotation.set(rotation.x, rotation.y, rotation.z);

        // 발자국을 씬에 추가
        scene.add(footprint);
        footprints.push({ mesh: footprint, opacity: 0.8 });
    });
}

function leaveFootprint() {
    const currentPosition = player.modelMesh.position.clone();

    // 일정 거리 이상 이동 시 발자국 생성
    if (currentPosition.distanceTo(lastFootprintPosition) > footprintDistanceThreshold) {
        const footOffset = 0.3; // 좌우 발자국 간 거리
        const angle = player.modelMesh.rotation.y; // 플레이어 회전 값

        // 좌우 발자국 간 위치 보정 계산
        const offsetX = Math.cos(angle) * footOffset * (isLeftFoot ? -1 : 1);
        const offsetZ = Math.sin(angle) * footOffset * (isLeftFoot ? 1 : -1);

        const position = {
            x: currentPosition.x + offsetX,
            y: 0.01, // 발자국 위치 높이
            z: currentPosition.z + offsetZ
        };

        // 비동기적으로 발자국 생성
        createFootprint(
            'images/footprint.png', // 텍스처 경로
            position,
            { x: THREE.MathUtils.degToRad(-90), y: 0, z: 0 }
        );

        lastFootprintPosition.copy(currentPosition);
        isLeftFoot = !isLeftFoot; // 발 번갈아 사용

        // 최대 발자국 개수 유지 (최대 10개)
        if (footprints.length > 100) {
            const oldestFootprint = footprints.shift();
            scene.remove(oldestFootprint.mesh);
        }
    }
}

function fadeOutFootprints() {
    for (let i = footprints.length - 1; i >= 0; i--) {
        const footprintData = footprints[i];
        const { mesh, opacity } = footprintData;

        // 발자국이 사라질 때까지 opacity 감소
        if (opacity > 0) {
            footprintData.opacity -= 0.0002; // 사라지는 속도 조절
            mesh.material.opacity = footprintData.opacity;
        } else {
            // opacity가 0 이하로 떨어지면 scene에서 제거
            scene.remove(mesh);
            footprints.splice(i, 1); // 배열에서 제거
        }
    }
}

// 감자 머리 감정풍선
let emotion;

// 비동기적으로 텍스처를 로드
textureLoader.load('images/smile.png', (emotionTexture) => {
    // 텍스처가 로드된 후, 감정 삼각형을 생성
    const emotionPlaneGeometry = new THREE.PlaneGeometry(1.8, 1.8);
    const emotionMaterial = new THREE.MeshBasicMaterial({
        map: emotionTexture,
        transparent: true, // PNG의 투명도 반영
        alphaTest: 0.5, // 알파 값 기준
    });
    emotionTexture.colorSpace = THREE.SRGBColorSpace; // sRGB 색 공간 설정
    emotionTexture.needsUpdate = true;

    emotion = new THREE.Mesh(emotionPlaneGeometry, emotionMaterial);
    emotion.rotation.x = THREE.MathUtils.degToRad(-10);
    emotion.rotation.y = THREE.MathUtils.degToRad(8);
});



///---- COMMON ------

// Player 사라지기
function disappearPlayer() {
	gsap.to(player.modelMesh.scale, {
		duration: 0.1,
		x: 0,
		y: 0,
		z: 0,
		ease: 'bounce.inOut'
	  });
}
// Player 나타나기
function appearPlayer(){
	gsap.to(player.modelMesh.scale, {
		duration: 0.4,
		x: 0.8,
		y: 0.8,
		z: 0.8,
		ease: 'expo.easeOut',
	});
}
// 카메라 각도 변환
function downCameraY(){
	gsap.to(camera.position, {
		duration: 0.05,
		y: 3
	});
}

// 카메라 각도 복구
function returnCameraY(){
	gsap.to(camera.position, {
		duration: 1,
		y: 5
	});
}

// 모델 등장 함수
function moveModelYPosition(model, newY, duration = 0.5) {
    if (model.loaded && model.modelMesh) {
        model.modelMesh.visible = true;
        gsap.to(model.modelMesh.position, {
            y: newY,
            duration,
            ease: "Bounce.inOut",
			onUpdate: () => {
				renderer.render(scene, camera); // ✅ 애니메이션 중 렌더링 강제 업데이트
			}
        });
    } else {
        console.warn(`⚠️ 모델 이동 실패: 아직 로드되지 않음.`, model);
    }
}
  

// 화살표
const arrowTexture = new THREE.TextureLoader().load('images/arrow.png')
const arrowPlaneGeometry = new THREE.PlaneGeometry(2, 2);
const arrowMaterial = new THREE.MeshBasicMaterial({
	map: arrowTexture,
	transparent: true, // PNG의 투명도 반영
	alphaTest: 0.5, // 알파 값 기준
});
arrowTexture.colorSpace = THREE.SRGBColorSpace; // sRGB 색 공간 설정
arrowTexture.needsUpdate = true;
const arrow = new THREE.Mesh(arrowPlaneGeometry, arrowMaterial);

// 사용자 인터랙션 유도 화살표
const arrowPositions = [
	{ x: -21, y: 13, z: -28, rotationX: -10, rotationY: 8 ,  }, // 클래스룸 ppt
	{ x: -18.5, y: 6, z: -28, rotationX: -10, rotationY: 8 ,  }, // 클래스룸 감자
	{ x: 86, y: 8, z: 73, rotationX: -10, rotationY: 8 ,  },  // 베이커리 오븐
  ];
  
  const arrows = arrowPositions.map(pos => {
	const arrowClone = arrow.clone(); // arrow 복제
	arrowClone.position.set(pos.x, pos.y, pos.z); // y 기본값 설정
	arrowClone.rotation.set(
	  THREE.MathUtils.degToRad(pos.rotationX),
	  THREE.MathUtils.degToRad(pos.rotationY) ,
	  THREE.MathUtils.degToRad(pos.rotationZ) || 0,
	);
	scene.add(arrowClone);
	arrowClone.visible = false; // 기본은 숨겨진 상태
	return arrowClone;
  });

  function hideAllArrows() {
    arrows.forEach(arrow => (arrow.visible = false));
}

function showArrowAt(index) {
if (index < arrows.length) {
//   arrows.forEach(arrow => (arrow.visible = false)); // 다른 화살표 숨기기
// hideAllArrows()
setTimeout(() => {
	arrows[index].visible = true; // 이후 지정된 화살표 보이기
}, 200); // 200ms 지연으로 부드러운 전환
}
}

function animateArrows(elapsedTime) {
arrows.forEach(arrow => {
	if (arrow.visible) {
	// Y 좌표를 부드럽게 오르락내리락
	arrow.position.y = arrow.originalY + Math.sin(elapsedTime * 3) * 0.5;
	}
});
}
  
// 원래 y 좌표를 기록
arrows.forEach(arrow => {
arrow.originalY = arrow.position.y ;
});



// 꽃과 나무
const tulipTexture = textureLoader.load('images/tulip.png');
const wildFlowersOrangeTexture = textureLoader.load('images/wild_flowers_orange.png');
const treeTexture = textureLoader.load('images/tree.png');

// ✅ sRGB 색 공간 설정
[tulipTexture, wildFlowersOrangeTexture, treeTexture].forEach(texture => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
});

// 📌 2. Mesh를 생성하는 함수
function createBillboard(texture, x, y, z, scale = 1, rotationY = 0) {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.5,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.position.set(x, y, z);
    mesh.scale.set(scale, scale, scale);
    mesh.rotation.y = THREE.MathUtils.degToRad(rotationY);

    scene.add(mesh);
    return mesh;
}

// 🌼🌳 3. 꽃과 나무를 여러 개 배치
const flowers = [
    createBillboard(wildFlowersOrangeTexture, -75, 1.1, -35, 3), // 카페
    createBillboard(tulipTexture, -68, 1.1, -40, 3.5),
	createBillboard(tulipTexture, -80, 1.1, -43, 2.5),
    createBillboard(wildFlowersOrangeTexture, -69, 1.3, -47, 2.5), 

    createBillboard(wildFlowersOrangeTexture, 39, 1.6, 59, 5),   
	createBillboard(wildFlowersOrangeTexture, 53, 1.5, 55, 4),   
	createBillboard(tulipTexture, 51, 1.5, 59, 5),   
];

const trees = [
    createBillboard(treeTexture, -79, 2, -45, 5, 10), // 카페
    createBillboard(treeTexture, -71, 3, -49, 7, 10), 
    createBillboard(treeTexture, 36, 4, 52, 7, 10),   // 알바몽
    createBillboard(treeTexture, 53, 5, 52, 10, 10),   

	createBillboard(treeTexture, 108, 2, 124, 5, 10),   // 과제 제출
	createBillboard(treeTexture, 113, 2, 127, 3, 10),   // 과제 제출
];






// -----------------------------------

// #S1 - 지하철 타고 등교하는 대감이

// 지하철 전등
const metroLight = new THREE.PointLight('white', 50, 200, 1.5); // 색, 강도, 거리, 감쇠율
metroLight.position.set(-52, 15, -82)
const metroLightHelper = new THREE.PointLightHelper(metroLight);
metroLight.castShadow = true;
metroLight.shadow.camera.left = -1;
metroLight.shadow.camera.right = 1;
metroLight.shadow.camera.top = 1;
metroLight.shadow.camera.bottom = -1;
metroLight.shadow.mapSize.width = 1024; // 기본값 = 512
metroLight.shadow.mapSize.height = 1024;
metroLight.shadow.camera.near = 1;
metroLight.shadow.camera.far = 5;


const metro = new Metro({
	scene,
	meshes,
	gltfLoader,
	scaleX: 0.8,
	scaleY: 0.8, 
	scaleZ: 0.8, 
	modelSrc: './models/Metro.glb',
	x: -52,
	y: -12,
	z: -82,
	rotationY: THREE.MathUtils.degToRad(-50),
})
metro.loadModel()

const metroSpotMesh = new THREE.Mesh(
	new THREE.PlaneGeometry(3, 3),
	new THREE.MeshStandardMaterial({
		color: 'green',
		transparent: true,
		opacity: 0.5
	})
);
metroSpotMesh.position.set(-52, 0.005, -82);
metroSpotMesh.rotation.x = THREE.MathUtils.degToRad(-90)
metroSpotMesh.receiveShadow = true;
scene.add(metroSpotMesh);

let metroLoaded = false; // ✅ 모델 로드 중복 방지
let metroFinish = false;
let metroCamera = false;
let metroFinished = false;

// 🚈 지하철 등교 인터랙션 함수
function handleMetroInteraction() {
	// 플레이어가 텅장 스팟 매쉬에 도착했을 때 실행
	 if (
	   Math.abs(metroSpotMesh.position.x - player.modelMesh.position.x) < 1.5 &&
	   Math.abs(metroSpotMesh.position.z - player.modelMesh.position.z) < 1.5
	 ) {
		player.moving = false;
        emotion.visible = false;
		scene.remove(metroSpotMesh)
        isPressed = false;
  
        disableMouseEvents();			
		
		disappearPlayer() // Player 사라지기
		
		downCameraY() // 카메라 각도 변환

		metroLoaded = true

		if (metroLoaded) { 		

			setTimeout(() => {
				metroCamera = true;
			}, 2000)

			moveModelYPosition(metro, 1.95);

			setTimeout(() => {
				metro.playAllAnimations();
				scene.add(metroLight)

				gsap.to(camera3.position, {
					duration: 12,
					x: -32,
					y: 10,
					z: -57,
					onUpdate: () => {
						camera3.lookAt(-52, 1, -82); // ✅ 카메라가 이동하면서 계속 lookAt 유지
					},
				})

			}, 1500)
			
			setTimeout(() => {
				metroFinish = true;
				restorePlayerAfterMetro(); // ✅ 바로 실행되도록 보장
			}, 10000);
		}
	 }
}


// 🎬 지하철 등교 완료 인터랙션
function restorePlayerAfterMetro() {
	if (metroFinish) {	
		
		metroCamera = false
		
		setTimeout(() => {
			// ✅ 플레이어 다시 등장

			setTimeout(() => {
				player.modelMesh.position.set(-36, 2, -79);
				player.modelMesh.scaleX = 0.3
				player.modelMesh.scaleY = 0.3
				player.modelMesh.scaleZ = 0.3

				// ✅ 강제 이동 방지를 위해 destinationPoint 초기화
				destinationPoint.x = -27.6;
				destinationPoint.z = -62.4;

				gsap.to(player.modelMesh.scale, {
					duration: 1.5,
					x: 0.8,
					y: 0.8,
					z: 0.8,
					ease: 'expo.easeOut',
				});
	
				gsap.to(player.modelMesh.position, {
					duration: 0.5,
					y: 0.3,
					ease: 'expo.easeOut',
				});
				returnCameraY() 

				emotion.visible = true;

			// ✅ 이동을 즉시 시작하지 않도록 설정
			player.moving = true;
			player.modelMesh.lookAt(destinationPoint); 
			player.modelMesh.rotation.y += Math.PI; // 180도 회전 추가 (필요하면 조정)
			enableMouseEvents();
			}, 3000) 
		}, 4000)


		setTimeout(() => {
			metroFinished = true
		}, 10000)
    }

}
  



// -----------------------------------

// #S2 - 커피 픽업하는 대감이

const cafe = new CafeGamza({
	scene,
	meshes,
	gltfLoader,
	scaleX: 1.5,
	scaleY: 1.5, 
	scaleZ: 1.5, 
	modelSrc: './models/CoffeeShop.glb',
	x: -72,
	y: -10,
	z: -39,
	rotationY: THREE.MathUtils.degToRad(-50)
})
cafe.loadModel()


const cafeSpotMesh = new THREE.Mesh(
	new THREE.PlaneGeometry(3, 3),
	new THREE.MeshStandardMaterial({
		color: 'yellow',
		transparent: true,
		opacity: 0.5
	})
);
cafeSpotMesh.position.set(-71, 0.005, -37);
cafeSpotMesh.rotation.x = THREE.MathUtils.degToRad(-90)
cafeSpotMesh.receiveShadow = true;
scene.add(cafeSpotMesh);

// 커피 감자
const cafegamza = new CafeGamza({
	scene,
	meshes,
	gltfLoader,
	scaleX: 1.5,
	scaleY: 1.5, 
	scaleZ: 1.5, 
	modelSrc: './models/Gamza_Coffee.glb',
	x: -71.7,
	y: -10,
	z: -38.7,
	rotationY: THREE.MathUtils.degToRad(-20)
})
cafegamza.loadModel()

// 대감이가 마시는 커피
const coffee = new Coffee ({
	scene,
	meshes,
	gltfLoader,
	scaleX: 1.5,
	scaleY: 1.5, 
	scaleZ: 1.5, 
	modelSrc: './models/Coffee.glb',
	x: -71.7,
	y: 0,
	z: -38.7,
	rotationY: THREE.MathUtils.degToRad(-50)
})


const giveCoffeeTexture = new THREE.TextureLoader().load('images/coffee.png')
const giveCoffeePlaneGeometry = new THREE.PlaneGeometry(3, 3);
const giveCoffeeMaterial = new THREE.MeshBasicMaterial({
	map: giveCoffeeTexture,
	transparent: true, // PNG의 투명도 반영
	alphaTest: 0.5 // 알파 값 기준
});
giveCoffeeTexture.colorSpace = THREE.SRGBColorSpace; // sRGB 색 공간 설정
giveCoffeeTexture.needsUpdate = true;
const giveCoffee = new THREE.Mesh(giveCoffeePlaneGeometry, giveCoffeeMaterial);
giveCoffee.castShadow = true; 
giveCoffee.position.x = -68
giveCoffee.position.z = -38
giveCoffee.position.y = 5


let coffeeLoaded = false; // ✅ 모델 로드 중복 방지
let coffeeFinished = false;

// 🧋 카페 인터랙션 함수
function handleCoffeeInteraction() {
	// 플레이어가 텅장 스팟 매쉬에 도착했을 때 실행
	 if (
	   Math.abs(cafeSpotMesh.position.x - player.modelMesh.position.x) < 1.5 &&
	   Math.abs(cafeSpotMesh.position.z - player.modelMesh.position.z) < 1.5
	 ) {
		player.moving = false;
        emotion.visible = false;
		scene.remove(cafeSpotMesh)
      
        // bakerySpotMesh.visible = false;
        isPressed = false;
  
        disableMouseEvents();
					
		// Player 사라지기
		disappearPlayer()

		// 카메라 각도 변환
		downCameraY()

		coffeeLoaded = true

		if (coffeeLoaded) { 

			coffee.loadModel()
			moveModelYPosition(cafegamza, 0);
		
			moveModelYPosition(cafe, 0);
			cafe.actions[1].play()
			cafegamza.actions[4].play()

			setTimeout(() => {
				scene.add(giveCoffee)
			}, 1000)

			setTimeout(() => {
				scene.remove(giveCoffee)
				cafe.actions[1].stop()
				cafe.actions[2].play() // 커피 만들어 줌
				coffee.loadModel()
				coffee.actions[0].play()
			}, 2000)

			setTimeout(() => {
				coffee.modelMesh.position.set(-72.6, 0, -40)
				coffee.actions[0].stop()
				coffee.actions[1].play()
				cafegamza.actions[3].play() 
				cafegamza.actions[5].play()
			}, 6000)

			setTimeout(() => {
				cafe.actions[2].stop()
				cafe.actions[3].play() 
				cafe.actions[7].play()
				setTimeout(() => {
					coffee.modelMesh.visible = false
				}, 6000)
			}, 6800)

			setTimeout(() => {
				coffeeFinished = true;
				restorePlayerAfterCoffee(); // ✅ 바로 실행되도록 보장
			}, 12000);
		}
	 }
}
// 🎬 카페 완료 인터랙션
function restorePlayerAfterCoffee() {
	if (coffeeFinished) {
		setTimeout(()=>{
			gsap.to(cafegamza.modelMesh.position, {
				duration: 0.4,
				y: 1,
				ease: 'expo.easeOut',
			});
			gsap.to(cafegamza.modelMesh.scale, {
				duration: 0.3,
				x: 0,
				y: 0,
				z: 0,
				ease: 'none',
			});
		}, 1000)

		setTimeout(()=>{
			   // 카메라 각도 변환
				returnCameraY()
		}, 2000)

		setTimeout(()=>{
			// ✅ 플레이어 다시 등장
			appearPlayer()

			player.modelMesh.position.set(-64.5, 0.3, -34.5);
			emotion.visible = true;
		
			// ✅ 강제 이동 방지를 위해 destinationPoint 초기화
			destinationPoint.x = -53;
			destinationPoint.z = -22;
			console.log(destinationPoint.x , destinationPoint.z)

			// ✅ 이동을 즉시 시작하지 않도록 설정
			player.moving = true;
			player.modelMesh.lookAt(destinationPoint); 
			player.modelMesh.rotation.y += Math.PI; // 180도 회전 추가 (필요하면 조정)
			camera.lookAt(player.modelMesh.position);
			enableMouseEvents();

		}, 3000)

	
    }
}





// #S3 - 강의실에서 발표하는 대감이

// 감자 발표 말풍선
const talkTextures = [
    'images/talk1.png',
    'images/talk2.png',
    'images/talk3.png',
	'images/talk4.png',
];

const talkPlanes = [];
let talkBubbleInterval;

// 말풍선 생성
const talkPlaneGeometry = new THREE.PlaneGeometry(2, 2);
const loader = new THREE.TextureLoader();

talkTextures.forEach((texturePath, index) => {
    const texture = loader.load(texturePath);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.5,
    });
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;

    const talkMesh = new THREE.Mesh(talkPlaneGeometry, material);
    talkMesh.position.set(-17, 6, -26);
    talkMesh.rotation.set(
        THREE.MathUtils.degToRad(-10),
        THREE.MathUtils.degToRad(8),
        0
    );
    talkMesh.visible = false;

    talkPlanes.push(talkMesh);
    scene.add(talkMesh);
});
// 감자 발표 말풍선 재생 함수 💬
function animateTalkBubbles() {
    let currentIndex = 0;
    talkBubbleInterval = setInterval(() => {
        talkPlanes.forEach((talk, index) => {
            talk.visible = index === currentIndex;
        });
        currentIndex = (currentIndex + 1) % talkPlanes.length;
    }, 500); // 0.5초 간격으로 애니메이션 변경
	
}
// 감자 발표 말풍선 멈춤 함수 💬⛔️
function stopTalkBubbles() {
    clearInterval(talkBubbleInterval);
    talkPlanes.forEach(talk => talk.visible = false);
}

// 💬 감자라서 죄송합니다..
const sorryTexture = new THREE.TextureLoader().load('images/sorry.png')
const sorryPlaneGeometry = new THREE.PlaneGeometry(3.2, 0.7);
const sorryMaterial = new THREE.MeshBasicMaterial({
	map: sorryTexture,
	transparent: true, // PNG의 투명도 반영
	alphaTest: 0.5 // 알파 값 기준
});
sorryTexture.colorSpace = THREE.SRGBColorSpace; // sRGB 색 공간 설정
sorryTexture.needsUpdate = true;
const sorry = new THREE.Mesh(sorryPlaneGeometry, sorryMaterial);
sorry.castShadow = true; 
sorry.position.x = -16.5
sorry.position.z = -25
sorry.position.y = 2
// sorry.scale.set(5, 1, 11)
sorry.rotation.x = THREE.MathUtils.degToRad(0)
// dolgamza.rotation.z = THREE.MathUtils.radToDeg(90)



// 강의실 스팟 메쉬
const classroomSpotMesh = new THREE.Mesh(
	new THREE.PlaneGeometry(3, 3),
	new THREE.MeshStandardMaterial({
		color: 'skyblue',
		transparent: true,
		opacity: 0.5
	})
);
classroomSpotMesh.position.set(-25, 0.005, -30);
classroomSpotMesh.rotation.x = THREE.MathUtils.degToRad(-90)
classroomSpotMesh.receiveShadow = true;
scene.add(classroomSpotMesh);

//강의실 햇빛
const classroomSunLight = new THREE.RectAreaLight('#FFF8DA', 3, 12, 4)
classroomSunLight.position.set(-38, 5, -35)  
classroomSunLight.rotation.y = THREE.MathUtils.degToRad(-90)
// classroomSunLight.target.position.set(50, 0.3, 20);
const sunlightHelper = new RectAreaLightHelper(classroomSunLight);

// 강의실 전등
const classroomLight = new THREE.PointLight('white', 20, 30, 1.5); 
classroomLight.position.set(-25, 10, -38)
const lightHelper = new THREE.PointLightHelper(classroomLight);
// scene.add(lightHelper)
// 강의실 전등 그림자 설정
classroomLight.castShadow = true;
classroomLight.shadow.camera.left = -1;
classroomLight.shadow.camera.right = 1;
classroomLight.shadow.camera.top = 1;
classroomLight.shadow.camera.bottom = -1;
classroomLight.shadow.mapSize.width = 1024; // 기본값 = 512
classroomLight.shadow.mapSize.height = 1024;
classroomLight.shadow.camera.near = 1;
classroomLight.shadow.camera.far = 5;

// 강의실 전등
const classroomLight2 = new THREE.DirectionalLight('white', 0.5); 
classroomLight2.position.set(-26, 5, -31) 
classroomLight2.rotation.y = THREE.MathUtils.degToRad(70)
classroomLight2.target.position.set(-28, 2, -34)
const lightHelper2 = new THREE.DirectionalLightHelper(classroomLight2);
// scene.add(lightHelper2)

// 강의실 전등 그림자 설정
classroomLight2.castShadow = true;
classroomLight2.shadow.camera.left = -1;
classroomLight2.shadow.camera.right = 1;
classroomLight2.shadow.camera.top = 1;
classroomLight2.shadow.camera.bottom = -1;
classroomLight2.shadow.mapSize.width = 1024; // 기본값 = 512
classroomLight2.shadow.mapSize.height = 1024;
classroomLight2.shadow.camera.near = 1;
classroomLight2.shadow.camera.far = 5;



// ppt화면
const planeGeometry = new THREE.PlaneGeometry(9.6, 5.4);
const presentations = [];
const texturePaths = [
  'images/ppt1.png',
  'images/ppt2.png',
  'images/ppt3.png',
  'images/ppt4.png',
  'images/ppt5.png',
];


function createSlide(texturePath, index) {
  if (presentations.length >= texturePaths.length) return;
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0, // 초기 로딩 전 텍스처 보이지 않음
  });

  const slide = new THREE.Mesh(planeGeometry, material);
  slide.rotation.y = THREE.MathUtils.degToRad(-32)
  slide.position.set(-22.3, 4.8, -31.9);
  slide.scale.set(1.13, 1.1, 1.21);
  slide.name = `ppt${index + 1}`;
  slide.visible = false; // 초기에는 보이지 않음

  // Lazy loading 텍스처 적용
  loader.load(texturePath, (texture) => {
    material.map = texture;
    material.opacity = 1;
    material.needsUpdate = true;
  });

  presentations.push(slide);

  scene.add(slide);
}




let classroomgamzaMeshes = []

// 🥔 강의실 감자
const classroomgamza = new ClassroomGamza({
	scene,
	meshes,
	gltfLoader,
	modelSrc: './models/Gamza_Classroom.glb',  
	x: -18.5,
	y: -10,
	z: -26.5,
	scaleX: 0.8,
	scaleY: 0.8, 
	scaleZ: 0.8, 
	rotationY: THREE.MathUtils.degToRad(180),
	// visible: false,
	onLoad: (modelMesh) => {
		// modelMesh에 name 설정하여 raycaster가 인식할 수 있도록
		modelMesh.name = 'classroomgamza';
		classroomgamzaMeshes.push(modelMesh)
	},
});


// 🧅 양파교수
const onion = new Onion({
	scene,
	meshes,
	gltfLoader,
	scaleX: 0.75,
	scaleY: 0.75, 
	scaleZ: 0.75, 
	modelSrc: './models/s4_onion.glb',
	// rotationY: Math.PI/2,
	x: -28,
	y: -8,
	z: -34,
	rotationY: THREE.MathUtils.degToRad(45),
	// visible: false,
});


const classmate = new Classmate({
	scene,
	meshes,
	gltfLoader,
	scaleX: 1.5,
	scaleY: 1.5, 
	scaleZ: 1.5, 
	modelSrc: './models/classmate3.glb',
	// rotationY: Math.PI/2,
	x: -10, 
	y: -9, 
	z: -20.5,
	rotationY: THREE.MathUtils.degToRad(60),
	// visible: false,
});

// 모든 클래스메이트 모델 로드
classmate.loadModel()


const modelsToLoad = [classroomgamza, onion];
// ✅ 모든 모델이 로드될 때까지 기다림
Promise.all(modelsToLoad.map(model => model.loadModel()))
.catch(error => {
	console.error("❌ [Main Thread] 모델 로딩 중 오류 발생:", error);
});


let classroomEntered = false; // ✅ 애니메이션 실행 중복 방지


// 🧑‍🏫 강의실 인터랙션 🧑‍🏫
function handleClassroomInteraction() {

    // 플레이어가 강의실 입구에 도착했을 때 실행
    if (
      Math.abs(classroomSpotMesh.position.x - player.modelMesh.position.x) < 1.5 &&
      Math.abs(classroomSpotMesh.position.z - player.modelMesh.position.z) < 1.5
    ) {
      if (!classroom.visible) {
        classroomSpotMesh.material.color.set('seagreen');

        player.moving = false;
        emotion.visible = false;
  
   
		// Player 사라지기
		disappearPlayer()

		setTimeout(() => {
			// 카메라 각도 변환
			downCameraY()
		}, 100);
	
		scene.remove(classroomSpotMesh)


        // classroomSpotMesh.visible = false;
        isPressed = false;
  
        disableMouseEvents();

		if (!classroomEntered) { // ✅ 애니메이션 중복 실행 방지

				moveModelYPosition(classroom, 0.05)
				moveModelYPosition(onion, 0.8 )
				moveModelYPosition(classroomgamza, 2)
				moveModelYPosition(classmate, 0)

				setTimeout(() => {
						scene.add(classroomLight,  classroomSunLight, classroomLight2);
						showArrowAt(0); // 첫 번째 화살표 보이기
						// classroomgamza.actions[2].play(); 
						classroomgamza.actions[3].play(); // 눈 깜박이기
						enableSlideInteractions(); // 모든 모델 로드 후 실행
				}, 100);
				
				classroomEntered = true;
			}

            // ✅ 강의실 인터랙션이 끝났다면 플레이어 복원
            if (presentationFinished) {
                console.log("🔥 강의실 인터랙션이 종료됨! 플레이어 복원 실행");
                restorePlayerAfterClass()
            }
    }
  }
}

// 🎬 강의실씬 완료 인터랙션
function restorePlayerAfterClass() {
    if (presentationFinished) {
        console.log("✅ 강의실 인터랙션 종료! 플레이어 다시 등장 로직 실행");
		console.log(classroomgamza)
		setTimeout(()=>{
			gsap.to(classroomgamza.modelMesh.position, {
				duration: 0.4,
				x: -20,
				y: 1,
				z: -32.5,
				ease: 'expo.easeOut',
			});
			gsap.to(classroomgamza.modelMesh.scale, {
				duration: 0.3,
				x: 0,
				y: 0,
				z: 0,
				ease: 'none',
			});
		}, 1000)

		setTimeout(()=>{
			   // 카메라 각도 변환
			   returnCameraY()
		}, 2000)

		setTimeout(()=>{

			appearPlayer()

			player.modelMesh.position.set(-25, 0.3, -10);
			emotion.visible = true;
		
			console.log("✅ 플레이어 위치 설정:", player.modelMesh.position);

			// ✅ 강제 이동 방지를 위해 destinationPoint 초기화
			destinationPoint.x = -21;
			destinationPoint.z = 9;

			// ✅ 이동을 즉시 시작하지 않도록 설정
			player.moving = true;
			player.modelMesh.lookAt(destinationPoint); 
			player.modelMesh.rotation.y += Math.PI; // 180도 회전 추가 (필요하면 조정)
			camera.lookAt(player.modelMesh.position);
	
		}, 3000)

		setTimeout(()=>{
		// ✅ 마우스 이벤트 다시 활성화
		enableMouseEvents();
		console.log("✅ 마우스 이벤트 활성화 완료");
		}, 1000)
    }
}


// #S4 - 텅장

// 💸 텅장 스팟 메쉬
const noMeneySpotMesh = new THREE.Mesh(
	new THREE.PlaneGeometry(3, 3),
	new THREE.MeshStandardMaterial({
		color: 'red',
		transparent: true,
		opacity: 0.5
	})
);

noMeneySpotMesh.position.set(11, 0.005, 35);
noMeneySpotMesh.rotation.x = THREE.MathUtils.degToRad(-90)
noMeneySpotMesh.receiveShadow = true;
scene.add(noMeneySpotMesh);


// 텅장 텍스트
const noMoneyTexture = new THREE.TextureLoader().load('images/nomoney.png')
const noMoneyPlaneGeometry = new THREE.PlaneGeometry(1, 1);
const noMoneyMaterial = new THREE.MeshBasicMaterial({
	map: noMoneyTexture,
	transparent: true, // PNG의 투명도 반영
	alphaTest: 0.5 // 알파 값 기준
});
noMoneyTexture.colorSpace = THREE.SRGBColorSpace; // sRGB 색 공간 설정
noMoneyTexture.needsUpdate = true;
const noMoneyText = new THREE.Mesh(noMoneyPlaneGeometry, noMoneyMaterial);
noMoneyText.castShadow = true; 
noMoneyText.position.x = 10.8
noMoneyText.position.y = 1.3
noMoneyText.position.z = 36.5


// 💸 텅장 감자
const nomoneygamza = new NomoneyGamza({
	scene,
	meshes,
	gltfLoader,
	modelSrc: './models/Gamza_Nomoney.glb',  
	scaleX: 1.5,
	scaleY: 1.5, 
	scaleZ: 1.5, 
	x: 11,
	y: -10,
	z: 35,
	rotationY: THREE.MathUtils.degToRad(-70),
	// visible: false,
});
nomoneygamza.loadModel()

// 💸 텅장
const bankbook = new Bankbook({
	scene,
	meshes,
	gltfLoader,
	modelSrc: './models/NomoneyBank.glb',  
	scaleX: 1.5,
	scaleY: 1.5, 
	scaleZ: 1.5, 
	x: 11,
	y: -10,
	z: 35.3,
	rotationY: THREE.MathUtils.degToRad(-60),
})
bankbook.loadModel()

// 말풍선
const nomoneyTexture = new THREE.TextureLoader().load('images/talk5.png')
const nomoneyPlaneGeometry = new THREE.PlaneGeometry(2, 2);
const nomoneyMaterial = new THREE.MeshBasicMaterial({
	map: nomoneyTexture,
	transparent: true, // PNG의 투명도 반영
	alphaTest: 0.5 // 알파 값 기준
});
nomoneyTexture.colorSpace = THREE.SRGBColorSpace; // sRGB 색 공간 설정
nomoneyTexture.needsUpdate = true;
const nomoney = new THREE.Mesh(nomoneyPlaneGeometry, nomoneyMaterial);
nomoney.castShadow = true; 
nomoney.position.x = 14
nomoney.position.z = 35
nomoney.position.y = 3.5


// 하늘에 이펙트 gif
function showGIFOverlay2() {
    const gifOverlay2 = document.getElementById("gifOverlay2");
    gifOverlay2.style.display = "flex"; // GIF 표시

    // 3초 후 자동으로 숨김
    setTimeout(() => {
        hideGIFOverlay2();
    }, 3000);
}

function hideGIFOverlay2() {
    const gifOverlay2 = document.getElementById("gifOverlay2");
    gifOverlay2.style.display = "none"; // GIF 숨김
}




let bankLoaded = false; // ✅ 모델 로드 중복 방지
let bankFinished = false;

// 💸 텅장 인터랙션 함수
function handleNomoneyInteraction() {

	// 플레이어가 텅장 스팟 매쉬에 도착했을 때 실행
	 if (
	   Math.abs(noMeneySpotMesh.position.x - player.modelMesh.position.x) < 1.5 &&
	   Math.abs(noMeneySpotMesh.position.z - player.modelMesh.position.z) < 1.5
	 ) {
		player.moving = false;
        emotion.visible = false;
		scene.remove(noMeneySpotMesh)
      
        // bakerySpotMesh.visible = false;
        isPressed = false;
  
        disableMouseEvents();
					
		// Player 사라지기
		disappearPlayer()

		// 카메라 각도 변환
		downCameraY()

		gsap.to(camera, {
			duration: 0.5,   // ✅ 3초 동안 애니메이션
			zoom: 0.15,    // ✅ 목표 zoom 값
			ease: "power2.out", // ✅ 부드러운 감속 애니메이션
			onUpdate: () => {
				camera.updateProjectionMatrix(); // ✅ 변경 사항 반영
			}
		});
		

		bankLoaded = true

		if (bankLoaded) { 
			moveModelYPosition(nomoneygamza, 0);
			moveModelYPosition(bankbook, 0);

			nomoneygamza.actions[2].play()
			nomoneygamza.actions[2].setEffectiveTimeScale(0.6); 
			nomoneygamza.actions[5].play()
			bankbook.actions[1].play()
			scene.add(noMoneyText)
			noMoneyText.visible = false
			setTimeout(() => {
				noMoneyText.visible = true
			}, 4000)
	
			setTimeout(() => {
				gsap.to(noMoneyText.scale, {
					duration: 2,
					x: 4,
					y: 4,
					z: 4,
					ease: 'bounce.out'
				})
				gsap.to(noMoneyText.position, {
					duration: 2,
					x: 7,
					y: 5,
					ease: 'bounce.out'
				})
			} , 4500)
			
			setTimeout(() => {	
				scene.add(nomoney)
				showGIFOverlay2()
			}, 6500)
			
			setTimeout(() => {
				bankFinished = true;
				restorePlayerAfterNomoney(); // ✅ 바로 실행되도록 보장
			}, 10000);
		}
	 }
}
// 💸 텅장 완료 함수
function restorePlayerAfterNomoney() {
	if (bankFinished) {
        console.log("✅ 텅장 인터랙션 종료! 플레이어 다시 등장 로직 실행");
		setTimeout(()=>{
			gsap.to(nomoneygamza.modelMesh.position, {
				duration: 0.4,
				y: 1,
				ease: 'expo.easeOut',
			});
			gsap.to(nomoneygamza.modelMesh.scale, {
				duration: 0.3,
				x: 0,
				y: 0,
				z: 0,
				ease: 'none',
			});
			bankbook.modelMesh.visible = false
			scene.remove(nomoneygamza)
			scene.remove(bankbook)
			scene.remove(nomoney)
			noMoneyText.visible = false
		}, 1000)

		setTimeout(()=>{
			   // 카메라 각도 변환
			   gsap.to(camera, {
				duration: 0.3,   // ✅ 3초 동안 애니메이션
				zoom: 0.075,    // ✅ 목표 zoom 값
				ease: "power2.out", // ✅ 부드러운 감속 애니메이션
				onUpdate: () => {
					camera.updateProjectionMatrix(); // ✅ 변경 사항 반영
				}
			});
				returnCameraY()
		}, 2000)

		setTimeout(()=>{
			// ✅ 플레이어 다시 등장
			appearPlayer()

			player.modelMesh.position.set(12, 0.3, 40);
			emotion.visible = true;
		
			// ✅ 강제 이동 방지를 위해 destinationPoint 초기화
			destinationPoint.x = 16;
			destinationPoint.z = 62;
			console.log(destinationPoint.x , destinationPoint.z)

			// ✅ 이동을 즉시 시작하지 않도록 설정
			player.moving = true;
			player.modelMesh.lookAt(destinationPoint); 
			player.modelMesh.rotation.y += Math.PI; // 180도 회전 추가 (필요하면 조정)
			camera.lookAt(player.modelMesh.position);
	
		}, 3000)

		setTimeout(()=>{
		// ✅ 마우스 이벤트 다시 활성화
		enableMouseEvents();
		console.log("✅ 마우스 이벤트 활성화 완료");
		}, 1000)
    }
}




// #S5 - 알바몽 알바 찾기



const albaSpotMesh = new THREE.Mesh(
	new THREE.PlaneGeometry(3, 3),
	new THREE.MeshStandardMaterial({
		color: 'orange',
		transparent: true,
		opacity: 0.5
	})
);
albaSpotMesh.position.set(46, 0.005, 60);
albaSpotMesh.rotation.x = THREE.MathUtils.degToRad(-90)
albaSpotMesh.receiveShadow = true;
scene.add(albaSpotMesh);


// 🪧 알바몽 게시판
const albaboard = new MailBox({
	scene,
	meshes,
	gltfLoader,
	modelSrc: './models/NoticeBoard.glb',  
	scaleX: 1.8,
	scaleY: 1.8, 
	scaleZ: 1.5, 
	x: 45,
	y: 7,
	z: 57,
})
albaboard.loadModel()



// 알바 찾기 감자
const albagamza = new AlbaGamza({
	scene,
	meshes,
	gltfLoader,
	modelSrc: './models/Gamza_Board.glb',  
	scaleX: 1.5,
	scaleY: 1.5, 
	scaleZ: 1.5, 
	x: 46,
	y: -10,
	z: 60,
	rotationY: THREE.MathUtils.degToRad(0),
	// visible: false,
});

albagamza.loadModel()


// ✅ Box Mesh 생성
const boardBoxGeometry = new THREE.BoxGeometry(15, 11, 1);

const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

const boardBox = new THREE.Mesh(boardBoxGeometry, material);

// ✅ 위치 설정
boardBox.position.set(43, 6, 52);

boardBox.visible = false



const Texture1 = new THREE.TextureLoader().load('images/hmm.png')
const PlaneGeometry1 = new THREE.PlaneGeometry(2, 2);
const Material1 = new THREE.MeshBasicMaterial({
	map: Texture1,
	transparent: true, // PNG의 투명도 반영
	alphaTest: 0.5 // 알파 값 기준
});
Texture1.colorSpace = THREE.SRGBColorSpace; // sRGB 색 공간 설정
Texture1.needsUpdate = true;
const bakeryBoxTalk = new THREE.Mesh(PlaneGeometry1, Material1);
bakeryBoxTalk.castShadow = true; 
bakeryBoxTalk.position.x = 47
bakeryBoxTalk.position.y = 4
bakeryBoxTalk.position.z = 60
bakeryBoxTalk.visible = false
scene.add(bakeryBoxTalk)



let findAlbaLoaded = false; // ✅ 모델 로드 중복 방지
let findAlbaFinished = false;
let startFindAlba = false

// 🪧 알바 찾기 인터랙션 함수
function handleFindAlbaInteraction() {

	// 플레이어가 알바 찾기 스팟 매쉬에 도착했을 때 실행
	 if (
	   Math.abs(albaSpotMesh.position.x - player.modelMesh.position.x) < 1.5 &&
	   Math.abs(albaSpotMesh.position.z - player.modelMesh.position.z) < 1.5
	 ) {
		player.moving = false;
        emotion.visible = false;
		scene.remove(albaSpotMesh)
		startFindAlba = true

        // bakerySpotMesh.visible = false;
        isPressed = false;
  
        disableMouseEvents();
					
		// Player 사라지기
		disappearPlayer()

		// 카메라 각도 변환
		downCameraY()

		moveModelYPosition(albagamza, 0);

		
		findAlbaLoaded = true

		if (findAlbaLoaded) { 

			albagamza.actions[2].play()
			
			scene.add(boardBox);
		
			setTimeout(() => {
				findAlbaFinished = true;
				boardHover = false
				restorePlayerAfterFindAlba(); // ✅ 바로 실행되도록 보장
			}, 10000);
		}
	 }
}
// 🎬 알바 찾기 완료 인터랙션
function restorePlayerAfterFindAlba() {
	if (findAlbaFinished) {
		setTimeout(() => {
			gsap.to(albagamza.modelMesh.position, {
				duration: 0.4,
				y: 1,
				ease: 'expo.easeOut',
			});
			gsap.to(albagamza.modelMesh.scale, {
				duration: 0.3,
				x: 0,
				y: 0,
				z: 0,
				ease: 'none',
			});
			bakeryBoxTalk.visible = false
			// scene.remove(albagamza)
		}, 1000)

		setTimeout(() => {
			   // 카메라 각도 변환
				returnCameraY()
		}, 3000)

		setTimeout(() => {
			// ✅ 플레이어 다시 등장
			appearPlayer()

			player.modelMesh.position.set(45, 0.3, 63);
			emotion.visible = true;
		
			console.log("✅ 플레이어 위치 설정:", player.modelMesh.position);

			// ✅ 강제 이동 방지를 위해 destinationPoint 초기화
			destinationPoint.x = 49;
			destinationPoint.z = 80;
			console.log(destinationPoint.x , destinationPoint.z)

			// ✅ 이동을 즉시 시작하지 않도록 설정
			player.moving = true;
			player.modelMesh.lookAt(destinationPoint); 
			player.modelMesh.rotation.y += Math.PI; // 180도 회전 추가 (필요하면 조정)
			camera.lookAt(player.modelMesh.position);
			enableMouseEvents();

		}, 5000)

		// setTimeout(()=>{
		// // ✅ 마우스 이벤트 다시 활성화
		// console.log("✅ 마우스 이벤트 활성화 완료");
		// }, 2000)
    }
}





// #S7 - 베이커리

// 베이커리 스팟 메쉬
const bakerySpotMesh = new THREE.Mesh(
	new THREE.PlaneGeometry(3, 3),
	new THREE.MeshStandardMaterial({
		color: 'brown',
		transparent: true,
		opacity: 0.5
	})
);
bakerySpotMesh.position.set(80, 0.005, 70);
bakerySpotMesh.rotation.x = THREE.MathUtils.degToRad(-90)
bakerySpotMesh.receiveShadow = true;
scene.add(bakerySpotMesh);



// 베이커리 햇빛
const bakerySunLight = new THREE.RectAreaLight('white', 2, 8, 5)
bakerySunLight.position.set(74, 5, 76)
bakerySunLight.rotation.y = THREE.MathUtils.degToRad(-115)
// const bakerySunlightHelper = new RectAreaLightHelper(bakerySunLight);

// 베이커리 전등
// const bakeryLight = new THREE.PointLight('white', 1, 200, 1);  // 색, 강도, 거리, 감쇠율
// bakeryLight.position.set(85, 9, 80)
// const bakeryLightHelper = new THREE.PointLightHelper(bakeryLight);
// bakeryLight.castShadow = true;
// bakeryLight.shadow.camera.left = -1;
// bakeryLight.shadow.camera.right = 1;
// bakeryLight.shadow.camera.top = 1;
// bakeryLight.shadow.camera.bottom = -1;
// bakeryLight.shadow.mapSize.width = 1024; // 기본값 = 512
// bakeryLight.shadow.mapSize.height = 1024;
// bakeryLight.shadow.camera.near = 1;
// bakeryLight.shadow.camera.far = 5;

// 베이커리 전등2
const bakeryLight2 = new THREE.PointLight('white', 2.5, 200, 1);  // 색, 강도, 거리, 감쇠율
bakeryLight2.position.set(82, 12, 83)
const bakeryLightHelper2 = new THREE.PointLightHelper(bakeryLight2);
bakeryLight2.castShadow = true;
bakeryLight2.shadow.camera.left = -1;
bakeryLight2.shadow.camera.right = 1;
bakeryLight2.shadow.camera.top = 1;
bakeryLight2.shadow.camera.bottom = -1;
bakeryLight2.shadow.mapSize.width = 1024; // 기본값 = 512
bakeryLight2.shadow.mapSize.height = 1024;
bakeryLight2.shadow.camera.near = 1;
bakeryLight2.shadow.camera.far = 5;

let bakerygamzaMeshes = []

// 베이커리 감자
const bakerygamza = new BakeryGamza({
	scene,
	meshes,
	gltfLoader,
	modelSrc: './models/CafeGamza1.glb',  
	scaleX: 1.5,
	scaleY: 1.5, 
	scaleZ: 1.5, 
	x: 74,
	y: -10,
	z: 75,
	rotationY: THREE.MathUtils.degToRad(60),
	// visible: false,
	onLoad: (modelMesh) => {
		// modelMesh에 name 설정하여 raycaster가 인식할 수 있도록
		modelMesh.name = 'bakerygamza';
		bakerygamzaMeshes.push(modelMesh)
	},
});

// 베이커리 밤
const bam = new Bam({
	scene,
	meshes,
	gltfLoader,
	modelSrc: './models/Bam.glb',  
	scaleX: 1.5,
	scaleY: 1.5, 
	scaleZ: 1.5, 
	x: 74,
	y: -10,
	z: 77,
	rotationY: THREE.MathUtils.degToRad(60),
	// visible: false,
});

// 베이커리 오븐, 도넛, 트레이
const bakeryprops = new BakeryProps({
	scene,
	meshes,
	gltfLoader,
	modelSrc: './models/BakeryProps.glb',  
	scaleX: 1.5,
	scaleY: 1.5, 
	scaleZ: 1.5, 
	x: 74,
	y: -10,
	z: 76,
	rotationY: THREE.MathUtils.degToRad(65),
	// visible: false,
});

bakerygamza.loadModel();
bam.loadModel();
bakeryprops.loadModel();


let bakeryLoaded = false; // ✅ 모델 로드 중복 방지
let bakeryEntered = false; // ✅ 애니메이션 실행 중복 방지
let bakeryFinished = false;

// 🥐 베이커리 인터랙션 함수
function handleBakeryInteraction() {
   // 플레이어가 베이커리 입구에 도착했을 때 실행
    if (
      Math.abs(bakerySpotMesh.position.x - player.modelMesh.position.x) < 1.5 &&
      Math.abs(bakerySpotMesh.position.z - player.modelMesh.position.z) < 1.5
    ) {
    //   if (!bakery.visible) {

        player.moving = false;
        emotion.visible = false;
        bakerySpotMesh.visible = false;
		scene.remove(bakerySpotMesh)
        isPressed = false;
  
        disableMouseEvents();
					
		// Player 사라지기
		disappearPlayer()

		// 카메라 각도 변환
		downCameraY()

		bakeryLoaded = true

				moveModelYPosition(bakery, -1);
				moveModelYPosition(bakerygamza, -1);
				moveModelYPosition(bakeryprops, -1);
				moveModelYPosition(bam, -1);
		if (bakeryLoaded) { // ✅ 애니메이션 중복 실행 방지
	
			
				// bakeryEntered = true;
				
				// // 특정 애니메이션 실행
				// if (bakeryEntered) {

					let ovenStart = false
	
					if (!ovenStart) {
						bakerygamza.playAnimation('Anim1'); // Anim1 애니메이션 실행

						bakeryprops.playAnimation('Oven0')
						bakeryprops.playAnimation('DonutTrayAnim1')
						bakeryprops.playAnimation('DonutRAnim1')
						bakeryprops.playAnimation('DonutLAnim1')
	
						bam.playAnimation('BbAnim1')
						bam.playAnimation('BaAnim1')

						ovenStart = true
					}

			
					if(ovenStart) { 
						enableOvenInteractions()

						setTimeout(()=>{
							doneOvenOpen()
						}, 19000)
					}
				}

		
			setTimeout(() => {
				scene.add( bakeryLight2, )
					// showArrowAt(0); // 첫 번째 화살표 보이기
			}, 400);



			setTimeout(() => {
				bakeryFinished = true;
				restorePlayerAfterBakery(); // ✅ 바로 실행되도록 보장
			}, 30000);
			
		}
	}
// }
// }
// 🎬 베이커리씬 완료 인터랙션
function restorePlayerAfterBakery() {
    if (bakeryFinished) {
		setTimeout(() => {
			gsap.to(bakerygamza.modelMesh.position, {
				duration: 0.4,
				y: 1,
				ease: 'expo.easeOut',
			});
			gsap.to(bakerygamza.modelMesh.scale, {
				duration: 0.3,
				x: 0,
				y: 0,
				z: 0,
				ease: 'none',
			});
		}, 1000)

		setTimeout(() => {
			   // 카메라 각도 변환
				returnCameraY()

		}, 2000)

		setTimeout(() => {
			// ✅ 플레이어 다시 등장
			appearPlayer()

			player.modelMesh.position.set(84, 0.3, 93);
			emotion.visible = true;
			// ✅ 강제 이동 방지를 위해 destinationPoint 초기화
			destinationPoint.x = 87;
			destinationPoint.z = 117;

			// ✅ 이동을 즉시 시작하지 않도록 설정
			player.moving = true;
			player.modelMesh.lookAt(destinationPoint); 
			player.modelMesh.rotation.y += Math.PI; // 180도 회전 추가 (필요하면 조정)
			camera.lookAt(player.modelMesh.position);
	
		}, 3000)

		setTimeout(() => {
		// ✅ 마우스 이벤트 다시 활성화
		enableMouseEvents();
		}, 1000)
    }
}




// #S9 - 과제 제출

let mailLoaded = false; // ✅ 모델 로드 중복 방지
let mailFinished = false;

let mailgamzaMeshes = []

// 메일 감자
const mailgamza = new MailGamza({
	scene,
	meshes,
	gltfLoader,
	modelSrc: './models/Gamza_Post.glb',  
	scaleX: 1.5,
	scaleY: 1.5, 
	scaleZ: 1.5, 
	x: 109,
	y: -5,
	z: 129.7,
	rotationY: THREE.MathUtils.degToRad(20),
	// visible: false,
	onLoad: (modelMesh) => {
		// modelMesh에 name 설정하여 raycaster가 인식할 수 있도록
		modelMesh.name = 'mailgamza';
		mailgamzaMeshes.push(modelMesh)
	},
});

// 메일함
const mailbox = new MailBox({
	scene,
	meshes,
	gltfLoader,
	scaleX: 1.5,
	scaleY: 1.5, 
	scaleZ: 1.5, 
	modelSrc: './models/MailBox.glb',
	x: 111,
	y: 0,
	z: 128.5,
	rotationY: THREE.MathUtils.degToRad(40)
});

const file = new File({
	scene,
	meshes,
	gltfLoader,
	modelSrc: './models/File.glb',  
	scaleX: 1.5,
	scaleY: 1.5, 
	scaleZ: 1.5, 
	x: 109,
	y: 0,
	z: 129.7,
	rotationY: THREE.MathUtils.degToRad(20),
	// visible: false,
});


mailgamza.loadModel()
mailbox.loadModel()



// 메일 스팟 메쉬
const mailSpotMesh = new THREE.Mesh(
	new THREE.PlaneGeometry(3, 3),
	new THREE.MeshStandardMaterial({
		color: 'royalblue',
		transparent: true,
		opacity: 0.5
	})
);
mailSpotMesh.position.set(109, 0.005, 131);
mailSpotMesh.rotation.x = THREE.MathUtils.degToRad(-50)
mailSpotMesh.receiveShadow = true;
scene.add(mailSpotMesh);



function showGIFOverlay() {
    const gifOverlay = document.getElementById("gifOverlay");
    gifOverlay.style.display = "flex"; // GIF 표시

    // 3초 후 자동으로 숨김
    setTimeout(() => {
        hideGIFOverlay();
    }, 3000);
}

function hideGIFOverlay() {
    const gifOverlay = document.getElementById("gifOverlay");
    gifOverlay.style.display = "none"; // GIF 숨김
}

// ✅ 과제 제출 인터랙션
function handleMailInteraction() {
    if (
        Math.abs(mailSpotMesh.position.x - player.modelMesh.position.x) < 1.5 &&
        Math.abs(mailSpotMesh.position.z - player.modelMesh.position.z) < 1.5
    ) {
        mailSpotMesh.material.color.set("seagreen");

        player.moving = false;
        emotion.visible = false;
        scene.remove(mailSpotMesh);
        isPressed = false;
        disableMouseEvents();

        disappearPlayer();
        downCameraY();

        setTimeout(() => {
            moveModelYPosition(mailgamza, 0);
            moveModelYPosition(file, 0);

            setTimeout(() => {
                mailgamza.actions[0].play();
                file.loadModel();
				// 🔥 Three.js 이벤트에서 GIF 오버레이 실행
				setTimeout(() => {
					showGIFOverlay(); // GIF 화면 전체 표시
				}, 4000);
            }, 500);
        }, 1000);

        setTimeout(() => {
            mailFinished = true;
            restorePlayerAfterMail();
        }, 5000);
    }
}

// 🎬 과제 제출 완료 인터랙션
function restorePlayerAfterMail() {
    if (mailFinished) {
        console.log("✅ 베이커리 인터랙션 종료! 플레이어 다시 등장 로직 실행");
		setTimeout(()=>{
			gsap.to(mailgamza.modelMesh.position, {
				duration: 0.4,
				y: 1,
				ease: 'expo.easeOut',
			});
			gsap.to(mailgamza.modelMesh.scale, {
				duration: 0.3,
				x: 0,
				y: 0,
				z: 0,
				ease: 'none',
			});
			gsap.to(file.modelMesh.scale, {
				duration: 0.3,
				x: 0,
				y: 0,
				z: 0,
				ease: 'none',
			});
		}, 1000)

		setTimeout(()=>{
			   // 카메라 각도 변환
				returnCameraY()
		}, 3000)

		setTimeout(() => {
			// ✅ 플레이어 다시 등장
			appearPlayer()

			player.modelMesh.position.set(109, 0.3, 135);
			emotion.visible = true;
		
			console.log("✅ 플레이어 위치 설정:", player.modelMesh.position);

			// ✅ 강제 이동 방지를 위해 destinationPoint 초기화
			destinationPoint.x = 110;
			destinationPoint.z = 150;
			console.log(destinationPoint.x , destinationPoint.z)

			// ✅ 이동을 즉시 시작하지 않도록 설정
			player.moving = true;
			player.modelMesh.lookAt(destinationPoint); 
			player.modelMesh.rotation.y += Math.PI; // 180도 회전 추가 (필요하면 조정)
			camera.lookAt(player.modelMesh.position);
	
		}, 5000)

		setTimeout(()=>{
		// ✅ 마우스 이벤트 다시 활성화
		enableMouseEvents();
		console.log("✅ 마우스 이벤트 활성화 완료");
		}, 5000)
    }
}




const raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let destinationPoint = new THREE.Vector3();
let startDestinationPoint = new THREE.Vector3();
let angle = 0;
let isPressed = false; // 마우스를 누르고 있는 상태
let started = false;

// 그리기
const clock = new THREE.Clock();
let isRenderNeeded = false;

function draw() {
	const delta = clock.getDelta();
	const elapsedTime = clock.getElapsedTime(); // 전체 경과 시간
	isRenderNeeded = false;
	// orthoCameraHelper.update(); // 카메라 움직임이 반영되도록 업데이트

	if (player.mixer) {
		player.mixer.update(delta);
		isRenderNeeded = true;
	} 

	if (metro?.mixer && metro.loaded) {
		metro.mixer.update(delta);
		metro.modelMesh.updateMatrixWorld(true);
		isRenderNeeded = true;
	}

	if (onion?.mixer && onion.loaded) {
		onion.mixer.update(delta); 
		isRenderNeeded = true;
	}

	if (classroomgamza?.mixer && classroomgamza.loaded) {
		classroomgamza.mixer.update(delta);
		isRenderNeeded = true;
	}

	if (nomoneygamza?.mixer && nomoneygamza.loaded) {
		nomoneygamza.mixer.update(delta);
		isRenderNeeded = true;
	}

	if (bankbook?.mixer && bankbook.loaded) {
		bankbook.mixer.update(delta);
		isRenderNeeded = true;
	}

	if (albagamza?.mixer && albagamza.loaded) {
		albagamza.mixer.update(delta);
		albagamza.modelMesh.updateMatrixWorld(true);

		isRenderNeeded = true;
	}

	if (cafegamza?.mixer && cafegamza.loaded) {
		cafegamza.mixer.update(delta);
		isRenderNeeded = true;
	}

	if (coffee?.mixer && coffee.loaded) {
		coffee.mixer.update(delta);
		isRenderNeeded = true;
	}

	if (cafe?.mixer && cafe.loaded) {
		cafe.mixer.update(delta);
		isRenderNeeded = true;
	}

	if (bakery?.mixer && bakery.loaded) {
		bakery.mixer.update(delta);
		isRenderNeeded = true;
	}

	if (bam?.mixer && bam.loaded) {
		bam.mixer.update(delta);
		isRenderNeeded = true;
	}
	
	if (bakerygamza?.mixer && bakerygamza.loaded) {
		bakerygamza.mixer.update(delta);
		bakerygamza.modelMesh.updateMatrixWorld(true);
		isRenderNeeded = true;
	}

	if (bakeryprops?.mixer && bakeryprops.loaded) {
		bakeryprops.mixer.update(delta);
		bakeryprops.modelMesh.updateMatrixWorld(true);
		isRenderNeeded = true;
	}

	if (mailgamza?.mixer && mailgamza.loaded) {  
		mailgamza.mixer.update(delta);
		mailgamza.modelMesh.updateMatrixWorld(true);
		isRenderNeeded = true;
	}

	if (file?.mixer && file.loaded) {
		file.mixer.update(delta);
		file.modelMesh.updateMatrixWorld(true);
		isRenderNeeded = true;
	}

	if (!started) {
		setTimeout(() => {
			startRun();
			player.moving = true;  // 이동 시작
		}, 5000);
		started = true;
	} 

	if (player.modelMesh && started) camera.lookAt(player.modelMesh.position);
	

	if (player.modelMesh && started) {

		const sinValue = Math.sin(elapsedTime * 3);

			leaveFootprint();
			fadeOutFootprints();

			// mailgamza.playAnimation('Anim2'); // Anim1 애니메이션 실행
			// mailgamza.playAnimation('Folder'); // Anim1 애니메이션 실행


		// 마우스를 누르고있을 때
		if (isPressed) {
			raycasting();
		}

		// 감자가 움직일 때
		if (player.moving) {
			
			scene.add(emotion)

			if (emotion) {
				emotion.position.y = 5 + sinValue * 0.4;
			}

			// 걸어가는 상태
			angle = Math.atan2(   	// 현재 위치와 목표지점의 거리를 통해 각도 계산
				destinationPoint.z - player.modelMesh.position.z,
				destinationPoint.x - player.modelMesh.position.x
			);
			// 구한 각도를 이용해 좌표를 구하고 그 좌표로 이동
			player.modelMesh.position.x += Math.cos(angle) * 0.2;  // 걷는 속도 0.15
			player.modelMesh.position.z += Math.sin(angle) * 0.2;

			// 카메라도 같이 이동
			camera.position.x = cameraPosition.x + player.modelMesh.position.x;
			camera.position.z = cameraPosition.z + player.modelMesh.position.z;

			// 머리 위 삼각형도 따라가기
			if (emotion) {
				emotion.position.x = player.modelMesh.position.x;
				emotion.position.z = player.modelMesh.position.z;
			}

			player.actions[1].play();
			// player.actions[0].play();
			
			if (
				Math.abs(destinationPoint.x - player.modelMesh.position.x) < 0.1 &&
				Math.abs(destinationPoint.z - player.modelMesh.position.z) < 0.1
			) {
				player.moving = false;
			}
			// console.log(destinationPoint.x , destinationPoint.z)

			// 지하철 등교 인터랙션
			handleMetroInteraction()

			// 강의실 인터랙션
			handleClassroomInteraction()

			// 텅장 인터랙션
			handleNomoneyInteraction()

			// 알바 구하기 인터랙션
			handleFindAlbaInteraction()
		
			// 베이커리 인터랙션
			handleBakeryInteraction()

			// 메일 제출 인터랙션
			handleMailInteraction()

			// 카페 인터랙션
			handleCoffeeInteraction() 

		} else {
			player.moving = false;
			// 서 있는 상태
			player.actions[1].stop();
			player.actions[0].play();
		}

		// if (arrow) {
		// 	// Y 좌표를 부드럽게 오르락내리락
		// 	arrow.position.y = 12 + Math.sin(elapsedTime * 3) * 0.5; // 3.5 ~ 4.5 범위에서 움직임
		// }
		// animateArrows(elapsedTime); // 화살표 애니메이션 추가
		animateArrows(sinValue); // sin 값을 전달하여 성능 최적화
		isRenderNeeded = true;
	}

	// if(!started) {
	// 	renderer.render(scene, camera2)
	// }else {
	// 	renderer.render(scene, camera);
	// }
			

	if (isRenderNeeded) {
		if (findAlbaLoaded && boardHover) {
			renderer.render(scene, camera2)
		}else{
			renderer.render(scene, camera);
		}
	}

	if (metroCamera) renderer.render(scene, camera3);
}


renderer.setAnimationLoop(draw);





/////// -------------------- 건들지 않는 부분 -------------------------

// 시작 지점으로 가는 함수
function startRun() {
	// raycaster.setFromCamera(mouse, camera);
	startDestinationPoint.x = -62;  // destinationPoint 목표 지점
	startDestinationPoint.y = 0.3; // 위아래로는 움직이지 않기때문에 고정값
	startDestinationPoint.z = -45;
if (player.modelMesh) {
	if (player.moving) {
		player.modelMesh.lookAt(destinationPoint);
	}
	player.modelMesh.lookAt(startDestinationPoint);  // 광선이 맞은 포인트 위치를 바라봄

	if (player.modelMesh.position.x === startDestinationPoint.x) {
		player.modelMesh.lookAt(camera)
	}
	player.modelMesh.rotation.y += Math.PI; // 180도 회전 추가 (필요하면 조정)

}else {
    console.error('player.modelMesh is undefined');
  }
}


// 좌표 얻어내는 함수
function checkIntersects() {
	// raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObjects(meshes);
	for (const item of intersects) {
		if (item.object.name === 'floor') {   // 바닥을 클릭했을 때
			// destinationPoint.x = item.point.x;  // destinationPoint 목표 지점
			// destinationPoint.y = 0.3; // 위아래로는 움직이지 않기때문에 고정값
			// destinationPoint.z = item.point.z;
			destinationPoint.set(intersects[0].point.x, 0.3, intersects[0].point.z);

			player.modelMesh.lookAt(destinationPoint);  // 광선이 맞은 포인트 위치를 바라봄
            player.modelMesh.rotation.y += Math.PI; // 180도 회전 추가 (필요하면 조정)

			player.moving = true;

			pointerMesh.position.x = destinationPoint.x;
			pointerMesh.position.z = destinationPoint.z;

			console.log(destinationPoint.x, destinationPoint.z)
		}
		break;
	}
}

const gamzaRaycaster = new THREE.Raycaster();
gamzaRaycaster.near = 0.1;
gamzaRaycaster.far = 1000;

let gamzaMouse = new THREE.Vector2();
let presentationFinished = false

function checkGamzaIntersects() {

	if (presentationFinished) return;

	// ✅ Object3D 내부에서 Mesh를 찾아 classroomgamzaMeshes 변환
	classroomgamzaMeshes = classroomgamzaMeshes.flatMap(object3D => {
	let meshes = [];
	object3D.traverse(child => {
		if (child.isMesh) meshes.push(child);
	});
		return meshes;
    });

	const intersects2 = gamzaRaycaster.intersectObjects(classroomgamzaMeshes);

	if (intersects2.length > 0) {

		hideAllArrows()

		classroomgamza.actions[0].stop()
		classroomgamza.actions[2].stop()
		classroomgamza.actions[3].stop()
		classroomgamza.actions[5].stop()
		classroomgamza.actions[1].play()
		classroomgamza.actions[4].play()
		scene.add(sorry);

		setTimeout(()=>{
			
			presentationFinished = true

			// ✅ 강의실 인터랙션 종료 후 플레이어 다시 등장
			restorePlayerAfterClass();
		}, 3000)

    }
}




let ovenEnabled = false
let isOvenInteractionEnabled = false; // 플래그 변수
let ovenDone = false

function enableOvenInteractions() {
    if (isOvenInteractionEnabled) return; // 이미 실행되었으면 종료

    ovenEnabled = true;
    isOvenInteractionEnabled = true; // 실행됨을 표시
	setTimeout(() => {
		showArrowAt(2); 
	}, 5000)

    canvas.addEventListener('click', startOvenOpen, { once: true });
}


function startOvenOpen() {
    if (!ovenEnabled) return;
		hideAllArrows()
		bakerygamza.stopAnimation('Anim1'); // Anim1 애니메이션 실행

		bakeryprops.stopAnimation('Oven0')
		bakeryprops.stopAnimation('DonutTrayAnim1')
		bakeryprops.stopAnimation('DonutRAnim1')
		bakeryprops.stopAnimation('DonutLAnim1')

		bam.stopAnimation('BbAnim1')
		bam.stopAnimation('BaAnim1')

		bakerygamza.playAnimation('Anim2')

		bakeryprops.playAnimation('Oven1')

		bakeryprops.playAnimation('DonutTrayAnim2')
		bakeryprops.playAnimation('DonutRAnim2')
		bakeryprops.playAnimation('DonutLAnim2')
		bam.playAnimation('BbAnim2')
		bam.playAnimation('BaAnim2')
}

function doneOvenOpen() {
		bakerygamza.stopAnimation('Anim2')

		bakeryprops.stopAnimation('Oven1')

		bakeryprops.stopAnimation('DonutTrayAnim2')
		bakeryprops.stopAnimation('DonutRAnim2')
		bakeryprops.stopAnimation('DonutLAnim2')
		bam.stopAnimation('BbAnim2')
		bam.stopAnimation('BaAnim2')

		bakerygamza.playAnimation('Anim3+Sad')

		bakeryprops.playAnimation('Oven2')
		bakeryprops.playAnimation('DonutTrayAnim3')
		bakeryprops.playAnimation('DonutRAnim3')
		bakeryprops.playAnimation('DonutLAnim3')
		bam.playAnimation('BbAnim3')
		bam.playAnimation('BaAnim3')

}

let boardHover = false;
let isBoardClicked = false;


// ✅ 게시판 클릭 시 메모 Hover 감지 활성화
window.addEventListener("click", (event) => {
	if (!albaboard.modelMesh) return; // ✅ 게시판 모델이 로드되지 않으면 실행하지 않음

	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	// 레이캐스터 업데이트
	raycaster.setFromCamera(mouse, camera);

	// ✅ 게시판 클릭 감지
	const intersectsBoard = raycaster.intersectObject(albaboard.modelMesh, true);

	if (startFindAlba) {
		if (intersectsBoard.length > 0) {
			// ✅ Hover 시 애니메이션 실행
			boardHover = true;
			albagamza.actions[2].stop();
			albagamza.actions[1].play();
			bakeryBoxTalk.visible = true;
			// scene.add(bakeryPlane);
			isBoardClicked = true; // ✅ 게시판 클릭됨 → 메모 Hover 감지 활성화
		} else {
			// ✅ Hover 해제 시 원래 상태로 복귀
			boardHover = false;
			albagamza.actions[1].stop();
			albagamza.actions[2].play();
			bakeryBoxTalk.visible = false;
			// scene.remove(bakeryBox);
		}
	}
});


// ✅ 이미지 오버레이 표시 함수
function showImageOverlay(imageSrc) {
    let imageOverlay = document.getElementById("imageOverlay");
    let imageOverlayBackground = document.getElementById("imageOverlayBackground");

    if (!imageOverlayBackground) {
        imageOverlayBackground = document.createElement("div");
        imageOverlayBackground.id = "imageOverlayBackground";
        imageOverlayBackground.style.position = "fixed";
        imageOverlayBackground.style.top = "0";
        imageOverlayBackground.style.left = "0";
        imageOverlayBackground.style.width = "100vw";
        imageOverlayBackground.style.height = "100vh";
        imageOverlayBackground.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        imageOverlayBackground.style.zIndex = "999";
        imageOverlayBackground.style.display = "none";
        document.body.appendChild(imageOverlayBackground);
    }

    if (!imageOverlay) {
        imageOverlay = document.createElement("img");
        imageOverlay.id = "imageOverlay";
        imageOverlay.style.position = "fixed";
        imageOverlay.style.top = "50%";
        imageOverlay.style.left = "50%";
        imageOverlay.style.transform = "translate(-50%, -50%)";
        imageOverlay.style.maxWidth = "50vw";
        imageOverlay.style.maxHeight = "50vh";
        imageOverlay.style.objectFit = "contain";
        imageOverlay.style.zIndex = "1000";
        imageOverlay.style.pointerEvents = "none";
        document.body.appendChild(imageOverlay);
    }

    console.log("🖼️ 이미지 오버레이 요소 확인:", imageOverlay);

    imageOverlay.src = imageSrc;
    imageOverlay.style.display = "block";
    imageOverlayBackground.style.display = "block";
}

// 모델이 모두 로드된 후에만 클릭 이벤트 추가
function enableGamzaClickDetection() {
    canvas.addEventListener('click', (e) => {
        calculateGamzaMousePosition(e);
        gamzaRaycasting();
    });
}

function calculateGamzaMousePosition(e) {
    gamzaMouse.x = e.clientX / canvas.clientWidth * 2 - 1;
    gamzaMouse.y = -(e.clientY / canvas.clientHeight * 2 - 1);
}

function gamzaRaycasting() {
    gamzaRaycaster.setFromCamera(gamzaMouse, camera);
    checkGamzaIntersects();
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


// ppt 넘기기
let slidesEnabled = false; // 슬라이드 활성화 플래그
let currentSlideIndex = -1;
let slideInterval;

let isSlideInteractionEnabled = false; // 플래그 변수

function enableSlideInteractions() {
    if (isSlideInteractionEnabled) return; // 이미 실행되었으면 종료

    slidesEnabled = true;
    isSlideInteractionEnabled = true; // 실행됨을 표시

    canvas.addEventListener('click', startSlideShow, { once: true });
    animateTalkBubbles();
}



// 중복 방지를 위해 배열 길이 확인 후 실행
// 슬라이드 생성
if (presentations.length === 0) {
    texturePaths.forEach((path, index) => {
        createSlide(path, index);
    });
}

function startSlideShow() {
    if (!slidesEnabled) return;

    currentSlideIndex = 0;
    showSlide(currentSlideIndex);
	if(slidesEnabled && currentSlideIndex === 0) hideAllArrows()

    // 일정 시간마다 자동으로 슬라이드 넘기기
    slideInterval = setInterval(() => {
		
        currentSlideIndex++;
		if (currentSlideIndex === 2) {
			classroomgamza.actions[0].play();
			classroomgamza.actions[0].repetitions = 1
	
			classroomgamza.actions[5].play();
		}

        if (currentSlideIndex >= presentations.length) {
            clearInterval(slideInterval);
            slidesEnabled = false;
			stopTalkBubbles()
            showArrowAt(1); // 첫 번째 화살표 숨기고 두 번째 화살표 표시
			enableGamzaClickDetection()
            return;
        }
        showSlide(currentSlideIndex);
    }, 2000); // 3초마다 슬라이드 전환
}

function showSlide(index) {
    presentations.forEach((ppt, i) => {
        if (i === index && ppt.material.map) {
            ppt.visible = true;
            ppt.material.transparent = true;
            ppt.material.opacity = 0;

            gsap.to(ppt.material, {
                opacity: 1,
                duration: 1.5,
                onUpdate: () => (ppt.material.needsUpdate = true),
            });
        } else {
            ppt.visible = false;
        }
    });
}




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
