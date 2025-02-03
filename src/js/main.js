import * as THREE from 'three';
// import * as BufferGeometryUtils from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Player } from './classes/Player';
import { Onion } from './classes/Onion';
import { ClassroomGamza } from './classes/ClassroomGamza';
import { Classmate } from './classes/Classmate'
import gsap from 'gsap';
import { GUI } from 'dat.gui'
import { Model } from './classes/Model';
// import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'


// Texture
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load('images/grid.png');
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

const camera2 = camera.clone()
camera2.position.x = 0
camera2.position.y = 10
camera2.position.z = 0
camera2.lookAt(0, 1, 0)

scene.add(camera, camera2);

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

// mapSize 세팅으로 그림자 퀄리티 설정
// directionalLight.shadow.mapSize.width = 2024;
// directionalLight.shadow.mapSize.height = 2024;
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
	new THREE.MeshStandardMaterial({ map: floorTexture })
);
floorMesh.name = 'floor';
floorMesh.rotation.x = -Math.PI/2;
floorMesh.receiveShadow = true;
scene.add(floorMesh);
meshes.push(floorMesh);
// camera.lookAt(floorMesh)


// 바닥 이미지 - 돌 감자
const dolgamzaTexture = new THREE.TextureLoader().load('images/rock_gamza.png')
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
const oniongamzagogumaTexture = new THREE.TextureLoader().load('images/onion_gamza_goguma.png')
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

// DRACO 로더 설정
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/public/draco/'); // 여기에 DRACO 디코더 파일 경로 설정
dracoLoader.setDecoderConfig({ type: 'js' }); // WebAssembly 또는 JS 버전 설정 가능
gltfLoader.setDRACOLoader(dracoLoader);

// 감자
const player = new Player({
	scene,
	meshes,
	gltfLoader,
	modelSrc: './models/Gamza_Cycle01.glb',
	x: -20,
	z: -10,
});



// 감자 발자국
const footprints = [];
const footprintDistanceThreshold = 0.9;
let lastFootprintPosition = new THREE.Vector3();
let isLeftFoot = true; // 왼쪽 발 여부

