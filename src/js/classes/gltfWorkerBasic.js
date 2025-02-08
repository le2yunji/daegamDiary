import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

console.log("👷‍♂️ Web Worker 실행됨!");

self.onmessage = async function (event) {
    const { modelSrc } = event.data;

    loader.load(
        modelSrc,
        async (gltf) => {
            const jsonData = gltf.parser.json;
            const buffers = [];

            // ✅ 버퍼 데이터 올바르게 추출
            try {
                const bufferCount = jsonData.buffers?.length || 0;
                for (let i = 0; i < bufferCount; i++) {
                    const buffer = await gltf.parser.getDependency('buffer', i);
                    buffers.push(buffer);
                }
            } catch (error) {
                self.postMessage({ error });
                return;
            }

            let images = [];

            // ✅ 텍스처 데이터 추출 (에러 방지)
            gltf.scene.traverse((child) => {
                if (child.isMesh && child.material?.map?.source?.data) {
                    images.push(child.material.map.source.data);
                }
            });

            // ✅ `buffers` 및 `images`를 함께 전송 (한 번만 실행)
            self.postMessage({ model: jsonData, buffers, images }, buffers);
        },
        undefined,
        (error) => {
            console.error(`❌ [Web Worker] 모델 로드 실패: ${modelSrc}`, error);
            self.postMessage({ error });
        }
    );
};
