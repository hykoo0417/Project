export class UIManager {
    constructor() {
        // 💰 돈 표시 (왼쪽 상단 - 작고 더 투명하게)
        this.moneyText = document.createElement('div');
        Object.assign(this.moneyText.style, {
            position: 'fixed',
            top: '20px',
            left: '20px',
            padding: '6px 10px',
            color: '#fff',
            fontSize: '14px',
            fontFamily: 'Segoe UI, sans-serif',
            background: 'rgba(0, 0, 0, 0.4)', // 투명도 더 증가
            borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            zIndex: '1000',
        });
        document.body.appendChild(this.moneyText);

        // 🐔 배고픔 표시 (말풍선)
        this.hoverHungerText = document.createElement('div');
        Object.assign(this.hoverHungerText.style, {
            position: 'fixed',
            padding: '6px 10px',
            color: '#fff',
            backgroundColor: 'rgba(220, 53, 69, 0.85)',
            fontSize: '14px',
            fontFamily: 'Segoe UI, sans-serif',
            borderRadius: '6px',
            pointerEvents: 'none',
            display: 'none',
            zIndex: '1000',
        });
        document.body.appendChild(this.hoverHungerText);

        // 💀 게임 오버 메시지 (가운데 - 텍스트 줄바꿈/정렬)
        this.gameOverText = document.createElement('div');
        Object.assign(this.gameOverText.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#fff',
            fontSize: '36px',
            fontWeight: 'bold',
            fontFamily: 'Segoe UI, sans-serif',
            background: 'rgba(0, 0, 0, 0.75)',
            padding: '20px 30px',
            borderRadius: '16px',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
            zIndex: '2000',
            display: 'none',
            maxWidth: '90vw',
            textAlign: 'center',
            wordBreak: 'keep-all',
            lineHeight: '1.5',
        });
        document.body.appendChild(this.gameOverText);

        // 🕒 타임 바
        this.timeBarContainer = document.createElement('div');
        Object.assign(this.timeBarContainer.style, {
            position: 'fixed',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            height: '14px',
            backgroundColor: '#eee',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '1px solid #ccc',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
            zIndex: '1000',
        });

        this.timeBar = document.createElement('div');
        Object.assign(this.timeBar.style, {
            height: '100%',
            width: '100%',
            background: 'linear-gradient(to right, #00c6ff, #0072ff)',
            transition: 'width 0.1s ease-in-out',
        });

        this.timeBarContainer.appendChild(this.timeBar);
        document.body.appendChild(this.timeBarContainer);
    }

    update(money, time) {
        this.moneyText.textContent = `💰 ${money.toLocaleString()} G`;
    }

    updateHoverHunger3D(hunger, x, y) {
        if (hunger === null) {
            this.hoverHungerText.style.display = 'none';
        } else {
            this.hoverHungerText.style.display = 'block';
            this.hoverHungerText.style.left = `${x}px`;
            this.hoverHungerText.style.top = `${y - 30}px`;
            this.hoverHungerText.textContent = `배고픔: ${Math.floor(hunger)}`;
        }
    }

    updateTimeBar(ratio) {
        this.timeBar.style.width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
    }

    showGameOver(chickenCount) {
        this.gameOverText.innerHTML = `💀 게임 오버<br>남은 닭: ${chickenCount}마리`;
        this.gameOverText.style.display = 'block';
    }

    removeTimeBar() {
        if (this.timeBarContainer && this.timeBarContainer.parentNode) {
            this.timeBarContainer.parentNode.removeChild(this.timeBarContainer);
        }
    }
}
