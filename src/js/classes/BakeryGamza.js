import { AnimationMixer } from 'three';
import { Common } from './Common.js';

export class BakeryGamza extends Common {
  constructor(info) {
    super(info); // ✅ Common 클래스를 상속받아 공통 속성 활용
    this.mixer = null;
    this.actions = {}; // 애니메이션 액션을 이름으로 저장할 객체
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
        this.modelMesh.position.set(this.x, this.y, this.z);
        this.modelMesh.scale.set(this.scaleX, this.scaleY, this.scaleZ);
        this.modelMesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ);

        this.modelMesh.updateMatrixWorld(true);
        this.scene.add(this.modelMesh);

        // ✅ 애니메이션 믹서 설정
        this.setupAnimations(glb);

        this.loaded = true;

        // ✅ 모델 로드 완료 후 실행할 콜백
        if (this.info.onLoad) {
          this.info.onLoad(this.modelMesh);
        }
      }
    );
  }

  // ✅ 애니메이션 설정 (코드 정리)
  setupAnimations(gltf) {
    if (gltf.animations && gltf.animations.length > 0) {
      this.mixer = new AnimationMixer(this.modelMesh);
      gltf.animations.forEach((clip) => {
        this.actions[clip.name] = this.mixer.clipAction(clip);
      });
    } else {
      console.warn('⚠️ No animations found in the GLTF file.');
    }
  }

  // ✅ 특정 애니메이션 실행
  playAnimation(name) {
    if (name === 'Anim3+Sad') {
      if (this.actions['Anim3'] && this.actions['Sad']) {
        this.stopAllAnimations(); // 다른 애니메이션 중단
        this.actions['Anim3'].reset().play();
        this.actions['Sad'].reset().play();
        console.log(`▶️ Anim3와 Sad 애니메이션을 동시에 실행`);
      } else {
        console.warn(`⚠️ Anim3 또는 Sad 애니메이션을 찾을 수 없습니다.`);
      }
    } else if (this.actions[name]) {
      this.stopAllAnimations(); // 다른 애니메이션 중단
      this.actions[name].reset().play();
      console.log(`▶️ ${name} 애니메이션 실행`);
    } else {
      console.warn(`⚠️ ${name} 애니메이션을 찾을 수 없습니다.`);
    }
  }

  // ✅ 특정 애니메이션 정지
  stopAnimation(name) {
    const action = this.actions[name];
    if (action) action.stop();
  }

  // ✅ 모든 애니메이션 정지
  stopAllAnimations() {
    Object.values(this.actions).forEach((action) => action.stop());
  }
}
