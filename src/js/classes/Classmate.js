import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Common } from './Common.js';

export class Classmate extends Common {
	constructor(info) {
		super(info); // ✅ Common 클래스를 상속받아 공통 속성 활용
		this.loader = new GLTFLoader();
		this.worker = new Worker(new URL('./gltfWorkerBasic.js', import.meta.url), { type: 'module' });
		this.worker.onmessage = this.onWorkerMessage.bind(this);
	}

	// ✅ 모델 로드 메서드
	loadModel() {
		if (this.loaded) return;
		this.worker.postMessage({ modelSrc: this.modelSrc });
	}

	// ✅ Web Worker 메시지 처리
	onWorkerMessage(event) {
		const { model, buffers, images, error } = event.data;
		if (error) {
			console.error(`❌ 모델 로드 실패: ${this.modelSrc}`, error);
			return;
		}

		if (!buffers || buffers.length === 0) {
			console.error("❌ Web Worker에서 받은 buffers가 없습니다!");
			return;
		}

		// ✅ ArrayBuffer → Blob 변환 후 URL 생성
		const blob = new Blob([buffers[0]], { type: "application/octet-stream" });
		const url = URL.createObjectURL(blob);

		if (model.buffers && model.buffers.length > 0) {
			model.buffers[0].uri = url;
		}
		THREE.Cache.enabled = false;

		// ✅ GLTF 복원 및 설정
		this.loader.parse(
			JSON.stringify(model),
			'',
			(gltf) => {
				this.setupModel(gltf);
				this.applyTextures(gltf, images);
				this.loaded = true;

				// ✅ 모델 로드 후 콜백 실행
				if (this.info.onLoad) {
					this.info.onLoad(this.modelMesh);
				}

				// ✅ 메모리 정리
				setTimeout(() => {
					URL.revokeObjectURL(url);
				}, 5000);
				THREE.Cache.clear();
			},
			buffers
		);
	}

	// ✅ 모델 설정 메서드 (코드 정리)
	setupModel(gltf) {
		this.modelMesh = gltf.scene;
		this.modelMesh.position.set(this.x, this.y, this.z);
		this.modelMesh.rotation.y = this.rotationY;
		this.modelMesh.scale.set(this.scaleX, this.scaleY, this.scaleZ);
		this.modelMesh.name = "classmate";
		this.modelMesh.castShadow = true;
		this.scene.add(this.modelMesh);
	}

	// ✅ 텍스처 적용 메서드
	async applyTextures(gltf, images) {
		let imageIndex = 0;
		gltf.scene.traverse(async (child) => {
			if (child.isMesh && child.material?.map && images.length > 0) {
				const imageBitmap = await createImageBitmap(images[imageIndex]);
				const texture = new THREE.Texture(imageBitmap);
				texture.colorSpace = THREE.SRGBColorSpace;
				texture.needsUpdate = true;
				child.material.map = texture;
				imageIndex++;
			}
		});
	}
}
