(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.PipCanvas = factory());
}(this, (function () { 'use strict';

    class PipCanvas {
        constructor({
            el,
            imgList = [],
            radio = 1,
            index = 0,
            scale = 0.99,
            scaleReturn = 0.8,
            w = 750,
            h = 1206,
            gif_timer = null,
            gifImgs = [],
        }) {
            this.imgList = imgList;
            this.radio = radio;
            this.index = index;
            this.scale = scale;
            this.scaleReturn = scaleReturn;
            this.w = w;
            this.h = h;
            this.gif_timer = gif_timer;
            this.gifImgs = gifImgs;
            this.canvas = $(el)[0];
            this.ctx = this.canvas.getContext('2d');
        }
        loadGifImg() {
            const loadPromises = this.gifImgs.map(
                item =>
                    new Promise((resolve, reject) => {
                        const img = new Image();
                        img.src = item;
                        img.onload = () => resolve(img);
                        img.onerror = () => reject();
                    }),
            );
            return Promise.all(loadPromises);
        }
        loadPageImg() {
            const loadPromises = this.imgList.map(
                (item, index) =>
                    new Promise((resolve, reject) => {
                        const img = new Image();
                        img.src = item.link;
                        img.i = index;
                        img.name = index;
                        img.className = 'item';
                        item.image = img;
                        img.onload = () => {
                            $('.collection').append(item.image);
                            resolve();
                        };
                        img.onerror = () => reject();
                    }),
            );
            return Promise.all(loadPromises);
        }
        async init() {
            console.log('init', new Date().getTime());
            await this.loadPageImg();
            if (this.gifImgs.length > 0) {
                await this.loadGifImg();
            }
            console.log('loadimg', new Date().getTime());
            this.domList = $('.collection .item').sort(function(i, t) {
                return i.name - t.name;
            });
            this.containerImage = this.domList[this.index + 1];
            this.innerImage = this.domList[this.index];
            this.draw();
            document.addEventListener('touchstart', this.touchHandler.bind(this));
            document.addEventListener('touchend', this.touchendHandler.bind(this));
        }
        touchHandler(e) {
            e.stopPropagation();
            // e.preventDefault();
            const render = () => {
                this.radio = this.radio * this.scale;
                this.timer = requestAnimationFrame(render);
                this.draw();
            };
            cancelAnimationFrame(this.timer);
            this.willPause = false;
            // clearInterval(this.gif_timer);
            this.timer = requestAnimationFrame(render);
        }
        touchendHandler(e) {
            e.stopPropagation();
            // e.preventDefault();
            if (this.imgList[this.index + 1] && this.imgList[this.index + 1].gif) {
                this.willPause = true;
            } else {
                this.willPause = false;
                cancelAnimationFrame(this.timer);
            }
        }
        draw() {
            if (this.index + 1 != this.imgList.length) {
                if (
                    this.radio <
                    this.imgList[this.index + 1].areaW / this.imgList[this.index + 1].imgW
                ) {
                    if (this.willPause) {
                        this.radio =
                            this.imgList[this.index + 1].areaW / this.imgList[this.index + 1].imgW;
                        cancelAnimationFrame(this.timer);
                    }
                    this.index++;
                    this.radio = 1;
                    if (!this.imgList[this.index + 1]) {
                        this.showEnd();
                    }
                }
                this.imgNext = this.imgList[this.index + 1];
                this.imgCur = this.imgList[this.index];
                this.containerImage = this.domList[this.index + 1];
                this.innerImage = this.domList[this.index];
                this.drawImgOversize(
                    this.containerImage,
                    this.imgNext.imgW,
                    this.imgNext.imgH,
                    this.imgNext.areaW,
                    this.imgNext.areaH,
                    this.imgNext.areaL,
                    this.imgNext.areaT,
                    this.radio,
                ),
                    this.drawImgMinisize(
                        this.innerImage,
                        this.imgCur.imgW,
                        this.imgCur.imgH,
                        this.imgNext.imgW,
                        this.imgNext.imgH,
                        this.imgNext.areaW,
                        this.imgNext.areaH,
                        this.imgNext.areaL,
                        this.imgNext.areaT,
                        this.radio,
                    );
            }
        }
        showEnd() {
            console.log('end');
        }
        drawImgOversize(i, t, e, a, s, n, g, r) {
            this.ctx.drawImage(
                i,
                n - (a / r - a) * (n / (t - a)),
                g - (s / r - s) * (g / (e - s)),
                a / r,
                s / r,
                0,
                0,
                750,
                1206,
            );
        }
        drawImgMinisize(i, t, e, a, s, n, g, r, m, h) {
            this.ctx.drawImage(
                i,
                0,
                0,
                t,
                e,
                ((n / h - n) * (r / (a - n)) * h * 750) / n,
                ((g / h - g) * (m / (s - g)) * h * 1206) / g,
                750 * h,
                1206 * h,
            );
        }
        drawSprite(i, t, e, a, s, n, g) {
            var r = s[a];
            this.ctx.drawImage(i, r[0], r[1], r[2], r[3], t, e, n, g);
        }
    }

    return PipCanvas;

})));
