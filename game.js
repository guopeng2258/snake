// 贪吃蛇游戏 - 带用户名和排行榜功能
class SnakeGame {
    loadAppleImage() {
        this.appleImage = new Image();
        this.appleImage.onload = () => {
            this.appleImageLoaded = true;
            console.log('苹果SVG图片加载成功');
        };
        this.appleImage.onerror = () => {
            console.log('苹果图片加载失败，使用Canvas绘制');
            this.appleImageLoaded = false;
        };
        // 使用本地SVG文件
        this.appleImage.src = 'apple.svg';
    }
    
    loadSnakeHeadImage() {
        this.snakeHeadImage = new Image();
        this.snakeHeadImage.onload = () => {
            this.snakeHeadImageLoaded = true;
            console.log('蛇头图片加载成功');
        };
        this.snakeHeadImage.onerror = () => {
            console.log('蛇头图片加载失败，使用Canvas绘制');
            this.snakeHeadImageLoaded = false;
        };
        
        // 首先检查是否有保存的自定义图片
        const savedImage = localStorage.getItem('customSnakeHead');
        if (savedImage) {
            this.snakeHeadImage.src = savedImage;
            console.log('加载自定义蛇头图片');
        } else {
            // 尝试加载像素图片，如果不存在则回退到SVG
            this.snakeHeadImage.src = 'snake-head.png';
            
            // 如果PNG加载失败，尝试SVG
            this.snakeHeadImage.onerror = () => {
                console.log('PNG图片不存在，尝试加载SVG');
                this.snakeHeadImage.onerror = () => {
                    console.log('所有图片加载失败，使用Canvas绘制');
                    this.snakeHeadImageLoaded = false;
                };
                this.snakeHeadImage.src = 'snake-head-game.svg';
            };
        }
    }
    
