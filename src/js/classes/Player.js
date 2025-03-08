import {
	AnimationMixer
} from 'three';

export class Player {
	constructor(info) {

		this.info = info; // info 객체를 클래스 인스턴스 변수로 저장

		this.x = info.x || 0;
		this.y = info.y || 0.3;
		this.z = info.z || 0;

		this.scaleX = info.scaleX || 1;
		this.scaleY = info.scaleY || 1;
		this.scaleZ = info.scaleZ || 1;

		this.rotationX = info.rotationX || 0;
        this.rotationY = info.rotationY || 0;
        this.rotationZ = info.rotationZ || 0;

		this.moving = false;

		info.gltfLoader.load(
			info.modelSrc,
			glb => {
				glb.scene.traverse(child => {
					if (child.isMesh) {
						child.castShadow = true;
					}
				});
		
				this.modelMesh = glb.scene.children[0];
				// this.modelMesh.position.x = -50;
				// this.modelMesh.position.z = 10;
				this.modelMesh.position.y = 0.3;

				this.modelMesh.position.set(this.x, this.y, this.z);

				// 스케일 설정
				this.modelMesh.scale.set(this.scaleX, this.scaleY, this.scaleZ);

                this.modelMesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ);
				
				this.modelMesh.name = 'gamza';
				info.scene.add(this.modelMesh);
				info.meshes.push(this.modelMesh);

				this.actions = [];
		
				this.mixer = new AnimationMixer(this.modelMesh);
				this.actions[0] = this.mixer.clipAction(glb.animations[0]);
				this.actions[1] = this.mixer.clipAction(glb.animations[1]);
				this.actions[2] = this.mixer.clipAction(glb.animations[2]);
				this.actions[3] = this.mixer.clipAction(glb.animations[3]);
				


				this.actions.forEach(action => {
					action.setEffectiveTimeScale(2.2);  // 2배 빠르게 재생
				});
				

				// console.log(this.actions)
			}
		);
	}

	
}
