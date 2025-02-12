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

		// ✅ Web Worker 사용
		this.worker = new Worker(new URL('./gltfWorkerBasic.js', import.meta.url), { type: 'module' });
		this.worker.onmessage = this.onWorkerMessage.bind(this);
	}

	loadModel() {
		if (this.loaded) return;

		console.log(`📤 [Main Thread] 모델 로드 요청: ${this.modelSrc}`);
		this.worker.postMessage({ modelSrc: this.modelSrc });
	}

	onWorkerMessage(event) {
		console.log(`📥 [Main Thread] Web Worker 메시지 수신:`, event.data);

		const { model, buffers, images, error } = event.data;
		if (error) {
			console.error(`❌ [Main Thread] 모델 로드 실패: ${this.modelSrc}`, error);
			return;
		}

		if (!buffers || buffers.length === 0) {
			console.error("❌ [Main Thread] Web Worker에서 받은 buffers가 없습니다!");
			return;
		}

		// ✅ ArrayBuffer → Blob 변환 후 URL 생성
		const blob = new Blob([buffers[0]], { type: "application/octet-stream" });
		const url = URL.createObjectURL(blob);

		if (model.buffers && model.buffers.length > 0) {
			model.buffers[0].uri = url; // ✅ Web Worker에서 받은 버퍼를 URL로 연결
		}
		THREE.Cache.enabled = false;  // ✅ 캐시 비활성화

		// ✅ `GLTFLoader.parse()`를 사용하여 GLTF 복원
		this.loader.parse(
			JSON.stringify(model),
			'',
			(gltf) => {
				this.modelMesh = gltf.scene;
				this.modelMesh.position.set(this.x, this.y, this.z);
				this.modelMesh.rotation.y = this.rotationY;
				this.modelMesh.scale.set(this.scaleX, this.scaleY, this.scaleZ);
				this.modelMesh.name = "classmate";
				this.modelMesh.castShadow = true;
				this.modelMesh.visible = false

				this.scene.add(this.modelMesh);
				this.loaded = true;

				// ✅ Web Worker에서 전송된 `ImageBitmap`을 텍스처로 적용
				let imageIndex = 0;
				this.modelMesh.traverse(async (child) => {
					if (child.isMesh && child.material?.map && images.length > 0) {
						const imageBitmap = await createImageBitmap(images[imageIndex]);
						const texture = new THREE.Texture(imageBitmap);
						texture.colorSpace = THREE.SRGBColorSpace;
						texture.needsUpdate = true;
						child.material.map = texture;
						imageIndex++;
					}
				});

				// ✅ 모델 로드 후 애니메이션 실행
				if (this.info.onLoad) {
					this.info.onLoad(this.modelMesh);
				}

				// ✅ 메모리 정리
				setTimeout(() => {
					console.log("🧹 Blob URL 정리:", url);
					URL.revokeObjectURL(url);
				}, 5000);
				THREE.Cache.clear();  // ✅ 명시적으로 캐시 정리

			},
			buffers
		);
	}
}
