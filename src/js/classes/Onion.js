import * as THREE from 'three';
import { AnimationMixer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Onion {
	constructor(info) {
		this.info = info;
		this.scene = info.scene;
		this.modelSrc = info.modelSrc;
		this.x = info.x;
		this.y = info.y;
		this.z = info.z;
		this.rotationX = info.rotationX || 0;
		this.rotationY = info.rotationY || 0;
		this.rotationZ = info.rotationZ || 0;
		this.scaleX = info.scaleX || 1;
		this.scaleY = info.scaleY || 1;
		this.scaleZ = info.scaleZ || 1;
		this.modelMesh = null;
		this.loaded = false;
		this.mixer = null;
		this.actions = [];
		this.visible = false

		this.loader = new GLTFLoader();

		// ✅ Web Worker 사용
		this.worker = new Worker(new URL('./gltfWorkerTextured.js', import.meta.url), { type: 'module' });
		this.worker.onmessage = this.onWorkerMessage.bind(this);
	}

	// ✅ Web Worker를 통한 모델 로드
	loadModel() {
		if (this.loaded) {
			this.showModel();
			return;
		}

		// console.log(`📤 [Main Thread] 모델 로드 요청: ${this.modelSrc}`);
		this.worker.postMessage({ modelSrc: this.modelSrc });
	}

	// ✅ Web Worker에서 데이터를 수신하여 씬에 추가
	onWorkerMessage(event) {
		// console.log(`📥 [Main Thread] Web Worker 메시지 수신:`, event.data);
	
		let { model, buffers, images, error } = event.data;
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
	
		// ✅ JSON에서 `buffers[0].uri`를 Blob URL로 변경
		if (model.buffers && model.buffers.length > 0) {
			model.buffers[0].uri = url; // ✅ Web Worker에서 받은 버퍼를 URL로 연결
		}
	
		  // ✅ GLTFLoader.parse()로 모델 복원
		  THREE.Cache.enabled = false;  // ✅ 캐시 비활성화
	
		// ✅ `GLTFLoader.parse()`를 사용하여 GLTF 복원
		this.loader.parse(
			JSON.stringify(model),
			'',
			(gltf) => {
				// console.log("✅ GLTF 파싱 성공:", gltf);
				this.modelMesh = gltf.scene;
				this.modelMesh.position.set(this.x, this.y, this.z);
				this.modelMesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ);
				this.modelMesh.scale.set(this.scaleX, this.scaleY, this.scaleZ);
				this.modelMesh.name = "onion";
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
						
						// ✅ 색공간을 sRGB로 설정하여 원래 색감 유지
						texture.colorSpace = THREE.SRGBColorSpace;
					
						texture.needsUpdate = true;
						child.material.map = texture;
						imageIndex++;
					}
				});
	
				// ✅ 애니메이션 처리
				if (gltf.animations && gltf.animations.length > 0) {
					this.mixer = new AnimationMixer(this.modelMesh);
					gltf.animations.forEach((clip, index) => {
						this.actions[index] = this.mixer.clipAction(clip);
					});
					this.actions[0].play();
					console.log(this.actions)
				} else {
					console.warn('No animations found in the GLTF file.');
				}
	
				// ✅ 로드 완료 후 콜백 실행
				if (this.info.onLoad) {
					this.info.onLoad(this.modelMesh);
				}
	
				console.log("🧅 Onion 모델이 로드되었습니다.");

				setTimeout(() => {
                    console.log("🧹 Blob URL 정리:", model.buffers[0].uri);
                    URL.revokeObjectURL(model.buffers[0].uri);
                }, 5000);  // 5초 후 메모리 해제

                THREE.Cache.clear();  // ✅ 명시적으로 캐시 정리
			},
			buffers
		);
	}
	
	
}	
