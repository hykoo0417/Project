// UI 생성

export class UIManager {
    constructor() {
        this.moneyEl = document.createElement('div');
        this.timerEl = document.createElement('div');
        this.hoverEl = document.createElement('div');
        this.timeBarContainer = document.createElement('div');
        this.timeBarFill = document.createElement('div');

        // 위치 설정
        Object.assign(this.moneyEl.style, this._baseStyle(), { top: '10px', left: '10px' });
        Object.assign(this.timerEl.style, this._baseStyle(), { top: '40px', left: '10px' });
        Object.assign(this.hoverEl.style, this._baseStyle(), {
            position: 'absolute',
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none'
        });
        this.hoverEl.style.display = 'none';

        // 타임바 스타일
        Object.assign(this.timeBarContainer.style, {
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '400px',
            height: '20px',
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '1px solid white'
        });

        Object.assign(this.timeBarFill.style, {
            width: '0%',
            height: '100%',
            background: '#00ccff',
            transition: 'width 0.1s linear'
        });

        this.timeBarContainer.appendChild(this.timeBarFill);

        document.body.appendChild(this.moneyEl);
        document.body.appendChild(this.timerEl);
        document.body.appendChild(this.hoverEl);
        document.body.appendChild(this.timeBarContainer);
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
        this.moneyEl.innerText = `💰 Money: ${money}`;
        this.timerEl.innerText = `⏱ Time: ${time}s`;

        const maxTime = 300; // 5분 = 300초
        const progress = Math.min(1, time / maxTime);
        this.timeBarFill.style.width = `${progress * 100}%`;
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
}
