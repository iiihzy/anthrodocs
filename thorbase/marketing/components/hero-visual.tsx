"use client";

import { motion } from "motion/react";

// ── 电路走线：从外围边缘沿网格向中心汇聚 ──
const circuitPaths = [
  // 左上 → 中心
  { d: "M -30,120 L 120,120 L 120,260 L 280,260 L 280,390 L 400,390 L 400,460", dur: "5s", begin: "0s" },
  // 上偏左 → 中心
  { d: "M 340,-30 L 340,130 L 230,130 L 230,290 L 360,290 L 360,410 L 435,410 L 435,480", dur: "4.5s", begin: "0.3s" },
  // 右上 → 中心
  { d: "M 1030,120 L 880,120 L 880,260 L 720,260 L 720,390 L 600,390 L 600,460", dur: "5.2s", begin: "0.6s" },
  // 上偏右 → 中心
  { d: "M 660,-30 L 660,130 L 770,130 L 770,290 L 640,290 L 640,410 L 565,410 L 565,480", dur: "4.7s", begin: "0.9s" },
  // 右侧 → 中心
  { d: "M 1030,500 L 860,500 L 860,370 L 700,370 L 700,455 L 560,455 L 560,500", dur: "4.9s", begin: "1.2s" },
  // 右下 → 中心
  { d: "M 1030,880 L 880,880 L 880,740 L 720,740 L 720,610 L 600,610 L 600,540", dur: "5.1s", begin: "1.5s" },
  // 下偏右 → 中心
  { d: "M 660,1030 L 660,870 L 770,870 L 770,710 L 640,710 L 640,590 L 565,590 L 565,520", dur: "4.6s", begin: "1.8s" },
  // 左下 → 中心
  { d: "M -30,880 L 120,880 L 120,740 L 280,740 L 280,610 L 400,610 L 400,540", dur: "5.3s", begin: "2.1s" },
  // 下偏左 → 中心
  { d: "M 340,1030 L 340,870 L 230,870 L 230,710 L 360,710 L 360,590 L 435,590 L 435,520", dur: "4.8s", begin: "2.4s" },
  // 左侧 → 中心
  { d: "M -30,500 L 140,500 L 140,630 L 300,630 L 300,545 L 440,545 L 440,500", dur: "4.9s", begin: "2.7s" },
];

// ── 静态装饰走线（无电子动画，增加PCB密度感）──
const staticTraces = [
  // 外框总线
  "M 120,120 L 880,120", "M 120,880 L 880,880",
  "M 120,120 L 120,880", "M 880,120 L 880,880",
  // 内框
  "M 280,280 L 720,280", "M 280,720 L 720,720",
  "M 280,280 L 280,720", "M 720,280 L 720,720",
  // 中心十字连接
  "M 280,500 L 400,500", "M 600,500 L 720,500",
  "M 500,280 L 500,400", "M 500,600 L 500,720",
  // 角落短分支
  "M 120,200 L 200,200 L 200,120",
  "M 880,200 L 800,200 L 800,120",
  "M 120,800 L 200,800 L 200,880",
  "M 880,800 L 800,800 L 800,880",
  // 内外框连接
  "M 280,280 L 200,280 L 200,200",
  "M 720,280 L 800,280 L 800,200",
  "M 280,720 L 200,720 L 200,800",
  "M 720,720 L 800,720 L 800,800",
];

// ── 焊盘节点（关键转角处）──
const padPositions = [
  [120, 120], [880, 120], [120, 880], [880, 880],
  [280, 280], [720, 280], [280, 720], [720, 720],
  [120, 260], [280, 390], [720, 390], [880, 260],
  [120, 740], [280, 610], [720, 610], [880, 740],
  [230, 290], [360, 410], [640, 410], [770, 290],
  [230, 710], [360, 590], [640, 590], [770, 710],
  [700, 370], [700, 455], [300, 630], [300, 545],
  [200, 200], [800, 200], [200, 800], [800, 800],
];

// ── 过孔位置（关键交汇点）──
const viaPositions = [
  [280, 280], [720, 280], [280, 720], [720, 720],
  [500, 280], [500, 720], [280, 500], [720, 500],
];

// ── 入口脉冲点（外围电子进入位置）──
const entryPulsePositions = [
  { cx: 0, cy: 120, color: "#B3001B" },
  { cx: 340, cy: 0, color: "#00205c" },
  { cx: 1000, cy: 120, color: "#B3001B" },
  { cx: 660, cy: 0, color: "#00205c" },
  { cx: 1000, cy: 500, color: "#00205c" },
  { cx: 1000, cy: 880, color: "#B3001B" },
  { cx: 660, cy: 1000, color: "#00205c" },
  { cx: 0, cy: 880, color: "#B3001B" },
  { cx: 340, cy: 1000, color: "#00205c" },
  { cx: 0, cy: 500, color: "#00205c" },
];

