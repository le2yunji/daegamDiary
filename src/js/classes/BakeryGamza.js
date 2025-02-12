import { AnimationMixer, Vector3, LoopRepeat, LoopOnce } from 'three';

export class BakeryGamza {
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
        console.log("✅ 🥐🥔베이커리 감자 모델 로딩 완료:", this.modelSrc);

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
          action.setLoop(LoopRepeat); // 기본적으로 반복 재생 설정
          this.actions[clip.name] = action; // 액션을 이름별로 저장
        });

        this.loaded = true;

        // 모델 로드 완료 콜백
        if (this.info.onLoad) {
          this.info.onLoad(this.modelMesh);
        }
      },
      (xhr) => console.log(`Loading model: ${(xhr.loaded / xhr.total) * 100}% completed`),
      (error) => console.error('An error occurred while loading the model:', error)
    );
  }

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
