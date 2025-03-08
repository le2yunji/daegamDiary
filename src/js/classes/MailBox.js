import { Common } from './Common.js';

export class MailBox extends Common {
	constructor(info) {
		super(info); // ✅ Common 클래스를 상속받아 공통 속성 활용
		this.model = null;
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
		this.model = gltf.scene;

		this.scene.add(this.modelMesh);

		console.log('📬 MailBox 모델 로드 완료:', this.modelMesh);
	}
}
