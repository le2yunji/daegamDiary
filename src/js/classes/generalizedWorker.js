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
            const images = [];

            try {
                const bufferCount = jsonData.buffers?.length || 0;
                for (let i = 0; i < bufferCount; i++) {
                    const buffer = await gltf.parser.getDependency('buffer', i);
                    if (buffer) buffers.push(buffer);
                }
            } catch (error) {
                console.error("❌ Web Worker: 버퍼 데이터 로드 실패", error);
                self.postMessage({ error });
                return;
            }
            
            try {
                if (jsonData.images && jsonData.images.length > 0) {
                    const loadedImages = new Set();  // 중복 로드 방지

                    for (let i = 0; i < jsonData.images.length; i++) {
                        if (!loadedImages.has(i)) {
                            try {
                                // console.log(`🖼️ 이미지 ${i + 1} 로드 시도`);
                                const imageBuffer = await gltf.parser.getDependency('image', i);
                                // console.log(`✅ 이미지 ${i + 1} 로드 성공`);
                    
                                const mimeType = jsonData.images[i].mimeType || 'image/png';
                                const blob = new Blob([imageBuffer], { type: mimeType });
                                images.push(blob);
                                loadedImages.add(i);
                            } catch (error) {
                                // console.error(`❌ 이미지 ${i + 1} 로드 실패`, error);
                            }
                        }
                    }
                    
                } else {
                    // console.warn("⚠️ 텍스처 이미지가 없습니다.");
                }
            } catch (error) {
                // console.error("❌ Web Worker: 이미지 로드 실패", error);
            }
            
            // 모델, 버퍼, 이미지 데이터 전송
            if (buffers.length > 0) {
                self.postMessage({ model: jsonData, buffers, images }, buffers);
            } else {
                console.error("❌ Web Worker: 버퍼가 비어 있습니다.");
                self.postMessage({ error: "No buffers found" });
            }
        },
        undefined,
        (error) => {
            console.error(`❌ Web Worker: 모델 로드 실패 - ${modelSrc}`, error);
            self.postMessage({ error });
        }
    );
};