    // 添加文件上传功能
    setupImageUpload() {
        // 创建隐藏的文件输入元素
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        fileInput.id = 'snakeHeadUpload';
        document.body.appendChild(fileInput);
        
        // 创建上传按钮
        const uploadBtn = document.createElement('button');
        uploadBtn.textContent = '🐍 上传蛇头图片';
        uploadBtn.className = 'upload-btn';
        uploadBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 8px 12px;
            background: linear-gradient(45deg, #4caf50, #66bb6a);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;
        
        uploadBtn.onmouseover = () => {
            uploadBtn.style.transform = 'translateY(-2px)';
            uploadBtn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        };
        
        uploadBtn.onmouseout = () => {
            uploadBtn.style.transform = 'translateY(0)';
            uploadBtn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        };
        
        uploadBtn.onclick = () => fileInput.click();
        
        // 将按钮添加到游戏容器
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer) {
            gameContainer.style.position = 'relative';
            gameContainer.appendChild(uploadBtn);
        }
        
        // 处理文件选择
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    // 更新蛇头图片
                    this.snakeHeadImage.src = event.target.result;
                    this.snakeHeadImageLoaded = true;
                    
                    // 保存到本地存储
                    localStorage.setItem('customSnakeHead', event.target.result);
                    console.log('蛇头图片已更新');
                    
                    // 显示成功提示
                    uploadBtn.textContent = '✅ 图片已更新';
                    setTimeout(() => {
                        uploadBtn.textContent = '🐍 上传蛇头图片';
                    }, 2000);
                };
                reader.readAsDataURL(file);
            } else {
                alert('请选择有效的图片文件！');
            }
        };
        
        // 添加重置按钮
        const resetBtn = document.createElement('button');
        resetBtn.textContent = '🔄 重置蛇头';
        resetBtn.className = 'reset-btn';
        resetBtn.style.cssText = `
            position: absolute;
            top: 50px;
            right: 10px;
            padding: 6px 10px;
            background: linear-gradient(45deg, #ff5722, #ff7043);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 11px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;
        
        resetBtn.onmouseover = () => {
            resetBtn.style.transform = 'translateY(-1px)';
        };
        
        resetBtn.onmouseout = () => {
            resetBtn.style.transform = 'translateY(0)';
        };
        
        resetBtn.onclick = () => {
            localStorage.removeItem('customSnakeHead');
            this.snakeHeadImageLoaded = false;
            this.snakeHeadImage.src = 'snake-head-game.svg';
            console.log('已重置为默认蛇头');
            
            resetBtn.textContent = '✅ 已重置';
            setTimeout(() => {
                resetBtn.textContent = '🔄 重置蛇头';
            }, 1500);
        };
        
        if (gameContainer) {
            gameContainer.appendChild(resetBtn);
        }
    }

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
        
        // 苹果图片相关
        this.appleImage = null;
        this.appleImageLoaded = false;
        
        // 蛇头图片相关
        this.snakeHeadImage = null;
        this.snakeHeadImageLoaded = false;
        
        // 蛇动画相关
        this.animationFrame = 0;
        this.lastBlinkTime = 0;
        
        // 初始化
        this.loadAppleImage(); // 加载苹果图片
        this.loadSnakeHeadImage(); // 加载蛇头图片
        this.generateFood(); // 确保食物生成
        this.setupControls();
        this.setupUI();
        this.setupImageUpload(); // 设置图片上传功能
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
            
            // 更新动画帧
            this.animationFrame++;
            
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
        // 先绘制蛇身（除了头部）
        for (let i = 1; i < this.snake.length; i++) {
            const segment = this.snake[i];
            this.drawSnakeBody(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize, i);
        }
        
        // 最后绘制蛇头（确保在最上层，且比身体大）
        if (this.snake.length > 0) {
            const head = this.snake[0];
            const headSize = this.gridSize * 1.3; // 蛇头比身体大30%
            const offset = (headSize - this.gridSize) / 2; // 居中偏移
            this.drawSnakeHead(
                head.x * this.gridSize - offset, 
                head.y * this.gridSize - offset, 
                headSize
            );
        }
    }
    
    drawSnakeHead(x, y, size) {
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        
        // 优先使用图片，失败则使用Canvas绘制
        if (this.snakeHeadImageLoaded && this.snakeHeadImage) {
            this.ctx.save();
            
            // 根据移动方向旋转蛇头图片
            this.ctx.translate(centerX, centerY);
            if (this.dx === 1) this.ctx.rotate(0); // 右
            else if (this.dx === -1) this.ctx.rotate(Math.PI); // 左
            else if (this.dy === 1) this.ctx.rotate(Math.PI / 2); // 下
            else if (this.dy === -1) this.ctx.rotate(-Math.PI / 2); // 上
            
            // 绘制蛇头图片
            this.ctx.drawImage(
                this.snakeHeadImage,
                -size / 2, -size / 2,
                size, size
            );
            
            this.ctx.restore();
            return;
        }
        
        // 图片加载失败时使用Canvas绘制
        this.ctx.save();
        
        // 根据移动方向旋转蛇头
        this.ctx.translate(centerX, centerY);
        if (this.dx === 1) this.ctx.rotate(0); // 右
        else if (this.dx === -1) this.ctx.rotate(Math.PI); // 左
        else if (this.dy === 1) this.ctx.rotate(Math.PI / 2); // 下
        else if (this.dy === -1) this.ctx.rotate(-Math.PI / 2); // 上
        
        // 绘制蛇头主体（更具体的形状）
        const headWidth = size * 0.85;
        const headHeight = size * 0.7;
        
        // 蛇头渐变
        const headGradient = this.ctx.createRadialGradient(-headWidth * 0.2, -headHeight * 0.2, 0, 0, 0, headWidth * 0.6);
        headGradient.addColorStop(0, '#66bb6a'); // 高光
        headGradient.addColorStop(0.4, '#4caf50'); // 主色
        headGradient.addColorStop(0.8, '#388e3c'); // 过渡
        headGradient.addColorStop(1, '#2e7d32'); // 阴影
        
        this.ctx.fillStyle = headGradient;
        this.ctx.beginPath();
        
        // 绘制更真实的蛇头形状（尖锐的前端，圆润的后端）
        this.ctx.moveTo(headWidth * 0.4, 0); // 头部尖端
        this.ctx.quadraticCurveTo(headWidth * 0.3, -headHeight * 0.25, 0, -headHeight * 0.3); // 右上侧
        this.ctx.quadraticCurveTo(-headWidth * 0.35, -headHeight * 0.35, -headWidth * 0.4, -headHeight * 0.1); // 后脑勺右侧
        this.ctx.quadraticCurveTo(-headWidth * 0.45, 0, -headWidth * 0.4, headHeight * 0.1); // 左侧
        this.ctx.quadraticCurveTo(-headWidth * 0.35, headHeight * 0.35, 0, headHeight * 0.3); // 左下侧
        this.ctx.quadraticCurveTo(headWidth * 0.3, headHeight * 0.25, headWidth * 0.4, 0); // 回到起点
        
        this.ctx.fill();
        
        // 绘制蛇头纹理（菱形斑纹）
        this.ctx.fillStyle = 'rgba(46, 125, 50, 0.6)';
        this.drawDiamondPattern(-headWidth * 0.15, -headHeight * 0.15, headWidth * 0.12);
        this.drawDiamondPattern(-headWidth * 0.15, headHeight * 0.05, headWidth * 0.1);
        this.drawDiamondPattern(-headWidth * 0.25, 0, headWidth * 0.08);
        
        // 绘制眼睛（带眨眼动画）
        const currentTime = Date.now();
        const shouldBlink = (currentTime - this.lastBlinkTime) % 3000 < 200;
        
        const eyeSize = headWidth * 0.12;
        const eyeY = -headHeight * 0.08;
        
        if (shouldBlink) {
            // 眨眼状态
            this.ctx.fillStyle = '#2e7d32';
            this.ctx.beginPath();
            this.ctx.ellipse(-headWidth * 0.15, eyeY, eyeSize, eyeSize * 0.3, 0, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.ellipse(headWidth * 0.15, eyeY, eyeSize, eyeSize * 0.3, 0, 0, Math.PI * 2);
            this.ctx.fill();
        } else {
            // 绘制立体眼睛
            this.drawEye(-headWidth * 0.15, eyeY, eyeSize);
            this.drawEye(headWidth * 0.15, eyeY, eyeSize);
        }
        
        // 绘制鼻孔
        this.ctx.fillStyle = '#1b5e20';
        this.ctx.beginPath();
        this.ctx.ellipse(-headWidth * 0.05, headHeight * 0.15, headWidth * 0.02, headWidth * 0.01, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.ellipse(headWidth * 0.05, headHeight * 0.15, headWidth * 0.02, headWidth * 0.01, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 绘制嘴巴线条
        this.ctx.strokeStyle = '#2e7d32';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.moveTo(-headWidth * 0.08, headHeight * 0.22);
        this.ctx.quadraticCurveTo(0, headHeight * 0.28, headWidth * 0.08, headHeight * 0.22);
        this.ctx.stroke();
        
        // 偶尔绘制舌头
        if (this.animationFrame % 100 < 5) { // 更稳定的舌头显示
            this.ctx.fillStyle = '#f44336';
            this.ctx.beginPath();
            this.ctx.ellipse(0, headHeight * 0.35, headWidth * 0.04, headHeight * 0.15, 0, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 舌头分叉
            this.ctx.beginPath();
            this.ctx.ellipse(-headWidth * 0.02, headHeight * 0.42, headWidth * 0.015, headHeight * 0.08, 0, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.ellipse(headWidth * 0.02, headHeight * 0.42, headWidth * 0.015, headHeight * 0.08, 0, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
    
    drawEye(x, y, size) {
        // 眼眶阴影
        this.ctx.fillStyle = 'rgba(46, 125, 50, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(x, y + size * 0.1, size * 1.1, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 眼球
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 虹膜
        this.ctx.fillStyle = '#2e7d32';
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 0.7, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 瞳孔
        this.ctx.fillStyle = '#000000';
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 高光
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(x - size * 0.2, y - size * 0.2, size * 0.15, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 小高光
        this.ctx.beginPath();
        this.ctx.arc(x + size * 0.3, y - size * 0.1, size * 0.08, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawDiamondPattern(x, y, size) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - size);
        this.ctx.lineTo(x + size, y);
        this.ctx.lineTo(x, y + size);
        this.ctx.lineTo(x - size, y);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawSnakeBody(x, y, size, segmentIndex) {
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        const bodyRadius = size * 0.4; // 身体半径
        
        this.ctx.save();
        
        // 蛇身渐变色（从头到尾颜色逐渐变深）
        const intensity = Math.max(0.7, 1 - (segmentIndex - 1) * 0.03);
        
        // 绘制蛇身主体（简洁的圆形）
        const bodyGradient = this.ctx.createRadialGradient(
            centerX - bodyRadius * 0.3, centerY - bodyRadius * 0.3, 0,
            centerX, centerY, bodyRadius
        );
        
        bodyGradient.addColorStop(0, `rgba(102, 187, 106, ${intensity})`); // 高光
        bodyGradient.addColorStop(0.5, `rgba(76, 175, 80, ${intensity})`); // 主色
        bodyGradient.addColorStop(1, `rgba(56, 142, 60, ${intensity})`); // 边缘
        
        this.ctx.fillStyle = bodyGradient;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, bodyRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 绘制简单的身体纹理（环形条纹）
        this.ctx.strokeStyle = `rgba(46, 125, 50, ${intensity * 0.6})`;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, bodyRadius * 0.7, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // 绘制外边框
        this.ctx.strokeStyle = `rgba(46, 125, 50, ${intensity * 0.8})`;
        this.ctx.lineWidth = 0.5;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, bodyRadius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // 添加简单的鳞片效果
        this.ctx.fillStyle = `rgba(129, 199, 132, ${intensity * 0.4})`;
        const dotCount = 4;
        for (let i = 0; i < dotCount; i++) {
            const angle = (i * Math.PI * 2) / dotCount + segmentIndex * 0.3;
            const dotX = centerX + Math.cos(angle) * bodyRadius * 0.5;
            const dotY = centerY + Math.sin(angle) * bodyRadius * 0.5;
            
            this.ctx.beginPath();
            this.ctx.arc(dotX, dotY, bodyRadius * 0.08, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.restore();
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
        
        const x = this.food.x * this.gridSize;
        const y = this.food.y * this.gridSize;
        
        // 优先使用图片，失败则使用Canvas绘制
        if (this.appleImageLoaded && this.appleImage) {
            // 使用图片绘制苹果
            this.ctx.drawImage(
                this.appleImage, 
                x + 2, y + 2, 
                this.gridSize - 4, this.gridSize - 4
            );
        } else {
            // 使用Canvas绘制逼真的苹果
            this.drawApple(x, y, this.gridSize);
        }
    }
    
    drawApple(x, y, size) {
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        const radius = size * 0.35;
        
        // 保存画布状态
        this.ctx.save();
        
        // 绘制苹果主体（渐变红色）
        const gradient = this.ctx.createRadialGradient(
            centerX - radius * 0.3, centerY - radius * 0.3, 0,
            centerX, centerY, radius
        );
        gradient.addColorStop(0, '#ff6b6b'); // 高光部分
        gradient.addColorStop(0.7, '#e74c3c'); // 主体颜色
        gradient.addColorStop(1, '#c0392b'); // 阴影部分
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        
        // 绘制苹果形状（心形+圆形组合）
        this.ctx.arc(centerX, centerY + radius * 0.1, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 绘制苹果顶部凹陷
        this.ctx.fillStyle = '#c0392b';
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, y + size * 0.25, radius * 0.3, radius * 0.15, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 绘制苹果茎（棕色）
        this.ctx.fillStyle = '#8b4513';
        this.ctx.fillRect(centerX - 1, y + size * 0.1, 2, size * 0.2);
        
        // 绘制叶子（绿色）
        this.ctx.fillStyle = '#27ae60';
        this.ctx.beginPath();
        this.ctx.ellipse(centerX + 3, y + size * 0.15, 4, 2, Math.PI * 0.3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 绘制高光
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.beginPath();
        this.ctx.ellipse(centerX - radius * 0.3, centerY - radius * 0.2, radius * 0.25, radius * 0.15, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 恢复画布状态
        this.ctx.restore();
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