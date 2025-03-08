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

            try {
                const bufferCount = jsonData.buffers?.length || 0;
                for (let i = 0; i < bufferCount; i++) {
                    const buffer = await gltf.parser.getDependency('buffer', i);
                    buffers.push(buffer);
                }
            } catch (error) {
                // console.error("❌ [Web Worker] 버퍼 데이터 로드 실패:", error);
                self.postMessage({ error });
                return;
            }

            let images = [];
            if (jsonData.images && jsonData.images.length > 0) {
                try {
                    for (let i = 0; i < jsonData.images.length; i++) {
                        const imageBuffer = await gltf.parser.getDependency('image', i);
                        const mimeType = jsonData.images[i].mimeType || 'image/png';
                        const blob = new Blob([imageBuffer], { type: mimeType });
                        images.push(blob);
                    }
                } catch (error) {
                    // console.error("❌ [Web Worker] 이미지 데이터 로드 실패:", error);
                }
            } else {
                // console.warn("⚠️ [Web Worker] 이미지가 없는 모델입니다.");
            }
            self.postMessage({ model: jsonData, buffers, images }, buffers);
        },
        undefined,
        (error) => {
            self.postMessage({ error });
        }
    );
};