export function HeroVisual() {
  return (
    <div className="hero-visual-container">
      {/* 背景虚线网格 */}
      <div className="bg-grid-lines" />

      {/* 电路走线层 */}
      <div className="circuit-traces">
        <svg
          viewBox="0 0 1000 1000"
          xmlns="http://www.w3.org/2000/svg"
          className="circuit-svg"
        >
          <defs>
            {/* 电子发光滤镜 */}
            <filter id="electron-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* 入口脉冲发光滤镜 */}
            <filter id="entry-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 静态装饰走线 */}
          <g className="circuit-static-traces">
            {staticTraces.map((d, i) => (
              <path key={`st-${i}`} d={d} />
            ))}
          </g>

          {/* 电路走线（带发光） */}
          <g className="circuit-lines">
            {circuitPaths.map((p, i) => (
              <path key={`cl-${i}`} d={p.d} />
            ))}
          </g>

          {/* 焊盘节点 */}
          <g className="circuit-pads">
            {padPositions.map(([cx, cy], i) => (
              <circle key={`pad-${i}`} cx={cx} cy={cy} r="4" />
            ))}
          </g>

          {/* 过孔 */}
          <g className="circuit-vias">
            {viaPositions.map(([cx, cy], i) => (
              <circle key={`via-${i}`} cx={cx} cy={cy} r="6.5" />
            ))}
          </g>

          {/* 入口脉冲点 */}
          <g className="circuit-entry-pulse" filter="url(#entry-glow)">
            {entryPulsePositions.map((p, i) => (
              <circle key={`ep-${i}`} cx={p.cx} cy={p.cy} r="3" fill={p.color}>
                <animate
                  attributeName="r"
                  values="2;5;2"
                  dur="2s"
                  begin={`${i * 0.3}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.3;0.9;0.3"
                  dur="2s"
                  begin={`${i * 0.3}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>

          {/* 电子动画 */}
          <g filter="url(#electron-glow)">
            {circuitPaths.map((p, i) => {
              const color = i % 2 === 0 ? "#B3001B" : "#00205c";
              return (
                <g key={`e-${i}`}>
                  {/* 主电子 */}
                  <circle r="4" fill={color}>
                    <animateMotion
                      dur={p.dur}
                      begin={p.begin}
                      repeatCount="indefinite"
                      path={p.d}
                    />
                  </circle>
                  {/* 尾随电子（半周期延迟，更小更淡） */}
                  <circle r="2.5" fill={color} opacity="0.4">
                    <animateMotion
                      dur={p.dur}
                      begin={`${parseFloat(p.dur) / 2 + parseFloat(p.begin)}s`}
                      repeatCount="indefinite"
                      path={p.d}
                    />
                  </circle>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* 3D 悬浮主体 */}
      <div className="isometric-stack">
        {/* 第一层 (最顶层) — Logo */}
        <motion.div
          className="iso-layer iso-layer-1"
          initial={{ opacity: 0, transform: "translateZ(0px)" }}
          animate={{ opacity: 1, transform: "translateZ(100px)" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        >
          <div className="logo-wrapper">
            <img src="/images/tokengo.svg" alt="TokenGO" className="h-10 w-10" />
          </div>
        </motion.div>

        {/* 第二层 — Text / Chat */}
        <motion.div
          className="iso-layer iso-layer-2"
          initial={{ opacity: 0, transform: "translateZ(0px)" }}
          animate={{ opacity: 1, transform: "translateZ(60px)" }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
        >
          <div className="layer-content">
            <div className="layer-dot-row">
              <span className="dot dot-green" />
              <span className="dot dot-yellow" />
              <span className="dot dot-red" />
              <span className="layer-label">Chat</span>
            </div>
            <div className="layer-lines">
              <div className="layer-line w-3/4" />
              <div className="layer-line w-1/2" />
              <div className="layer-line w-5/6" />
              <div className="layer-line w-2/3" />
            </div>
          </div>
        </motion.div>

        {/* 第三层 — Image */}
        <motion.div
          className="iso-layer iso-layer-3"
          initial={{ opacity: 0, transform: "translateZ(0px)" }}
          animate={{ opacity: 1, transform: "translateZ(20px)" }}
          transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
        >
          <div className="layer-content">
            <div className="layer-dot-row">
              <span className="dot dot-green" />
              <span className="dot dot-yellow" />
              <span className="dot dot-red" />
              <span className="layer-label">Image</span>
            </div>
            <div className="layer-image-grid">
              <div className="layer-image-cell" />
              <div className="layer-image-cell" />
              <div className="layer-image-cell" />
              <div className="layer-image-cell" />
            </div>
          </div>
        </motion.div>

        {/* 第四层 — Code */}
        <motion.div
          className="iso-layer iso-layer-4"
          initial={{ opacity: 0, transform: "translateZ(-40px)" }}
          animate={{ opacity: 1, transform: "translateZ(-20px)" }}
          transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
        >
          <div className="layer-content">
            <div className="layer-dot-row">
              <span className="dot dot-green" />
              <span className="dot dot-yellow" />
              <span className="dot dot-red" />
              <span className="layer-label">Code</span>
            </div>
            <div className="layer-code">
              <span className="code-keyword">const</span> <span className="code-var">model</span> = <span className="code-string">"gpt-4o"</span>;
              <br />
              <span className="code-keyword">const</span> <span className="code-var">resp</span> = <span className="code-fn">await</span> client.<span className="code-fn">chat</span>();
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
