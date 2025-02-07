import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

console.log("👷‍♂️ Web Worker 실행됨!");

self.onmessage = function(event) {
    console.log(`📩 [Web Worker] 모델 로드 요청 수신:`, event.data);

    const { modelSrc, id } = event.data;

    loader.load(modelSrc, 
        (gltf) => {
            // ✅ 모델 메시에서 캐스팅 가능한 쉐도우 설정
            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                }
            });

            console.log(`✅ [Web Worker] 모델 로드 완료: ${modelSrc}`);

            // ✅ Three.js Object3D는 직접 postMessage()로 전달할 수 없으므로 JSON으로 변환
            const serializedModel = gltf.scene.toJSON();

            self.postMessage({ id, model: serializedModel });
        }, 
        undefined, 
        (error) => {
            console.error(`❌ [Web Worker] 모델 로드 실패: ${modelSrc}`, error);
            self.postMessage({ id, error });
        }
    );
};
