import { AnimationMixer } from 'three';

export class AlbaGamza {
	constructor(info) {
		this.info = info;

		this.x = info.x;
		this.y = info.y;
		this.z = info.z;

		this.rotationX = info.rotationX || 0;
		this.rotationY = info.rotationY || 0;
		this.rotationZ = info.rotationZ || 0;

		this.scaleX = info.scaleX || 1;
		this.scaleY = info.scaleY || 1;
		this.scaleZ = info.scaleZ || 1;

		this.scene = info.scene;
		this.gltfLoader = info.gltfLoader;
		this.modelSrc = info.modelSrc;
		this.loaded = false;
	}

	// 모델 로드 메서드
	loadModel() {
		if (this.loaded) {
			this.showModel();
			return;
		}

		this.gltfLoader.load(
			this.modelSrc,
			(glb) => {

				// ✅ GLB 전체를 this.modelMesh로 설정
				this.modelMesh = glb.scene;
				this.modelMesh.castShadow = true;

				// ✅ 위치 설정
				this.modelMesh.position.set(this.x, this.y, this.z);
				this.modelMesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ);
				this.modelMesh.scale.set(this.scaleX, this.scaleY, this.scaleZ);

				// ✅ 행렬 업데이트
				this.modelMesh.updateMatrixWorld(true);

				// ✅ 씬에 추가
				this.scene.add(this.modelMesh);

				// ✅ 애니메이션 처리
				this.actions = [];
				if (glb.animations && glb.animations.length > 0) {
					this.mixer = new AnimationMixer(this.modelMesh);
					glb.animations.forEach((clip, index) => {
						this.actions[index] = this.mixer.clipAction(clip);
					});
				} else {
					console.warn('No animations found in the GLTF file.');
				}

				// ✅ 모델 로드 완료 콜백 실행
				if (this.info.onLoad) {
					this.info.onLoad(this.modelMesh);
				}

				this.loaded = true;
				// console.log("🚀 모델 로드 완료 후 위치:", this.modelMesh.position);
			},
			// (xhr) => console.log(`Model loading: ${(xhr.loaded / xhr.total) * 100}% completed`),
			// (error) => console.error('❌ 모델 로딩 실패:', error)
		);
	}

	// 모델 숨기기 함수
	hideModel() {
		if (this.modelMesh) {
			this.modelMesh.visible = false;
			console.log('📦 AlbaGamza 모델 숨김');
		}
	}

	// 모델 보이기 함수
	showModel() {
		if (this.modelMesh) {
			this.modelMesh.visible = true;
			console.log('📦 AlbaGamza 모델 표시');
		}
	}
}
