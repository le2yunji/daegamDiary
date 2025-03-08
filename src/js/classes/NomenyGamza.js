import { AnimationMixer } from 'three';
import { Common } from './Common.js';

export class NomoneyGamza extends Common {
	constructor(info) {
		super(info); // ✅ Common 클래스를 상속받아 공통 속성 활용
		this.mixer = null;
		this.actions = [];
	}

	// ✅ 모델 로드 메서드
	loadModel() {
		if (this.loaded) {
			this.showModel();
			return;
		}

		this.info.gltfLoader.load(
			this.modelSrc,
			(glb) => {
				this.setupModel(glb);
				this.setupAnimations(glb);
				this.loaded = true;

				// ✅ 모델 로드 후 실행할 콜백
				if (this.info.onLoad) {
					this.info.onLoad(this.modelMesh);
				}
			}
		);
	}

	// ✅ 모델 설정 메서드 (코드 정리)
	setupModel(gltf) {
		gltf.scene.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true;
			}
		});

		this.modelMesh = gltf.scene.children[0];
		this.modelMesh.position.set(this.x, this.y, this.z);
		this.modelMesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ);
		this.modelMesh.scale.set(this.scaleX, this.scaleY, this.scaleZ);
		this.modelMesh.name = 'nomoneygamza';

		this.scene.add(this.modelMesh);
	}

	// ✅ 애니메이션 설정
	setupAnimations(gltf) {
		if (gltf.animations && gltf.animations.length > 0) {
			this.mixer = new AnimationMixer(this.modelMesh);
			gltf.animations.forEach((clip, index) => {
				this.actions[index] = this.mixer.clipAction(clip);
			});

			// ✅ 특정 애니메이션 반복 설정
			this.actions[3]?.setLoop(THREE.LoopOnce); // 떨기
			this.actions[4]?.setLoop(THREE.LoopOnce); // 눈 감고 있기
			this.actions[5]?.setLoop(THREE.LoopOnce); // 눈 상태 변화
		} else {
			console.warn('⚠️ No animations found in the GLTF file.');
		}
	}
}
