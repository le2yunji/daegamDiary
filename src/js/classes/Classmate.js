import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Classmate {
	constructor(info) {
		this.info = info;
		this.scene = info.scene;
		this.modelSrc = info.modelSrc;
		this.x = info.x;
		this.y = info.y;
		this.z = info.z;
		this.rotationY = info.rotationY || 0;
		this.scaleX = info.scaleX || 1;
		this.scaleY = info.scaleY || 1;
		this.scaleZ = info.scaleZ || 1;
		this.modelMesh = null;
		this.loaded = false;

		this.loader = new GLTFLoader();

		// ✅ Web Worker 파일 경로 확인 (절대 경로 사용 가능)
		this.worker = new Worker(new URL('./gltfWorker.js', import.meta.url), { type: 'module' });

		// ✅ Web Worker 메시지 수신 확인
		this.worker.onmessage = this.onWorkerMessage.bind(this);
	}

	loadModel() {
		if (this.loaded) return;

		console.log(`📤 [Main Thread] 모델 로드 요청: ${this.modelSrc}`);
		this.worker.postMessage({ modelSrc: this.modelSrc });
	}

	onWorkerMessage(event) {
		console.log(`📥 [Main Thread] Web Worker 메시지 수신:`, event.data);

		const { id, model, error } = event.data;
		if (error) {
			console.error(`❌ [Main Thread] 모델 로드 실패: ${this.modelSrc}`, error);
			return;
		}

		// ✅ JSON 데이터를 Three.js Object3D로 변환
		const loader = new THREE.ObjectLoader();
		this.modelMesh = loader.parse(model);

		this.modelMesh.position.set(this.x, this.y, this.z);
		this.modelMesh.rotation.y = this.rotationY;
		this.modelMesh.scale.set(this.scaleX, this.scaleY, this.scaleZ);
		this.modelMesh.name = "classmate";
		this.modelMesh.castShadow = true;

		this.scene.add(this.modelMesh);
		this.loaded = true;

		// ✅ 모델 로드 후 애니메이션 실행
		if (this.info.onLoad) {
			this.info.onLoad(this.modelMesh);
		}
	}
}
