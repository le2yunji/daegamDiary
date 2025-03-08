import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

self.onmessage = async function (event) {
    const { modelSrc } = event.data;

    try {
        const response = await fetch(modelSrc);
        const arrayBuffer = await response.arrayBuffer();

        self.postMessage({ arrayBuffer }, [arrayBuffer]);
    } catch (error) {
        self.postMessage({ error: error.message });
    }
};
