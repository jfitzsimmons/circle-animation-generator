const CIRCLES = (function() {
  const circles = [];
  const movement = ['move'];
  let bgColor = '#FFFFFF';
  let count = 0;
  let circAmount = 1;
  let speedInput = [1, 1];
  let sizeInput = [9, 9];
  const canvas2 = document.getElementById('bg2');
  const ctx2 = canvas2.getContext('2d');
  const colors = [];
  const strokeColors = [];
  const canvas = {
    element: document.getElementById('bg'),
    initialize: function() {
      bgColor = document.getElementById('bgColor').value;
      const cvsContainer = window.getComputedStyle(document.getElementById('circles_spot'), null);
      const cvsWidth = parseInt(cvsContainer.getPropertyValue('width'));
      this.width = cvsWidth;
      this.height = 500;
      this.element.style.width = `${cvsWidth}px`;
      this.element.style.height = `500px`;
      ctx2.canvas.width = this.width;
      ctx2.canvas.height = this.height;
      ctx2.canvas.style.background = bgColor;
      document.getElementById('circles_spot').appendChild(this.element);
    },
  };

  const Circle = {
    create: function() {
      const newCirc = Object.create(this);
      newCirc.ani = rndmArrI(movement);
      newCirc.radius = 0;
      newCirc.randomRad = rndmRng(sizeInput[1], sizeInput[0]);
      newCirc.radiusStroke = newCirc.randomRad + 3;
      newCirc.x = rndmRng((canvas.width - 30), 30);
      newCirc.y = rndmRng((canvas.height - 30), 30);
      newCirc.curr = 0;
      newCirc.strokeStyle = rndmArrI(strokeColors);
      newCirc.light = rndmRng(60, 10);
      newCirc.color = rndmArrI(colors);
      newCirc.start = Math.random() * Math.PI * 2;
      newCirc.speed = rndmRng(8, 1);
      newCirc.dx = (Math.cos(newCirc.start) * rndmRng(speedInput[1] * .1, speedInput[0] * .1));
      newCirc.dy = (Math.sin(newCirc.start) * rndmRng(speedInput[1] * .1, speedInput[0] * .1));
      newCirc.element = document.createElement('div');

      jQuery(newCirc.element).css({
        width: `${newCirc.radius}px`,
        height: `${newCirc.radius}px`,
        backgroundColor: `hsl(${newCirc.color},100%, ${newCirc.light}%)`,
        left: `${newCirc.x}px`,
        top: `${newCirc.y}px`,
      });

      newCirc.element.classList.add('circle');
      canvas.element.appendChild(newCirc.element);
      return newCirc;
    },
    draw: function(c) {
      if (this.radius < this.randomRad && typeof this.radius !== 'undefined') {
        this.radius += (this.randomRad / 80);
        jQuery(this.element).css({
          width: `${this.radius}px`,
          height: `${this.radius}px`,
          backgroundColor: `hsl(${(this.color += .3)},100%,${(this.light += .3)}%)`,
        });
        requestAnimationFrame(() => this.draw(c));
      } else {
        ctx2.lineWidth = 2;
        ctx2.strokeStyle = this.strokeStyle;
        this.setStart(c);
      }
    },
    setStart: function(c) {
      const hw = canvas.width / 2;
      const hh = canvas.height / 2;
      if (this.ani === 'rotate') {
        if (this.x > hw) {
          this.start = 4.7;
        } else {
          this.start = 1.6;
        }
      } else if (this.ani === 'move2') {
        if (this.x > hw && this.y > hh) {
          this.start = 0.9;
        } else if (this.x < hw && this.y > hh) {
          this.start = 2.5;
        } else if (this.x < hw && this.y < hh) {
          this.start = 3.8;
        } else {
          this.start = 5.6;
        }
      }
      requestAnimationFrame(() => this.addStroke(c));
    },
    addStroke: function(c, drawTo) {
      const hr = this.radius / 2;
      ctx2.beginPath();
      ctx2.arc(this.x + hr, this.y + hr, hr + 4, this.start, drawTo, false);
      ctx2.stroke();
      this.curr += 1.7;
      if (this.curr < 101) {
        requestAnimationFrame(function() {
          c.addStroke(c, (Math.PI * 2) * c.curr / 100 + c.start);
        });
      } else {
        const circBlock = this.radiusStroke * 3.3;
        ctx2.clearRect((this.x - (circBlock / 2)), (this.y - (circBlock / 2)),
            circBlock, circBlock);
        jQuery(this.element).css({
          boxShadow: `0 0 0 3px ${this.strokeStyle}`,
          border: `3px solid ${bgColor}`,
          left: `${this.x -= 3}px`,
          top: `${this.y -= 3}px`,
        });
        (this.ani === 'rotate' && requestAnimationFrame(() => this.rotate(c)));
        (this.ani === 'move' && requestAnimationFrame(() => this.move(c)));
        (this.ani === 'move2' && requestAnimationFrame(() => this.move2(c)));
        (circles.length > 0 && newCircle());
      }
    },
    move2: function(c) {
      if (this.x > (canvas.width / 2) && this.y > (canvas.height / 2)) {
        this.element.style.animation = `moveL ${rndmRng(350, 30)}s linear 0s infinite
       alternate, moveU ${rndmRng(350, 30)}s linear 0s infinite alternate`;
      } else if (this.x < (canvas.width / 2) && this.y > (canvas.height / 2)) {
        this.element.style.animation = `moveR ${rndmRng(350, 30)}s linear 0s infinite
       alternate, moveU ${rndmRng(350, 30)}s linear 0s infinite alternate`;
      } else if (this.x < (canvas.width / 2) && this.y < (canvas.height / 2)) {
        this.element.style.animation = `moveR ${rndmRng(350, 30)}s linear 0s infinite
       alternate, moveD ${rndmRng(350, 30)}s linear 0s infinite alternate`;
      } else {
        this.element.style.animation = `moveL ${rndmRng(350, 30)}s linear 0s infinite
       alternate, moveD ${rndmRng(350, 30)}s linear 0s infinite alternate`;
      }
      this.element.classList.add('circle-2');
    },
    move: function(c) {
      if (this.x > (canvas.width - (this.randomRad + 10)) || this.x < 0) {
        this.dx = -this.dx;
      }
      if (this.y > (canvas.height - (this.randomRad + 10)) || this.y < 0) {
        this.dy = -this.dy;
      }
      this.x -= this.dx;
      this.y -= this.dy;
      jQuery(this.element).css({
        top: `${this.y}px`,
        left: `${this.x}px`,
      });

      requestAnimationFrame(() => this.move(c));
    },
    rotate: function(c) {
      const orbit = (1000 / (Math.abs(this.y - (canvas.height / 2)) + 100) * 150);
      if (this.x > (canvas.width / 2)) {
        this.element.style.transformOrigin = `-${orbit}% center`;
      } else {
        this.element.style.transformOrigin = `${orbit}% center`;
      }
      this.element.classList.add('circle-2');
    },
  };
  const circleInit = (c) => requestAnimationFrame(() => c.draw(c));
  const rndmRng = (h, l) => Math.random() * (h - l) + l;
  const rndmArrI = (a) => a[Math.floor(Math.random() * a.length)];
  /**   */
  function newCircle() {
    if (circles.length < circAmount) {
      circles.push(Circle.create());
      circleInit(circles[count]);
      count++;
    }
  }
  /**   */
  function rgbToHsl(clr) {
    strokeColors.push(clr);
    let r = parseInt(clr.substr(1, 2), 16);
    let g = parseInt(clr.substr(3, 2), 16);
    let b = parseInt(clr.substr(5, 2), 16);
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = (max + min) / 2;

    if (max == min) {
      h = 0;
    } else {
      const d = max - min;
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    h = Math.round(360 * h);
    colors.push(h);
  }

  document.getElementById('generate').addEventListener('click', function(e) {
    e.preventDefault();
    speedInput = document.getElementById('speed').value.split(',').map(Number);
    sizeInput = document.getElementById('size').value.split(',').map(Number);
    circAmount = document.getElementById('number').value;
    const colorInputs = document.getElementsByName('colors');
    colorInputs.forEach(function(color) {
      rgbToHsl(color.value);
    });
    canvas.initialize();
    newCircle();
  });
})();
document.body.style.visibility = 'visible';
