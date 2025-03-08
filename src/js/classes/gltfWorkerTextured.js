import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

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
            const blob = new Blob([buffers[0]], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);

            let images = [];

            // ✅ 텍스처 데이터 추출 (에러 방지)
            gltf.scene.traverse((child) => {
                if (child.isMesh && child.material?.map?.source?.data) {
                    images.push(child.material.map.source.data);

                }
            });

            // ✅ `buffers` 및 `images`를 함께 전송 (한 번만 실행)
            self.postMessage({ model: jsonData, buffers, images }, buffers);

  
            // 최소 5초 유지 후 메모리 정리
            setTimeout(() => {
                // console.log(`🧹 Blob URL 해제: ${url}`);
                URL.revokeObjectURL(url);
            }, 5000);
    
        },
        undefined,
        (error) => {
            // console.error(`❌ [Web Worker] 모델 로드 실패: ${modelSrc}`, error);
            self.postMessage({ error });
        }
    );
};
