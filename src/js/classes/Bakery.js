import * as THREE from 'three';
import { AnimationMixer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Common } from './Common.js';

export class Bakery extends Common {
    constructor(info) {
        super(info); // ✅ Common 클래스를 상속받아 공통 속성 활용
        this.loader = new GLTFLoader();
        this.worker = new Worker(new URL('./gltfWorkerBakery.js', import.meta.url), { type: 'module' });
        this.worker.onmessage = this.onWorkerMessage.bind(this);
        this.mixer = null;
        this.actions = [];
    }

    // ✅ 모델 로드 메서드
    loadModel() {
        if (this.loaded) {
            console.warn("📢 모델이 이미 로드되었습니다.");
            return;
        }
        this.worker.postMessage({ modelSrc: this.modelSrc });
    }

    // ✅ Web Worker 메시지 처리
    onWorkerMessage(event) {
        const { arrayBuffer, error } = event.data;

        if (error) {
            console.error(`❌ 모델 로드 실패: ${error}`);
            return;
        }

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

                this.applyMaterialAndShadows(gltf);
                this.setupAnimations(gltf);

                // ✅ 모델 로드 완료 후 실행할 콜백
                if (this.info.onLoad) {
                    this.info.onLoad(this.modelMesh);
                }
            },
            (error) => {
                console.error(`❌ GLTFLoader 파싱 실패: ${error.message}`);
            }
        );
    }

    // ✅ 그림자 및 머티리얼 설정
    applyMaterialAndShadows(gltf) {
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                // child.material.metalness = 1.0; // 완전한 금속 효과 (필요하면 사용)
                // child.material.roughness = 0.2; // 약간의 거칠기 (필요하면 사용)
            }
        });
    }

    // ✅ 애니메이션 설정
    setupAnimations(gltf) {
        if (gltf.animations && gltf.animations.length > 0) {
            this.mixer = new AnimationMixer(this.modelMesh);
            gltf.animations.forEach((clip) => {
                const action = this.mixer.clipAction(clip);
                this.actions.push(action);
                action.setLoop(THREE.LoopOnce); // ✅ 애니메이션 1회 반복
            });
        } else {
            console.warn('⚠️ No animations found in the GLTF file.');
        }
    }

    // ✅ 애니메이션 실행 메서드
    playAllAnimations() {
        if (this.actions.length > 0) {
            this.actions.forEach(action => action.play());
        } else {
            console.warn('⚠️ No animations available to play.');
        }
    }

    // ✅ 애니메이션 정지
    stopAllAnimations() {
        if (this.actions.length > 0) {
            this.actions.forEach(action => action.stop());
        }
    }
}
