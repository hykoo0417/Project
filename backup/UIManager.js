// UI 생성

export class UIManager {
    constructor() {
        this.moneyEl = document.createElement('div');
        this.timerEl = document.createElement('div');
        this.hoverEl = document.createElement('div');
        this.gameOverEl = document.createElement('div');

        Object.assign(this.moneyEl.style, this._baseStyle(), { top: '10px', left: '10px' });
        Object.assign(this.timerEl.style, this._baseStyle(), { top: '40px', left: '10px' });
        Object.assign(this.hoverEl.style, this._baseStyle(), {
            position: 'absolute',
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none'
        });
        this.hoverEl.style.display = 'none';

        Object.assign(this.gameOverEl.style, {
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '20px',
            fontSize: '24px',
            borderRadius: '10px',
            display: 'none',
            zIndex: 999
        });

        document.body.appendChild(this.moneyEl);
        document.body.appendChild(this.timerEl);
        document.body.appendChild(this.hoverEl);
        document.body.appendChild(this.gameOverEl);
    }

    _baseStyle() {
        return {
        position: 'absolute',
        color: 'white',
        background: 'rgba(0,0,0,0.5)',
        padding: '6px 10px',
        fontFamily: 'monospace',
        fontSize: '14px',
        borderRadius: '5px'
        };
    }

    update(money, time) {
        this.moneyEl.innerText = `💰 ${money}`;
        this.timerEl.innerText = `⏱ ${time}s`;
    }
    
    updateHoverHunger3D(hunger, screenX, screenY) {
        if (hunger != null) {
            this.hoverEl.innerText = `🍗 ${Math.floor(hunger)}`;
            this.hoverEl.style.left = `${screenX}px`;
            this.hoverEl.style.top = `${screenY}px`;
            this.hoverEl.style.display = 'block';
        } else {
            this.hoverEl.style.display = 'none';
        }
    }

    showGameOver(chickenCount){
        this.gameOverEl.innerText = `Game Over!\n${chickenCount} Chickens survived`;
        this.gameOverEl.style.display = 'block';
    }

}