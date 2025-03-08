import { AnimationMixer } from 'three';
import { Common } from './Common.js';

export class Coffee extends Common {
    constructor(info) {
        super(info); // ✅ Common 클래스를 상속받아 공통 속성 활용
        this.mixer = null;
        this.actions = [];
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
                this.modelMesh = glb.scene;
                this.modelMesh.castShadow = true;

                // ✅ 모든 Mesh에 그림자 적용
                this.modelMesh.traverse((child) => {
                    if (child.isMesh || child.isSkinnedMesh) {
                        child.castShadow = true;
                    }
                });

                // ✅ 위치, 회전, 크기 설정
                this.modelMesh.position.set(this.x, this.y, this.z);
                this.modelMesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ);
                this.modelMesh.scale.set(this.scaleX, this.scaleY, this.scaleZ);

                this.scene.add(this.modelMesh);

                // ✅ 애니메이션 처리
                if (glb.animations && glb.animations.length > 0) {
                    this.mixer = new AnimationMixer(this.modelMesh);
                    glb.animations.forEach((clip, index) => {
                        this.actions[index] = this.mixer.clipAction(clip);
                        this.actions[index].setLoop(THREE.LoopOnce); // ✅ 애니메이션 1회 반복
                    });
                } else {
                    console.warn("⚠ 애니메이션이 없습니다.");
                }

                // ✅ 모델 로드 완료 콜백 실행
                if (this.info.onLoad) {
                    this.info.onLoad(this.modelMesh);
                }

                this.loaded = true;
            },
            (xhr) => {
                // 로드 진행 상태 (필요하면 사용)
            },
            (error) => {
                console.error("❌ 모델 로딩 실패:", error);
            }
        );
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