function createFootprint(texturePath, position, rotation) {
    const textureLoader = new THREE.TextureLoader();

    // 비동기적으로 텍스처를 로드한 후, 발자국을 생성합니다.
    textureLoader.load(texturePath, (footprintTexture) => {
        const footprintGeometry = new THREE.PlaneGeometry(0.5, 0.5);
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
        if (footprints.length > 10) {
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
            footprintData.opacity -= 0.002; // 사라지는 속도 조절
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
textureLoader.load('images/surprise.png', (emotionTexture) => {
    // 텍스처가 로드된 후, 감정 삼각형을 생성
    const emotionPlaneGeometry = new THREE.PlaneGeometry(2, 2);
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




// #S-4 강의실에서 발표하는 대감이

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
    talkMesh.position.set(57, 4.6, 17.5);
    talkMesh.rotation.set(
        THREE.MathUtils.degToRad(-10),
        THREE.MathUtils.degToRad(8),
        0
    );
    talkMesh.visible = false;

    talkPlanes.push(talkMesh);
    scene.add(talkMesh);
});

function animateTalkBubbles() {

    let currentIndex = 0;
    talkBubbleInterval = setInterval(() => {
        talkPlanes.forEach((talk, index) => {
            talk.visible = index === currentIndex;
        });
        currentIndex = (currentIndex + 1) % talkPlanes.length;
    }, 500); // 0.5초 간격으로 애니메이션 변경
	
}

function stopTalkBubbles() {
    clearInterval(talkBubbleInterval);
    talkPlanes.forEach(talk => talk.visible = false);
}



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


//강의실 햇빛
const classroomSunLight = new THREE.RectAreaLight('#FFF8DA', 3, 12, 4)
classroomSunLight.position.set(37, 5, 25)
classroomSunLight.rotation.y = THREE.MathUtils.degToRad(-90)
// classroomSunLight.target.position.set(50, 0.3, 20);
// const sunlightHelper = new RectAreaLightHelper(classroomSunLight);
// scene.add(sunlightHelper);


// 강의실 전등
const classroomLight = new THREE.PointLight('white', 20, 30, 1.5); 
classroomLight.position.set(50, 10, 22)
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

// const loader = new THREE.TextureLoader();

function createSlide(texturePath, index) {
  if (presentations.length >= texturePaths.length) return;
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0, // 초기 로딩 전 텍스처 보이지 않음
  });

  const slide = new THREE.Mesh(planeGeometry, material);
  slide.position.set(48.1, 5.5, 16.5);
  slide.scale.set(1.435, 1.45, 1.45);
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


const arrowPositions = [
	{ x: 49, y: 12, z: 16, rotationX: -10, rotationY: 8 }, // 기본값 포함
	{ x: 55, y: 6, z: 17.5, rotationX: -10, rotationY: 8 },
  ];
  
  const arrows = arrowPositions.map(pos => {
	const arrowClone = arrow.clone(); // arrow 복제
	arrowClone.position.set(pos.x, pos.y, pos.z); // y 기본값 설정
	arrowClone.rotation.set(
	  THREE.MathUtils.degToRad(pos.rotationX),
	  THREE.MathUtils.degToRad(pos.rotationY),
	  0
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
  
	  


// 강의실
const classroom = new Model({
	gltfLoader,
	scene,
	modelSrc: './models/Classroom.glb',
	x: 39,  
	y: -10.3,
	z: 23, 
	rotationY: THREE.MathUtils.degToRad(90),
	onLoad: (modelMesh) => {
        // 모델 로딩 완료 후 0.5초 지연 후 애니메이션 실행
			gsap.to(modelMesh.position, {
				duration: 1,
				y: 3.7 ,
				ease: 'Bounce.easeOut',
			});
    },
});


const gamzaModels = []


// 강의실 감자


// 가만히 떠는 감자
const classroomgamza = new ClassroomGamza({
	scene,
	meshes,
	gltfLoader,
	modelSrc: './models/Gamza_Shiver02.glb',  
	x: 55,
	y: 5,
	z: 17.5,
	rotationY: THREE.MathUtils.degToRad(180),
	onLoad: (modelMesh) => {
        // 모델 로딩 완료 후 0.5초 지연 후 애니메이션 실행
			gsap.to(modelMesh.position, {
				duration: 1,
				x: 55,
				y: 0.3,
				z: 17.5,
				ease: 'Bounce.easeOut',
			});
    },
});

// 양파교수
// 가만히 있는 교수
const onion = new Onion({
	scene,
	meshes,
	gltfLoader,
	modelSrc: './models/s4_onion.glb',
	// rotationY: Math.PI/2,
	x: 40.5,
	y: 5,
	z: 19,
	rotationY: THREE.MathUtils.degToRad(65),
	onLoad: (modelMesh) => {
        // 모델 로딩 완료 후 0.5초 지연 후 애니메이션 실행
			gsap.to(modelMesh.position, {
				duration: 1,
				x: 40.5,
				y: 0.8,
				z: 19,
				ease: 'Bounce.easeOut',
			});
    },
});


// 학생 감자들
const classmate1 = new Classmate({
	gltfLoader,
	scene,
	modelSrc: './models/s4_classmate1.glb',
	x: 44,
	y: 9,
	z: 24,
	rotationY: THREE.MathUtils.degToRad(90),
	scaleX: 0.8,
	scaleY: 0.8,
	scaleZ: 0.8,
	onLoad: (modelMesh) => {
        // 모델 로딩 완료 후 0.5초 지연 후 애니메이션 실행
        
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
	x: 49.5,  
	y: 9,
	z: 24.5,   
	rotationY: THREE.MathUtils.degToRad(90),
	// scaleX: 4,
	// scaleY: 4,
	// scaleX: 4,
	onLoad: (modelMesh) => {
        // 모델 로딩 완료 후 0.5초 지연 후 애니메이션 실행
        
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
	x: 55,
	y: 9,
	z: 24.5,
	rotationY: THREE.MathUtils.degToRad(90),
	// scaleX: 4,
	// scaleY: 4,
	// scaleX: 4,
	onLoad: (modelMesh) => {
        // 모델 로딩 완료 후 0.5초 지연 후 애니메이션 실행
      
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
	x: 44,
	y: 5,
	z: 32.5,
	rotationY: THREE.MathUtils.degToRad(90),
	// scaleX: 4,
	// scaleY: 4,
	// scaleX: 4,
	onLoad: (modelMesh) => {
        // 모델 로딩 완료 후 0.5초 지연 후 애니메이션 실행

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
	x: 49.5,
	y: 9,
	z: 32,
	rotationY: THREE.MathUtils.degToRad(90),
	// scaleX: 4,
	// scaleY: 4,
	// scaleX: 4,
	onLoad: (modelMesh) => {
        // 모델 로딩 완료 후 0.5초 지연 후 애니메이션 실행

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
	x: 55,
	y: 5,
	z: 32.8,
	rotationY: THREE.MathUtils.degToRad(90),
	// scaleX: 4,
	// scaleY: 4,
	// scaleX: 4,
	onLoad: (modelMesh) => {
        // 모델 로딩 완료 후 0.5초 지연 후 애니메이션 실행
        gsap.delayedCall(1, () => {
			gsap.to(modelMesh.position, {
				duration: 1,
				y: 1.5,
				ease: 'Bounce.easeOut',
			});
        });
    },

});


// function loadModelIfNeeded(model) {
//     if (!model.loaded && !model.loading) {
//         model.loading = true;
//         model.loadModel().then(() => {
//             model.loaded = true;
//             model.loading = false;
//         }).catch((error) => {
//             console.error(`Failed to load model: ${model.modelSrc}`, error);
//             model.loading = false; // 에러 발생 시 로딩 상태 해제
//         });
//     }
// }

// function checkAllModelsLoaded() {
//     return classroom.loaded && 
//            classmate1.loaded && 
//            classmate2.loaded && 
//            classmate3.loaded && 
//            classmate4.loaded && 
//            classmate5.loaded && 
//            classmate6.loaded && 
//            onion.loaded && 
//            classroomgamza.loaded;
// }


// 강의실 인터랙션
function handleClassroomInteraction() {
    if (
      Math.abs(classroomSpotMesh.position.x - player.modelMesh.position.x) < 1.5 &&
      Math.abs(classroomSpotMesh.position.z - player.modelMesh.position.z) < 1.5
    ) {
      if (!classroom.visible) {
        classroomSpotMesh.material.color.set('seagreen');
		// [ classmate1, classmate2, classmate3, classmate4, classmate5, classmate6, onion1, classroomgamza2].forEach(loadModelIfNeeded);
		

        showArrowAt(0); // 첫 번째 화살표 보이기
		
        // 카메라 각도 변환
        gsap.to(camera.position, {
          duration: 1,
          y: 3
        });
  
        player.moving = false;
        emotion.visible = false;
  
        // player 사라짐
        gsap.to(player.modelMesh.scale, {
          duration: 0.4,
          x: 0,
          y: 0,
          z: 0,
          ease: 'expo.easeOut'
        });
  
        classroomSpotMesh.visible = false;
        isPressed = false;
  
        disableMouseEvents();
  

		const modelsToLoad = [
			classroom, classmate1, classmate2, classmate3, 
			classmate4, classmate5, classmate6, onion, classroomgamza
		];
		
		// 모델이 로드되지 않은 경우에만 loadModel() 호출
		const loadPromises = modelsToLoad.map(model => {
			if (!model.loaded && !model.loading) {
				return model.loadModel(); // 모델 로딩을 시작하고, Promise 반환
			}
			return Promise.resolve(); // 이미 로드된 모델은 그대로 넘어감
		});
		
		// 모든 모델이 로드된 후에 슬라이드 인터랙션을 활성화
		Promise.all(loadPromises)
			.then(() => {
				// 일정 시간 후 애니메이션 시작 (0.5초 후)
			
					enableSlideInteractions(); // 모든 모델 로드 후 실행
					scene.add(classroomLight, classroomSunLight);
					// 애니메이션 실행 (예시)
		
				// scene.add(classroomLight, classroomSunLight);
			})
			.catch(error => {
				console.error("Error loading models:", error);
			});

    }
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

	if (player.mixer) {
		if (player.moving) player.mixer.update(delta);
		isRenderNeeded = true;
	} 

	if (onion?.mixer && onion.loaded) {
		onion.mixer.update(delta);  // onion이 보일 때만 업데이트
		isRenderNeeded = true;
	}

	if (classroomgamza?.mixer && classroomgamza.loaded) {
		classroomgamza.mixer.update(delta);
		isRenderNeeded = true;
	}
	
	
	if (!started) {
		setTimeout(() => {
			startRun();
			player.moving = true;  // 이동 시작
		}, 7000);
		started = true;
	} 

	if (player.modelMesh && started) camera.lookAt(player.modelMesh.position);
	

	if (player.modelMesh && started) {

		const sinValue = Math.sin(elapsedTime * 3);

			leaveFootprint();
			fadeOutFootprints();
			

		// 마우스를 누르고있을 때
		if (isPressed) {
			raycasting();
		}

		// 감자가 움직일 때
		if (player.moving) {
			
			scene.add(emotion)

			if (emotion) {
				emotion.position.y = 7 + sinValue * 0.4;
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

			// 강의실 인터랙션
			handleClassroomInteraction()
		
			
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
		renderer.render(scene, camera);
	}
}


renderer.setAnimationLoop(draw);





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
			// destinationPoint.x = item.point.x;  // destinationPoint 목표 지점
			// destinationPoint.y = 0.3; // 위아래로는 움직이지 않기때문에 고정값
			// destinationPoint.z = item.point.z;
			destinationPoint.set(intersects[0].point.x, 0.3, intersects[0].point.z);

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

// ppt 넘기기
let slidesEnabled = false; // 슬라이드 활성화 플래그
let currentSlideIndex = -1;
let slideInterval;

function enableSlideInteractions() {
  slidesEnabled = true;
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
        if (currentSlideIndex >= presentations.length) {
            clearInterval(slideInterval);
            slidesEnabled = false;
			stopTalkBubbles()
            showArrowAt(1); // 첫 번째 화살표 숨기고 두 번째 화살표 표시
            return;
        }
        showSlide(currentSlideIndex);
    }, 3000); // 3초마다 슬라이드 전환
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



