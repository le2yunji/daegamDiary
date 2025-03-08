import { AnimationMixer, Vector3, LoopRepeat, LoopOnce } from 'three';

export class BakeryProps {
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
        console.log("✅ 🥐🍩베이커리 소품 모델 로딩 완료:", this.modelSrc);

        // 모델 설정
        this.modelMesh = glb.scene;
        this.modelMesh.position.set(this.x, this.y, this.z);
        this.modelMesh.scale.set(this.scaleX, this.scaleY, this.scaleZ);
        this.modelMesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ);

        this.modelMesh.updateMatrixWorld(true);
        this.scene.add(this.modelMesh);

         // 모든 노드 이름 출력
      // this.modelMesh.traverse((node) => {
      //   console.log(`📦 Node Name: ${node.name}`);
      // });

      this.modelMesh.traverse((node) => {
        if (
            // 감자 노드
            node.name.startsWith('Gamza') || 
            node.name.startsWith('Cube059') || 
            node.name.startsWith('Root') || 
            node.name.startsWith('spine') || 
            node.name.startsWith('shoulder') || 
            node.name.startsWith('upper_arm') || 
            node.name.startsWith('forearm') || 
            node.name.startsWith('hand') || 
            node.name.startsWith('thigh') || 
            node.name.startsWith('shin') || 
            node.name.startsWith('heel') || 
            node.name.startsWith('HandIK') || 
            node.name.startsWith('Armpole') || 
            node.name.startsWith('neutral_bone') ||

            // 밤 노드
            node.name.startsWith('Armature') || 
            node.name.startsWith('Cube004') || 
            node.name.startsWith('Cube038') || 
            node.name.startsWith('Spine') || 
            node.name.startsWith('Head') || 
            node.name.startsWith('A1') || 
            node.name.startsWith('A2') || 
            node.name.startsWith('L1') || 
            node.name.startsWith('L2') || 
            node.name.startsWith('Bone005')
        ) {
          node.visible = false;  // 감자 관련 노드만 숨김 처리
          // console.log(`❌ 감자 노드 숨김 처리: ${node.name}`);
        }
      });

        
       // 애니메이션 믹서 설정
        this.mixer = new AnimationMixer(this.modelMesh);
        this.actions = {}; // 객체로 초기화

        glb.animations.forEach((clip) => {
          const action = this.mixer.clipAction(clip);
          action.setLoop(LoopOnce); 
          this.actions[clip.name] = action; // 각 애니메이션을 이름별로 저장
          action.clampWhenFinished = true; // 애니메이션이 끝나면 마지막 프레임 유지
          action.setDuration(clip.duration); // 원래 애니메이션 길이 유지
          // console.log(`Loaded animation: ${clip.name}`);
        });
        // console.log(Object.keys(this.actions));


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


// 0: "Oven0"  오븐 뚜껑 원점
// 1: "Oven1"  열리고 넘어지기
// 2: "Oven2"  열린채로 고정
// 3: "DonutTrayAnim1"  쟁반 원점
// 4: "DonutTrayAnim2"  쟁반 나오고 던져지기
// 5: "DonutTrayAnim3"  던져진 채로 고정
// 6: "DonutRAnim1"  도넛 원저
// 7: "DonutRAnim2"  도넛 나오고 던져지기
// 8: "DonutRAnim3"  던져진 채로 고정
// 9: "DonutLAnim1"  도넛 원점
// 10: "DonutLAnim2"  도넛 나오고 던져지기
// 11: "DonutLAnim3"던져진 채로 고정