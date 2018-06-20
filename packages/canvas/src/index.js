/**
 *  created at 2018/06/19 14:00 by xxxxxMiss
 */
 
export default function install (Vue) {
  Vue.mixin({
    methods: {
      createCanvas () {
        return new Promise(resolve => {
          const h = window.innerHeight
          const w = Math.min(window.innerWidth, 640)
          // const canvas = this.createHiDPICanvas(
          //   document.getElementById('canvas'),
          //   w,
          //   h
          // )
          const canvas = document.getElementById('canvas')
          canvas.width = w
          canvas.height = h
          const ctx = canvas.getContext('2d')
          ctx.fillStyle = '#FF6644'
          ctx.fillRect(0, 0, w, h)
          
          // draw circle 
          for (let i = 1; i < 4; i++) {
            this.drawCircle(ctx, w / 2, 131, 115 - (i - 1) * 25, {
              lineWidth: i * 0.5,
              strokeStyle: `rgba(255, 255, 255, ${0.3 * i})`
            })
          }
          // draw ball around circle
          ;[[192, 123, 0.4], [591, 182, 0.4], [200, 299, 0.8], [415, 138, 1]].forEach(([x, y, z]) => {
            this.drawCircle(ctx, x / 2, y / 2, 3, {
              type: 'fill',
              fillStyle: `rgba(255, 255, 255, ${z})`
            })
          })
          // draw under meteors
          const sin45 = Math.sin(45 * Math.PI / 180)
          ;[
            {
              colors: ['rgba(91,232,217,0.00)', '#5BE8D9'],
              x: (567 / 2),
              y: (206 + 101.9) / 2,
              width: (101.9 / 2)
            },
            {
              colors: ['rgba(255,234,0,0.00)', '#FFD000'],
              x: 565 / 2,
              y: (261 + 127.3) / 2,
              width: (127.3 / 2)
            },
            {
              colors: ['#FFD000 ', 'rgba(255,234,0,0.00)'],
              x: 14.4 / 2,
              y: (934.7 + 127.3) / 2,
              width: (127.3 / 2)
            },
            {
              colors: ['#5BE8D9', 'rgba(91,232,217,0.00)'],
              x: 505 / 2,
              y: (970 + 226.3) / 2,
              width: (226.3 / 2)
            }
          ].forEach(({x, y, colors, width}) => {
            this._drawMeteor(ctx, {x, y, colors, width})
          })
          // draw round rectange
          this.drawRoundedRect(ctx, (w - 300) / 2, 314 / 2, 300, 400, 5, {
            type: 'fill'
          })
          //
          // draw avatar outline
          this.drawCircle(ctx, w / 2, 147, 42, {
            lineWidth: 5,
            strokeStyle: '#FFF',
            shadowColor: '#eee',
            shadowBlur: 10,
            shadowOffsetY: 5
          })
          // reset style
          ctx.shadowColor = 'transparent'
          // draw header text
          const {
            text,
            countPerLine,
            charW,
            spaceW
          } = this._handleText(ctx, this.company)
          console.log(text)
          text.unshift(`${this.name}`, '来自'.padEnd((countPerLine - 5) * (charW / spaceW)))
          text.push('我来帮你内推')
          text.forEach((t, i) => {
            this.drawText(ctx, t, w / 2, 227 + (i >= 2 ? i - 1 : i) * 25, {
              font: (i === 0 || i === 1 || i === text.length - 1)
                ? '16px PingFang SC'
                : 'bold 16px PingFang SC',
              fillStyle: '#333',
              textAlign: 'center',
              type: 'fill'
            })
          })
          //
          // draw footer text
          ;[
            '长按识别我的二维码',
            '投递简历，可享专属内推待遇'
          ].forEach((text, i) => {
            this.drawText(ctx, text, w / 2, 480 + i * 20, {
              font: '13px PingFang SC',
              type: 'fill'
            })
          })
          // draw cover meteors
          ;[
            {
              colors: ['rgba(0,212,136,0.00)', '#00A950'],
              x: 565 / 2,
              y: (288 + 56.6) / 2,
              width: (56.6 / 2)
            },
            {
              colors: ['rgba(255,234,0,0.00)', '#FFD000'],
              x: 1,
              y: (345 + 127.3) / 2,
              width: (127.3 / 2)
            },
            {
              colors: ['#5BE8D9', 'rgba(91,232,217,0.00)'],
              x: 26 / 2,
              y: (857 + 101.9) / 2,
              width: (101.9 / 2)
            },
            {
              colors: ['#FFD000', 'rgba(255,234,0,0.00)'],
              x: 604 / 2,
              y: (673 + 127.3) / 2,
              width: (127.3 / 2)
            },
            {
              colors: ['#00A950', 'rgba(0,212,136,0.00)'],
              x: 59 / 2,
              y: (1006 + 56.6) / 2,
              width: (56.6 / 2)
            },
            {
              colors: ['#00A950', 'rgba(0,212,136,0.00)'],
              x: 565 / 2,
              y: (1083 + 99) / 2,
              width: (99 / 2)
            }
          ].forEach(({x, y, colors, width}) => {
            this._drawMeteor(ctx, {x, y, colors, width})
          })
          
          return Promise.all([
            // draw avatar
            this._drawImage(ctx, (w - 80) / 2, 107, 80, 80, this.avatarUrl, true),
            // draw QRCode
            this._drawQRCode(ctx, (w - 130) / 2, 322, 130, 130).then(() => {
              if (!this.logo) return
              ctx.clearRect((w - 26) / 2, 772 / 2, 28, 28)
              // draw company logo outline
              this.drawRoundedRect(ctx, (w - 26) / 2, 772 / 2, 28, 28, 2, {
                fillStyle: '#fff',
                type: 'fill'
              })
              // draw compayn logo
              return this._drawImage(ctx, (w - 25) / 2, 774 / 2, 26, 26, this.logo)
            })
          ]).then(() => resolve(canvas))
        })
      },
      _drawMeteor (ctx, {x, y, colors, width}) {
        const gradient = this.createLinearGradient(
          ctx, x, y, x + width, y - width, colors
        )
        this.drawLine(ctx, x, y, x + width, y - width, {
          lineWidth: 11,
          lineCap: 'round',
          strokeStyle: gradient,
          type: 'stroke'
        })
      },
      _handleText (ctx, text, style = { font: 'bold 16px PingFang SC' }) {
        this.setStyle(ctx, style)
        const maxW = 250
        const len = text.length
        const charW = ctx.measureText('腾').width
        const spaceW = ctx.measureText(' ').width
        const countPerLine = maxW / charW
        const ret = {
          countPerLine,
          charW,
          spaceW
        }
        if (len <= countPerLine - 3) {
          ret.text = [`${' '.padEnd(3 * charW / spaceW)}${text}`]
          return ret
        }

        let firstLineCount = countPerLine - 3
        let secondLineCount = len - firstLineCount
        if (secondLineCount >= countPerLine) {
          ret.text = [
            `${' '.padEnd(3 * charW / spaceW)}${text.slice(0, firstLineCount)}`,
            `${text.slice(firstLineCount, (firstLineCount + countPerLine - 1))}...`
          ]
        } else {
          ret.text = [
            `${' '.padEnd(3 * charW / spaceW)}${text.slice(0, firstLineCount)}`,
            text.slice(firstLineCount, len - firstLineCount)
          ]
        }
        return ret
      },
      _drawQRCode (ctx, x, y, w, h) {
        return new Promise(resolve => {
          new QRCode(document.getElementById('qrcode'), {
            text: this.text,
            width: w,
            height: h
          })
          setTimeout(() => {
            const qrImg = document.querySelector('#qrcode img')
            ctx.drawImage(qrImg, x, y, w, h)
            resolve()
          })
        })
      },
      _drawImage (ctx, x, y, w, h, url, isClip = false) {
        return new Promise(resolve => {
          const img = new Image()
          // if (process.env.NODE_ENV !== 'production') {
          //   img.crossOrigin = 'anonymous'
          // }
          img.src = url
          img.onload = () => {
            if (isClip) {
              this.drawCircle(ctx, window.innerWidth / 2, 147, 40)
              ctx.save()
              ctx.clip()
            }
            ctx.drawImage(img, x, y, w, h)
            ctx.restore()
            resolve()
          }
        })
      },
      getPixelRatio () {
        const ctx = document.createElement('canvas').getContext('2d'),
            dpr = window.devicePixelRatio || 1,
            bsr = ctx.webkitBackingStorePixelRatio ||
                  ctx.mozBackingStorePixelRatio ||
                  ctx.msBackingStorePixelRatio ||
                  ctx.oBackingStorePixelRatio ||
                  ctx.backingStorePixelRatio || 1

        return dpr / bsr
      },
      createHiDPICanvas (canvas, w, h, ratio) {
        if (!canvas.nodeType) {
          ratio = h
          h = w
          w = canvas
          canvas = document.createElement('canvas')
        }
        if (!ratio) {
          ratio = this.getPixelRatio()
        }
        canvas.width = w * ratio
        canvas.height = h * ratio
        canvas.style.width = w + 'px'
        canvas.style.height = h + 'px'
        canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0)
        return canvas
      },
      drawRoundedRect (ctx, x, y, width, height, radius, style) {
        const type = this.setStyle(ctx, style)
        ctx.beginPath()
        ctx.moveTo(x, y + radius)
        ctx.lineTo(x, y + height - radius)
        ctx.arcTo(x, y + height, x + radius, y + height, radius)
        ctx.lineTo(x + width - radius, y + height)
        ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius)
        ctx.lineTo(x + width, y + radius)
        ctx.arcTo(x + width, y, x + width - radius, y, radius)
        ctx.lineTo(x + radius, y)
        ctx.arcTo(x, y, x, y + radius, radius)
        ctx[type]()
      },
      drawCircle (ctx, x, y, r, style) {
        const type = this.setStyle(ctx, style)
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 360 / 180)
        ctx[type]()
      },
      drawLine (ctx, x1, y1, x2, y2, style) {
        const type = this.setStyle(ctx, style)
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx[type]()
      },
      drawText (ctx, text, x, y, style) {
        const type = this.setStyle(ctx, style)
        ctx[`${type}Text`](text, x, y)
      },
      createLinearGradient (ctx, x0, y0, x1, y1, colors) {
        const gradient = ctx.createLinearGradient(x0, y0, x1, y1)
        const len = colors.length
        const average = 1 / (len - 1)
        for (let i = 0; i < len; i++) {
          gradient.addColorStop(1 - average * (len - i - 1), colors[i])
        }
        return gradient
      },
      setStyle (ctx, style = {}) {
        const type = style.type || 'stroke'
        delete style.type
        if (typeof style === 'object') {
          Object.keys(style).forEach(key => {
            ctx[key] = style[key]
          })
        }
        return type
      }
    }
  })
}