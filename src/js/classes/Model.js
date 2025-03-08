import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Common } from './Common.js';

export class Model extends Common {
    constructor(info) {
        super(info); // ✅ Common 클래스로부터 공통 속성 상속

        this.receiveShadow = true;
        this.mixer = null;
        this.loader = new GLTFLoader();
        this.worker = new Worker(new URL('./generalizedWorker.js', import.meta.url), { type: 'module' });
        this.worker.onmessage = this.onWorkerMessage.bind(this);
    }

    // ✅ Web Worker를 활용한 모델 로드
    loadModel() {
        if (this.loaded) return;
        console.log(`📤 모델 로드 요청: ${this.modelSrc}`);
        this.worker.postMessage({ modelSrc: this.modelSrc });
    }

    // ✅ Web Worker 메시지 핸들러
    onWorkerMessage(event) {
        const { model, buffers, images = [], error } = event.data;

        if (error) {
            console.error(`❌ [Main Thread] 모델 로드 실패: ${this.modelSrc}`, error);
            return;
        }

        if (!buffers || buffers.length === 0) {
            console.error("❌ Web Worker에서 받은 buffers가 없습니다.");
            return;
        }

        const blob = new Blob([buffers[0]], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        
        if (model.buffers && model.buffers.length > 0) {
            model.buffers[0].uri = url;
        } else {
            console.error("❌ model.buffers가 유효하지 않습니다.");
            return;
        }

        THREE.Cache.enabled = false;

        this.loader.parse(
            JSON.stringify(model),
            '',
            (gltf) => {
                this.modelMesh = gltf.scene;
                this.modelMesh.position.set(this.x, this.y, this.z);
                this.modelMesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ);
                this.modelMesh.scale.set(this.scaleX, this.scaleY, this.scaleZ);
                this.scene.add(this.modelMesh);
                this.loaded = true;

                this.applyTextures(gltf, images);

                setTimeout(() => {
                    URL.revokeObjectURL(model.buffers[0].uri);
                }, 10000);

                THREE.Cache.clear();
            },
            buffers
        );
    }

    // ✅ 텍스처 적용 메서드 (코드 정리)
    async applyTextures(gltf, images) {
        let imageIndex = 0;

        gltf.scene.traverse(async (child) => {
            if (child.isMesh && child.material?.map && images.length > imageIndex) {
                const imageBlob = images[imageIndex];

                if (imageBlob instanceof Blob) {
                    const imageBitmap = await createImageBitmap(imageBlob);
                    const texture = new THREE.Texture(imageBitmap);
                    texture.colorSpace = THREE.SRGBColorSpace;
                    texture.needsUpdate = true;
                    child.material.map = texture;
                    imageIndex++;
                    console.log(`✅ 텍스처 적용 완료:`, texture);
                } else {
                    console.error("❌ 유효하지 않은 이미지 형식:", imageBlob);
                }
            }
        });
    }
}
