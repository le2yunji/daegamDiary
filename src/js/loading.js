document.addEventListener("DOMContentLoaded", () => {
    const loadingScreen = document.getElementById("loading-screen");
    const startScreen = document.getElementById("start-screen");

    if (loadingScreen && startScreen) {
        setTimeout(() => {
            loadingScreen.style.display = "none";
            startScreen.style.display = "block";
        }, 3000); // 3초 후 시작 화면 표시
    } else {
        console.error("로딩 화면 또는 시작 화면 요소를 찾을 수 없습니다.");
    }
});
