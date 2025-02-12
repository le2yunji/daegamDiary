import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
console.log("👷‍♂️ Web Worker 실행됨!");

self.onmessage = async function (event) {
    const { modelSrc } = event.data;

    console.log("👷‍♂️ Web Worker에서 GLB 파일 로드 시작");

    try {
        const response = await fetch(modelSrc);
        const arrayBuffer = await response.arrayBuffer();

        console.log("✅ Web Worker: GLB 파일 로드 완료, ArrayBuffer 전송");
        self.postMessage({ arrayBuffer }, [arrayBuffer]);
    } catch (error) {
        console.error(`❌ Web Worker: GLB 파일 로드 실패: ${error.message}`);
        self.postMessage({ error: error.message });
    }
};
