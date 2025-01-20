export class Model {
	constructor(info) {
		this.info = info; // info 객체를 클래스 인스턴스 변수로 저장

		this.x = info.x;
		this.y = info.y;
		this.z = info.z;

		this.rotationX = info.rotationX || 0;
		this.rotationY = info.rotationY || 0;
		this.rotationZ = info.rotationZ || 0;

		// this.scaleX = info.scaleX || 1;
		// this.scaleY = info.scaleY || 1;
		// this.scaleZ = info.scaleZ || 1;

		this.scene = info.scene; // 씬을 저장
		this.gltfLoader = info.gltfLoader; // GLTFLoader를 저장
		this.modelSrc = info.modelSrc; // 모델 경로 저장

		this.modelMesh = null; // 모델 객체
		this.loaded = false; // 로드 상태 플래그
	}

	// 모델 로드 메서드
	loadModel() {
		// 이미 로드된 경우 로드하지 않음
		if (this.loaded) return;

		// GLTFLoader 로드
		this.gltfLoader.load(
			this.modelSrc, // 모델 경로
			(glb) => {
				glb.scene.traverse((child) => {
					if (child.isMesh) {
						child.castShadow = true;
					}
				});

				this.modelMesh = glb.scene.children[0]; // 모델 메시
				this.modelMesh.castShadow = true;

				// 위치 설정
				this.modelMesh.position.set(this.x, this.y, this.z);

				// 회전 설정
				this.modelMesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ);

				// 스케일 설정
				// this.modelMesh.scale.set(this.scaleX, this.scaleY, this.scaleZ);

				// 씬에 추가
				this.scene.add(this.modelMesh);

				// 로드 완료 후 콜백 실행
				if (this.info.onLoad) {
					this.info.onLoad(this.modelMesh); // 모델 로드 후 실행되는 콜백
				}

				this.loaded = true; // 로드 완료 플래그
				console.log('Model loaded!');
			},
			(xhr) => {
				// 로드 진행 상태
				console.log(`Model loading: ${(xhr.loaded / xhr.total) * 100}% completed`);
			},
			(error) => {
				// 에러 처리
				console.error('An error occurred while loading the model:', error);
			}
		);
	}
}
