//先渐变出现边框，然后逐渐填充文字中间颜色，然后整个文字逐渐消失
export const option1  = {
    backgroundColor:'transparent',
    graphic: {
      elements: [
        {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: 'Apache Echarts',
            // text: '魔塔',
            fontSize: 80,
            fontWeight: 'bold',
            lineDash: [0, 200],
            lineDashOffset: 0,
            fill: 'transparent',
            // stroke: '#000',
            stroke: 'transparent',
            lineWidth: 1,
            
          },
          keyframeAnimation: {
            duration: 6000,
            loop: false,
            keyframes: [
              // {
              //   percent: 0.5,
              //   style: {
              //     fill: 'transparent',
              //     lineDashOffset: 20,
              //     lineDash: [50, 0]
              //   }
              // },
              {
                percent: 0,
                style: {
                  stroke: 'transparent',
                  fill: 'transparent'
                }
              },
                          {
                percent: 0.5,
                style: {
                  stroke: '#000',
                  lineDashOffset: 20,
                  lineDash: [50, 0]
                }
              },
              {
                // Stop for a while.
                percent: 0.5,
                style: {
                  fill: 'transparent'
                }
              },
              {
                percent: 0.8,
                style: {
                  fill: 'black'
                }
              },
              {
                percent: 0.9,
                style: {
                  fill: 'transparent'
                }
              },
              {
                percent: 0.9,
                style: {
                  stroke: 'transparent'
                }
              }
            ]
          }
        }
      ]
    }
  };