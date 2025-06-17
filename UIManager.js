export class UIManager {
    constructor() {
        // 💰 돈 표시
        this.moneyText = document.createElement('div');
        Object.assign(this.moneyText.style, {
            position: 'fixed',
            top: '20px',
            left: '20px',
            padding: '8px 14px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 'bold',
            fontFamily: '"NeoDunggeunmo", sans-serif',
            background: 'rgba(0, 0, 0, 0.6)',
            borderRadius: '12px',
            border: '2px solid #fff',
            boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
            zIndex: '1002',
        });
        document.body.appendChild(this.moneyText);

        // ⏱ 타임바 컨테이너 (상단 중앙)
        this.timeBarContainer = document.createElement('div');
        Object.assign(this.timeBarContainer.style, {
            position: 'fixed',
            top: '0px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            height: '16px',
            background: 'rgba(20, 20, 20, 0.7)',
            borderRadius: '8px',
            border: '1px solid #444',
            overflow: 'hidden',
            boxShadow: '0 0 6px rgba(0,0,0,0.6)',
            zIndex: '1000',
        });
        document.body.appendChild(this.timeBarContainer);

        // 🎯 이벤트 및 경고 오버레이
        this._createEventOverlay(100, 30, 'rgba(255, 50, 50, 0.3)', '1px solid #aa0000');   // 이벤트1
        this._createEventOverlay(200, 30, 'rgba(255, 50, 50, 0.3)', '1px solid #aa0000');   // 이벤트2
        this._createEventOverlay(90, 10, 'rgba(255, 255, 0, 0.3)', '1px solid #aaaa00');    // 경고1
        this._createEventOverlay(190, 10, 'rgba(255, 255, 0, 0.3)', '1px solid #aaaa00');   // 경고2

        // 진행 바
        this.timeBar = document.createElement('div');
        Object.assign(this.timeBar.style, {
            height: '100%',
            width: '0%',
            background: 'linear-gradient(90deg, #00ff88, #00ccff)',
            position: 'absolute',
            left: '0',
            top: '0',
            borderRadius: '8px 0 0 8px',
            transition: 'width 0.2s ease-in-out',
            zIndex: '1001',
        });
        this.timeBarContainer.appendChild(this.timeBar);
    }

    /**
     * 경고/이벤트 오버레이 생성
     */
    _createEventOverlay(startSec, durationSec, color, border) {
        const totalTime = 300;
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'absolute',
            left: `${(startSec / totalTime) * 100}%`,
            width: `${(durationSec / totalTime) * 100}%`,
            height: '100%',
            background: color,
            borderRight: border,
            zIndex: '1000',
            pointerEvents: 'none',
        });
        this.timeBarContainer.appendChild(overlay);
    }

    /**
     * 남은 시간에 따라 타임바 갱신
     */
    updateTimeBar(timeLeft) {
        const totalTime = 300;
        const progress = ((totalTime - timeLeft) / totalTime) * 100;
        this.timeBar.style.width = `${progress}%`;
    }

    /**
     * 돈 UI 갱신
     */
    updateMoney(money) {
        this.moneyText.textContent = `💰 ${money}`;
    }

    /**
     * 닭 위에 배고픔 바 갱신 (옵션)
     */
    updateHoverHunger3D(hunger, x, y) {
        // 이 함수는 존재한다고 가정. 구현체는 프로젝트 요구에 따라 다름
    }

    /**
     * 게임 오버 UI 표시 (옵션)
     */
    showGameOver(chickenCount) {
        const gameOverText = document.createElement('div');
        gameOverText.textContent = `💀 게임 종료! 닭 ${chickenCount}마리 보유`;
        Object.assign(gameOverText.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            fontSize: '24px',
            color: '#fff',
            fontFamily: '"NeoDunggeunmo", sans-serif',
            background: 'rgba(0,0,0,0.8)',
            borderRadius: '12px',
            border: '2px solid #fff',
            zIndex: '1003',
        });
        document.body.appendChild(gameOverText);
    }
}
