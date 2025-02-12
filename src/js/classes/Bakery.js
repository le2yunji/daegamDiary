import * as THREE from 'three';
import { AnimationMixer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Bakery {
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
        this.loader = new GLTFLoader();
        this.worker = new Worker(new URL('./gltfWorkerBakery.js', import.meta.url), { type: 'module' });
        this.worker.onmessage = this.onWorkerMessage.bind(this);

        this.modelMesh = null;
        this.mixer = null;
        this.actions = [];  // ✅ 초기화된 배열
        this.loaded = false;
    }

    loadModel() {
        if (this.loaded) {
            console.warn("📢 모델이 이미 로드되었습니다.");
            return;
        }
        console.log(`📤 모델 로드 요청: ${this.modelSrc}`);
        this.worker.postMessage({ modelSrc: this.modelSrc });
    }

    onWorkerMessage(event) {
        const { arrayBuffer, error } = event.data;

        if (error) {
            console.error(`❌ 모델 로드 실패: ${error}`);
            return;
        }

        console.log("✅ [Main Thread] Web Worker로부터 ArrayBuffer 수신, GLTFLoader로 파싱 중...");

        this.loader.parse(
            arrayBuffer,
            '',
            (gltf) => {
                this.modelMesh = gltf.scene;
                this.modelMesh.position.set(this.x, this.y, this.z);
                this.modelMesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ);
                this.modelMesh.scale.set(this.scaleX, this.scaleY, this.scaleZ);
                this.scene.add(this.modelMesh);
                this.loaded = true;

                console.log("🏫 Bakery 모델이 성공적으로 로드되었습니다.");

                gltf.scene.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                    }
                });

                // ✅ 애니메이션 처리
                if (gltf.animations && gltf.animations.length > 0) {
                    this.mixer = new AnimationMixer(this.modelMesh);
                    gltf.animations.forEach((clip, index) => {
                        const action = this.mixer.clipAction(clip);
                        this.actions.push(action);
                    });
                } else {
                    console.warn('⚠️ No animations found in the GLTF file.');
                }
            },
            (error) => {
                console.error(`❌ GLTFLoader 파싱 실패: ${error.message}`);
            }
        );
    }
}
