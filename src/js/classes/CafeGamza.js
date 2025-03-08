import { AnimationMixer } from 'three';
import { Common } from './Common.js';

export class CafeGamza extends Common {
    constructor(info) {
        super(info); // ✅ Common 클래스의 속성을 상속
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

                // ✅ 공통 속성으로 위치, 회전, 스케일 설정
                this.modelMesh.position.set(this.x, this.y, this.z);
                this.modelMesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ);
                this.modelMesh.scale.set(this.scaleX, this.scaleY, this.scaleZ);

                this.scene.add(this.modelMesh);

                // ✅ 애니메이션 처리
                if (glb.animations && glb.animations.length > 0) {
                    this.mixer = new AnimationMixer(this.modelMesh);
                    glb.animations.forEach((clip, index) => {
                        this.actions[index] = this.mixer.clipAction(clip);
                    });
                } else {
                    console.warn('⚠️ No animations found in the GLTF file.');
                }

                // ✅ 모델 로드 완료 콜백 실행
                if (this.info.onLoad) {
                    this.info.onLoad(this.modelMesh);
                }

                this.loaded = true;
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
