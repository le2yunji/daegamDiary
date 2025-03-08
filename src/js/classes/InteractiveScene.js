import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';

export class InteractiveScene {
    constructor(info) {
        this.scene = info.scene;
        this.modelInfo = info.modelInfo; // 모델 정보 배열 (클래스룸, 베이커리)
        this.loader = new GLTFLoader();
        this.models = [];
        this.spotMeshes = info.spotMeshes; // 🎯 외부에서 전달받은 스팟 Mesh 리스트
        this.player = info.player; // 플레이어 객체 (충돌 감지용)
    }

    loadModels() {
        this.modelInfo.forEach((modelData) => {
            this.loader.load(
                modelData.modelSrc,
                (gltf) => {
                    let modelMesh = gltf.scene;

                    modelMesh.position.set(modelData.x, modelData.y, modelData.z);
                    modelMesh.rotation.set(0, modelData.rotationY, 0);
                    modelMesh.scale.set(modelData.scale, modelData.scale, modelData.scale);

                    modelMesh.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                        }
                    });

                    this.scene.add(modelMesh);
                    this.models.push({ mesh: modelMesh, id: modelData.id, onEnter: modelData.onEnter });

                    // console.log(`✅ ${modelData.id} 모델 로드 완료!`);
                },
                undefined,
                (error) => {
                    console.error(`❌ ${modelData.id} 모델 로드 실패: ${error.message}`);
                }
            );
        });
    }

    checkPlayerCollision() {
        if (!this.player) {
            // console.warn("⚠️ [checkPlayerCollision] player 객체가 존재하지 않습니다.");
            return;
        }
        if (!this.player.position) {
            // console.warn("⚠️ [checkPlayerCollision] player.position이 존재하지 않습니다.");
            return;
        }
    
        const playerPos = this.player.position; // ✅ 오류 방지: player.position이 정의된 경우만 실행
    
        this.spotMeshes.forEach((spot) => {
            if (!spot.mesh || !spot.mesh.position) {
                // console.warn(`⚠️ [checkPlayerCollision] ${spot.id} 스팟의 position이 없습니다.`);
                return;
            }
    
            const distance = spot.mesh.position.distanceTo(playerPos);
            if (distance < 1.5) { // ✅ 감지 거리 (1.5m)
                // console.log(`🚀 ${spot.id} 스팟에 도착! 해당 모델 애니메이션 실행`);
                this.runAnimation(spot.id);
            }
        });
    }
    

    runAnimation(id) {
        const targetModel = this.models.find((model) => model.id === id);
        if (targetModel && targetModel.onEnter) {
            targetModel.onEnter(targetModel.mesh);
        }
    }
}
