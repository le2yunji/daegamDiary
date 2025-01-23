document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-button");
    const startScreen = document.getElementById("start-screen");
    const canvas = document.getElementById("three-canvas");
    
    if (startButton && startScreen && canvas) {
        startButton.addEventListener("click", () => {
            startScreen.style.display = "none";
            canvas.style.display = "block";

            console.log("게임이 시작되었습니다!");
        });
    } else {
        console.error("시작 버튼, 시작 화면 또는 캔버스 요소를 찾을 수 없습니다.");
    }
});
