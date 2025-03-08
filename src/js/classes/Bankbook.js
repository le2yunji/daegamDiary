import { AnimationMixer } from 'three';

export class Bankbook {
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
				// 모델의 루트 노드를 참조 (GLTF가 Group을 포함할 수도 있음)
				this.modelMesh = glb.scene; 

				// 모든 Mesh에 Shadow 적용
				this.modelMesh.traverse((child) => {
					if (child.isMesh || child.isSkinnedMesh) {
						child.castShadow = true;
					}
				});

				// ✅ 위치, 회전, 크기 설정 (GLTF의 최상위 Scene에 적용)
				this.modelMesh.position.set(this.x, this.y, this.z);
				this.modelMesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ);
				this.modelMesh.scale.set(this.scaleX, this.scaleY, this.scaleZ);

				// 씬에 추가
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


				// 로드 완료 후 콜백 실행
				if (this.info.onLoad) {
					this.info.onLoad(this.modelMesh);
				}

				this.loaded = true; 
			},
			(xhr) => {
				// 로드 진행 상태
			},
			(error) => {
				console.error("❌ 모델 로딩 실패:", error);
			}
		);
	}

	// 모델 숨기기
	hideModel() {
		if (this.modelMesh) {
			this.modelMesh.visible = false;
			console.log("📁 모델 숨김 처리");
		}
	}

	// 모델 보이기
	showModel() {
		if (this.modelMesh) {
			this.modelMesh.visible = true;
			console.log("📁 모델 다시 보이기");
		}
	}
}

