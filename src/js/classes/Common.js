// 📌 Common.js (공통 속성 클래스)
export class Common {
    constructor(info = {}) {
        this.info = info;
        this.scene = info.scene;
        this.modelSrc = info.modelSrc;

        this.x = info.x || 0;
        this.y = info.y || 0;
        this.z = info.z || 0;

        this.rotationX = info.rotationX || 0;
        this.rotationY = info.rotationY || 0;
        this.rotationZ = info.rotationZ || 0;

        this.scaleX = info.scaleX || 1;
        this.scaleY = info.scaleY || 1;
        this.scaleZ = info.scaleZ || 1;

        this.loaded = false;
        this.modelMesh = null;
    }

    // ✅ 모델 숨기기
    hideModel() {
        if (this.modelMesh) {
            this.modelMesh.visible = false;
            console.log(`📦 ${this.info.name || "Model"} 모델 숨김`);
        }
    }

    // ✅ 모델 보이기
    showModel() {
        if (this.modelMesh) {
            this.modelMesh.visible = true;
            console.log(`📦 ${this.info.name || "Model"} 모델 표시`);
        }
    }
}
