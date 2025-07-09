// 贪吃蛇游戏 - 带用户名和排行榜功能
class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 游戏配置
        this.gridSize = 20;
        this.tileCountX = this.canvas.width / this.gridSize;   // 宽度瓦片数：30
        this.tileCountY = this.canvas.height / this.gridSize;  // 高度瓦片数：20
        this.tileCount = this.tileCountX; // 保持向后兼容
        
        // 游戏状态
        this.snake = [
            {x: 10, y: 10}
        ];
        this.food = null;
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameStarted = false;
        this.gameOver = false;
        this.playerName = '';
        
        // 初始化
        this.generateFood(); // 确保食物生成
        this.setupControls();
        this.setupUI();
        this.loadLeaderboard();
        this.updateScore();
        
        console.log('游戏初始化完成，食物位置:', this.food);
        
        // 显示初始界面
        console.log('准备显示初始界面，食物状态:', this.food);
        this.draw();
        this.showStartScreen();
    }
    
    setupUI() {
        // 设置开始按钮
        const startButton = document.getElementById('startButton');
        const playerNameInput = document.getElementById('playerName');
        const toggleLeaderboardBtn = document.getElementById('toggleLeaderboard');
        
        startButton.addEventListener('click', () => {
            const name = playerNameInput.value.trim();
            if (name) {
                this.startGameWithPlayer(name);
            } else {
                alert('请输入用户名！');
                playerNameInput.focus();
            }
        });
        
        playerNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                startButton.click();
            }
        });
        
        // 排行榜切换
        let leaderboardVisible = true;
        toggleLeaderboardBtn.addEventListener('click', () => {
            const leaderboardList = document.getElementById('leaderboardList');
            leaderboardVisible = !leaderboardVisible;
            leaderboardList.style.display = leaderboardVisible ? 'block' : 'none';
            toggleLeaderboardBtn.textContent = leaderboardVisible ? '隐藏排行榜' : '显示排行榜';
        });
        
        // 默认焦点在用户名输入框
        playerNameInput.focus();
    }
    
    startGameWithPlayer(playerName) {
        this.playerName = playerName;
        document.getElementById('currentPlayer').textContent = playerName;
        
        // 隐藏用户名输入，显示游戏界面
        document.getElementById('nameInput').style.display = 'none';
        document.getElementById('gameInfo').style.display = 'block';
        document.getElementById('gameArea').style.display = 'block';
        document.getElementById('controls').style.display = 'block';
        document.getElementById('mobileControls').style.display = window.innerWidth <= 768 ? 'block' : 'none';
        
        // 重置游戏状态
        this.resetGame();
        this.loadHighScore();
        
        console.log(`玩家 ${playerName} 开始游戏`);
    }
    
    resetGame() {
        this.snake = [{x: 10, y: 10}];
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameStarted = false;
        this.gameOver = false;
        
        if (this.gameLoopTimeout) {
            clearTimeout(this.gameLoopTimeout);
            this.gameLoopTimeout = null;
        }
        
        this.generateFood();
        console.log('重置游戏后食物位置:', this.food);
        this.updateScore();
        this.draw();
        this.showStartScreen();
    }
    
    generateFood() {
        let attempts = 0;
        const maxAttempts = 100;
        
        do {
            this.food = {
                x: Math.floor(Math.random() * this.tileCountX),  // 使用正确的宽度范围：0-29
                y: Math.floor(Math.random() * this.tileCountY)   // 使用正确的高度范围：0-19
            };
            
            attempts++;
            
            let foodOnSnake = false;
            for (let segment of this.snake) {
                if (segment.x === this.food.x && segment.y === this.food.y) {
                    foodOnSnake = true;
                    break;
                }
            }
            
            if (!foodOnSnake) {
                console.log(`食物生成成功: (${this.food.x}, ${this.food.y}), 游戏区域: ${this.tileCountX}x${this.tileCountY}, 尝试次数: ${attempts}`);
                return;
            }
            
            if (attempts >= maxAttempts) {
                console.warn('食物生成达到最大尝试次数，强制生成');
                this.food = {
                    x: this.tileCountX - 1,  // x最大值：29
                    y: this.tileCountY - 1   // y最大值：19
                };
                console.log(`强制生成食物: (${this.food.x}, ${this.food.y})`);
                return;
            }
        } while (attempts < maxAttempts);
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.playerName) return; // 未输入用户名时不响应游戏控制
            
            if (!this.gameStarted && !this.gameOver) {
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
                    this.startGame();
                    this.changeDirection(e.code);
                }
                return;
            }
            
            if (this.gameOver && e.code === 'Space') {
                this.restartGame();
                return;
            }
            
            if (this.gameStarted && !this.gameOver) {
                this.changeDirection(e.code);
            }
        });
        
        // 移动端按钮控制
        const buttons = ['up', 'down', 'left', 'right'];
        const directions = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        
        buttons.forEach((buttonId, index) => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', () => {
                    if (!this.playerName) return;
                    
                    if (!this.gameStarted && !this.gameOver) {
                        this.startGame();
                        this.changeDirection(directions[index]);
                    } else if (this.gameStarted && !this.gameOver) {
                        this.changeDirection(directions[index]);
                    }
                });
            }
        });
    }
    
    changeDirection(keyCode) {
        const goingUp = this.dy === -1;
        const goingDown = this.dy === 1;
        const goingRight = this.dx === 1;
        const goingLeft = this.dx === -1;
        
        if ((keyCode === 'ArrowLeft' || keyCode === 'KeyA') && !goingRight) {
            this.dx = -1;
            this.dy = 0;
        }
        if ((keyCode === 'ArrowUp' || keyCode === 'KeyW') && !goingDown) {
            this.dx = 0;
            this.dy = -1;
        }
        if ((keyCode === 'ArrowRight' || keyCode === 'KeyD') && !goingLeft) {
            this.dx = 1;
            this.dy = 0;
        }
        if ((keyCode === 'ArrowDown' || keyCode === 'KeyS') && !goingUp) {
            this.dx = 0;
            this.dy = 1;
        }
    }
    
    startGame() {
        this.gameStarted = true;
        this.gameLoop();
    }
    
    gameLoop() {
        if (this.gameOver) return;
        
        this.gameLoopTimeout = setTimeout(() => {
            if (this.gameOver) return;
            
            this.clearCanvas();
            this.moveSnake();
            
            if (this.gameOver) {
                this.draw();
                return;
            }
            
            this.draw();
            
            if (!this.gameOver) {
                this.gameLoop();
            }
        }, Math.max(80, 150 - Math.floor(this.score / 50) * 10));
    }
    
    clearCanvas() {
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    moveSnake() {
        if (this.gameOver) return;
        
        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        
        // 检测撞墙
        if (head.x < 0 || head.x >= this.tileCountX || head.y < 0 || head.y >= this.tileCountY) {
            console.log(`撞墙了！坐标: (${head.x}, ${head.y}), 游戏区域: 0-${this.tileCountX-1} x 0-${this.tileCountY-1}`);
            this.gameOver = true; // 立即设置游戏结束状态
            this.endGame();
            return;
        }
        
        // 检测撞到自己
        for (let segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                console.log('撞到自己了！游戏结束');
                this.gameOver = true; // 立即设置游戏结束状态
                this.endGame();
                return;
            }
        }
        
        this.snake.unshift(head);
        
        // 检测是否吃到食物
        if (head.x === this.food.x && head.y === this.food.y) {
            console.log(`吃到食物！位置: (${this.food.x}, ${this.food.y}), 新得分: ${this.score + 10}`);
            this.score += 10;
            this.updateScore();
            this.generateFood();
        } else {
            this.snake.pop();
        }
    }
    
    draw() {
        this.drawGrid();
        this.drawFood();
        this.drawSnake();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = '#34495e';
        this.ctx.lineWidth = 1;
        
        // 绘制垂直线
        for (let i = 0; i <= this.tileCountX; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
        }
        
        // 绘制水平线
        for (let i = 0; i <= this.tileCountY; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
    }
    
    drawSnake() {
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                this.ctx.fillStyle = '#27ae60';
                this.ctx.fillRect(segment.x * this.gridSize + 1, segment.y * this.gridSize + 1, 
                                this.gridSize - 2, this.gridSize - 2);
                
                this.ctx.fillStyle = '#ffffff';
                const eyeSize = 3;
                this.ctx.beginPath();
                this.ctx.arc(segment.x * this.gridSize + 6, segment.y * this.gridSize + 6, eyeSize, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.beginPath();
                this.ctx.arc(segment.x * this.gridSize + 14, segment.y * this.gridSize + 6, eyeSize, 0, 2 * Math.PI);
                this.ctx.fill();
            } else {
                this.ctx.fillStyle = '#2ecc71';
                this.ctx.fillRect(segment.x * this.gridSize + 2, segment.y * this.gridSize + 2, 
                                this.gridSize - 4, this.gridSize - 4);
            }
        });
    }
    
    drawFood() {
        if (!this.food || this.food.x === undefined || this.food.y === undefined) {
            console.error('食物对象无效，重新生成');
            this.generateFood();
            return;
        }
        
        if (this.food.x < 0 || this.food.x >= this.tileCountX || 
            this.food.y < 0 || this.food.y >= this.tileCountY) {
            console.error(`食物坐标超出范围: (${this.food.x}, ${this.food.y}), 游戏区域: ${this.tileCountX}x${this.tileCountY}, 重新生成`);
            this.generateFood();
            return;
        }
        
        console.log(`绘制食物在位置: (${this.food.x}, ${this.food.y})`);
        
        // 绘制更明显的红色苹果
        this.ctx.fillStyle = '#e74c3c'; // 深红色底色
        this.ctx.fillRect(this.food.x * this.gridSize + 1, this.food.y * this.gridSize + 1, 
                         this.gridSize - 2, this.gridSize - 2);
        
        this.ctx.fillStyle = '#ff6b6b'; // 浅红色高光
        this.ctx.fillRect(this.food.x * this.gridSize + 3, this.food.y * this.gridSize + 3, 
                         this.gridSize - 6, this.gridSize - 6);
        
        // 绿色茎
        this.ctx.fillStyle = '#27ae60';
        this.ctx.fillRect(this.food.x * this.gridSize + this.gridSize/2 - 1, this.food.y * this.gridSize + 1, 
                         2, 4);
    }
    
    showStartScreen() {
        this.clearCanvas();
        this.draw(); // 先绘制游戏元素（蛇和食物）
        
        // 绘制半透明遮罩，但不完全覆盖
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 重新绘制食物确保可见
        if (this.food) {
            this.drawFood();
        }
        
        this.ctx.fillStyle = '#27ae60';
        this.ctx.font = 'bold 28px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`欢迎 ${this.playerName}!`, this.canvas.width / 2, this.canvas.height / 2 - 40);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '18px Arial';
        this.ctx.fillText('按任意方向键开始游戏', this.canvas.width / 2, this.canvas.height / 2 + 10);
        
        this.ctx.fillStyle = '#ecf0f1';
        this.ctx.font = '14px Arial';
        this.ctx.fillText('使用方向键或WASD控制移动', this.canvas.width / 2, this.canvas.height / 2 + 40);
    }
    
    endGame() {
        console.log('endGame 被调用，游戏立即结束');
        this.gameOver = true;
        this.gameStarted = false; // 确保游戏状态完全重置
        
        // 立即清除游戏循环
        if (this.gameLoopTimeout) {
            clearTimeout(this.gameLoopTimeout);
            this.gameLoopTimeout = null;
        }
        
        this.saveToLeaderboard();
        this.loadHighScore();
        
        // 立即显示游戏结束画面
        this.showGameOverScreen();
    }
    
    showGameOverScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('游戏结束!', this.canvas.width / 2, this.canvas.height / 2 - 80);
        
        this.ctx.fillStyle = '#f39c12';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`玩家: ${this.playerName}`, this.canvas.width / 2, this.canvas.height / 2 - 45);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`得分: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 - 10);
        
        const rank = this.getPlayerRank();
        if (rank > 0) {
            this.ctx.fillStyle = '#2ecc71';
            this.ctx.font = '16px Arial';
            this.ctx.fillText(`排名: 第 ${rank} 名`, this.canvas.width / 2, this.canvas.height / 2 + 25);
        }
        
        this.ctx.fillStyle = '#ecf0f1';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('按空格键重新开始', this.canvas.width / 2, this.canvas.height / 2 + 55);
    }
    
    restartGame() {
        console.log('重新开始游戏');
        this.resetGame();
    }
    
    updateScore() {
        document.getElementById('score').textContent = this.score;
    }
    
    loadHighScore() {
        const leaderboard = this.getLeaderboard();
        const highScore = leaderboard.length > 0 ? leaderboard[0].score : 0;
        document.getElementById('high-score').textContent = highScore;
    }
    
    // 排行榜功能
    getLeaderboard() {
        const leaderboard = localStorage.getItem('snakeLeaderboard');
        return leaderboard ? JSON.parse(leaderboard) : [];
    }
    
    saveToLeaderboard() {
        const leaderboard = this.getLeaderboard();
        const newRecord = {
            name: this.playerName,
            score: this.score,
            date: new Date().toLocaleDateString('zh-CN')
        };
        
        leaderboard.push(newRecord);
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard.splice(20); // 只保留前20名
        
        localStorage.setItem('snakeLeaderboard', JSON.stringify(leaderboard));
        this.displayLeaderboard();
        
        console.log('成绩已保存到排行榜:', newRecord);
    }
    
    loadLeaderboard() {
        this.displayLeaderboard();
    }
    
    displayLeaderboard() {
        const leaderboard = this.getLeaderboard();
        const content = document.getElementById('leaderboardContent');
        
        if (leaderboard.length === 0) {
            content.innerHTML = '<div style="text-align: center; padding: 20px; opacity: 0.7;">暂无记录</div>';
            return;
        }
        
        content.innerHTML = leaderboard.map((record, index) => `
            <div class="leaderboard-item">
                <span class="rank">${index + 1}</span>
                <span class="name">${record.name}</span>
                <span class="score">${record.score}</span>
                <span class="date">${record.date}</span>
            </div>
        `).join('');
    }
    
    getPlayerRank() {
        const leaderboard = this.getLeaderboard();
        for (let i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i].name === this.playerName && leaderboard[i].score === this.score) {
                return i + 1;
            }
        }
        return 0;
    }
}

// 启动游戏
window.addEventListener('load', () => {
    new SnakeGame();
});

// 防止页面滚动
document.addEventListener('keydown', function(e) {
    if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false); 