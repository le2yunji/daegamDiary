import { AnimationMixer, LoopRepeat } from 'three';

export class Bam {
  constructor(info) {
    this.info = info;
    this.x = info.x || 0;
    this.y = info.y || 0;
    this.z = info.z || 0;

    this.rotationX = info.rotationX || 0;
    this.rotationY = info.rotationY || 0;
    this.rotationZ = info.rotationZ || 0;

    this.scaleX = info.scaleX || 1;
    this.scaleY = info.scaleY || 1;
    this.scaleZ = info.scaleZ || 1;

    this.scene = info.scene;
    this.gltfLoader = info.gltfLoader;
    this.modelSrc = info.modelSrc;
    this.loaded = false;
    this.mixer = null;
    this.actions = {}; // 애니메이션 액션을 이름으로 저장할 객체
  }

  loadModel() {
    if (this.loaded) {
      this.showModel();
      return;
    }

    this.gltfLoader.load(
      this.modelSrc,
      (glb) => {
        // 모델 설정
        this.modelMesh = glb.scene;
        this.modelMesh.position.set(this.x, this.y, this.z);
        this.modelMesh.scale.set(this.scaleX, this.scaleY, this.scaleZ);
        this.modelMesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ);

        this.modelMesh.updateMatrixWorld(true);
        this.scene.add(this.modelMesh);

        // 애니메이션 믹서 설정
        this.mixer = new AnimationMixer(this.modelMesh);
        glb.animations.forEach((clip) => {
          const action = this.mixer.clipAction(clip);
          // action.setLoop(LoopRepeat); // 기본적으로 반복 재생 설정
          this.actions[clip.name] = action; // 액션을 이름별로 저장
        });
        this.loaded = true;

        // 모델 로드 완료 콜백
        if (this.info.onLoad) {
          this.info.onLoad(this.modelMesh);
        }
      },
      // (xhr) => console.log(`Loading model: ${(xhr.loaded / xhr.total) * 100}% completed`),
      // (error) => console.error('An error occurred while loading the model:', error)
    );
  }

  
  playAnimation(name) {
    const action = this.actions[name];
    if (action) action.play();
  }

  stopAnimation(name) {
    const action = this.actions[name];
    if (action) action.stop(); 
  }

  stopAllAnimations() {
    Object.values(this.actions).forEach((action) => action.stop());
  }

  hideModel() {
    if (this.modelMesh) this.modelMesh.visible = false;
  }

  showModel() {
    if (this.modelMesh) this.modelMesh.visible = true;
  }
}
