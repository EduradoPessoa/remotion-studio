import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
} from 'remotion';
import React from 'react';


// ─── Shared styles ────────────────────────────────────────────────────────────

const ORANGE = '#FF6B00';
const WHITE = '#FFFFFF';
const GRAY = '#A0AEC0';
const BG_DARK = '#0a1628';
const BG_DARKER = '#060d14';

const fontFamily = "'Inter', 'Montserrat', 'Segoe UI', sans-serif";

// Mesh-grid overlay background
const MeshBackground: React.FC<{opacity?: number}> = ({opacity = 0.06}) => (
  <svg
    style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="mesh" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#4a8fa8" strokeWidth="0.4" opacity={opacity} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#mesh)" />
  </svg>
);

// Gradient background that transitions from teal-blue to black
const GradientBg: React.FC<{variant?: 'normal' | 'dark'}> = ({variant = 'normal'}) => (
  <AbsoluteFill
    style={{
      background:
        variant === 'dark'
          ? `radial-gradient(ellipse at 30% 40%, #081420 0%, #030810 100%)`
          : `radial-gradient(ellipse at 30% 40%, #0d2a42 0%, ${BG_DARK} 60%, #030810 100%)`,
    }}
  />
);

// ─── Scene 1 (0s–5s): Opening – "The clock is ticking" ───────────────────────

const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  const titleY = interpolate(frame, [0, 20], [40, 0], {extrapolateRight: 'clamp'});

  const subtitleOpacity = interpolate(frame, [15, 35], [0, 1], {extrapolateRight: 'clamp'});
  const subtitleY = interpolate(frame, [15, 35], [30, 0], {extrapolateRight: 'clamp'});

  // Countdown: ECD=24 days, ECF=85 days — decrements slowly over the 5s scene
  const ecdDays = Math.max(0, Math.round(24 - (frame / (fps * 5)) * 2));
  const ecfDays = Math.max(0, Math.round(85 - (frame / (fps * 5)) * 2));

  // Blinking colon for the clock effect
  const colonOpacity = Math.sin((frame / fps) * Math.PI * 2) > 0 ? 1 : 0;

  const counterOpacity = interpolate(frame, [25, 40], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
      {/* Title */}
      <div
        style={{
          fontFamily,
          fontSize: 96,
          fontWeight: 900,
          color: WHITE,
          textAlign: 'center',
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          lineHeight: 1.1,
          letterSpacing: '-2px',
          textShadow: `0 0 40px rgba(255,107,0,0.3)`,
        }}
      >
        ECD/ECF 2026:
        <br />
        <span style={{color: ORANGE}}>o relógio corre.</span>
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontFamily,
          fontSize: 36,
          fontWeight: 400,
          color: GRAY,
          textAlign: 'center',
          marginTop: 32,
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          letterSpacing: '0.5px',
        }}
      >
        Faltam{' '}
        <span style={{color: WHITE, fontWeight: 700}}>{ecdDays} dias</span> para a ECD
        <span style={{color: ORANGE, opacity: colonOpacity, fontWeight: 700}}> •</span>
        {' '}<span style={{color: WHITE, fontWeight: 700}}>{ecfDays}</span> para a ECF
      </div>

      {/* Countdown badge — bottom right */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          right: 100,
          opacity: counterOpacity,
          fontFamily,
          textAlign: 'center',
        }}
      >
        <div style={{color: GRAY, fontSize: 18, marginBottom: 4, letterSpacing: '2px', textTransform: 'uppercase'}}>
          Prazo ECD
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: ORANGE,
            lineHeight: 1,
            textShadow: `0 0 30px rgba(255,107,0,0.5)`,
          }}
        >
          {ecdDays}
          <span style={{fontSize: 24, color: GRAY}}> dias</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2 (5s–10s): Pain & context ────────────────────────────────────────

const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const line1Opacity = interpolate(frame, [5, 25], [0, 1], {extrapolateRight: 'clamp'});
  const line1Y = interpolate(frame, [5, 25], [30, 0], {extrapolateRight: 'clamp'});

  const line2Opacity = interpolate(frame, [35, 55], [0, 1], {extrapolateRight: 'clamp'});
  const line2Y = interpolate(frame, [35, 55], [30, 0], {extrapolateRight: 'clamp'});

  // Alert icon blink: appears after line2, blinks 3× then stays
  const alertFrame = frame - 60;
  const alertOpacity = alertFrame < 0
    ? 0
    : alertFrame < 30
    ? (Math.sin((alertFrame / fps) * Math.PI * 4) > 0 ? 1 : 0.2)
    : 1;

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 160px',
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize: 64,
          fontWeight: 700,
          color: WHITE,
          textAlign: 'center',
          opacity: line1Opacity,
          transform: `translateY(${line1Y}px)`,
          lineHeight: 1.3,
          marginBottom: 40,
        }}
      >
        Todo erro no Protheus vira{' '}
        <span style={{color: ORANGE}}>retrabalho.</span>
      </div>

      <div
        style={{
          fontFamily,
          fontSize: 64,
          fontWeight: 700,
          color: WHITE,
          textAlign: 'center',
          opacity: line2Opacity,
          transform: `translateY(${line2Y}px)`,
          lineHeight: 1.3,
        }}
      >
        E retrabalho vira{' '}
        <span style={{color: ORANGE}}>risco de multa.</span>
      </div>

      {/* Blinking alert triangle */}
      <div
        style={{
          marginTop: 60,
          opacity: alertOpacity,
          fontSize: 80,
        }}
      >
        <svg width="96" height="96" viewBox="0 0 24 24" fill="none">
          <path
            d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
            fill={ORANGE}
            opacity="0.9"
          />
          <line x1="12" y1="9" x2="12" y2="13" stroke={BG_DARK} strokeWidth="2" strokeLinecap="round"/>
          <line x1="12" y1="17" x2="12.01" y2="17" stroke={BG_DARK} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3 (10s–18s): Social proof numbers ─────────────────────────────────

interface CounterProps {
  targetValue: number;
  prefix?: string;
  suffix?: string;
  label: string;
  delay: number;
}

const AnimatedCounter: React.FC<CounterProps> = ({targetValue, prefix = '', suffix = '', label, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const localFrame = Math.max(0, frame - delay);
  const duration = fps * 2; // 2 seconds to count up

  const progress = interpolate(localFrame, [0, duration], [0, 1], {
    extrapolateRight: 'clamp',
    easing: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  });

  const currentValue = Math.round(progress * targetValue);

  const containerOpacity = interpolate(localFrame, [0, 15], [0, 1], {extrapolateRight: 'clamp'});
  const containerY = interpolate(localFrame, [0, 15], [50, 0], {extrapolateRight: 'clamp'});

  return (
    <div
      style={{
        opacity: containerOpacity,
        transform: `translateY(${containerY}px)`,
        textAlign: 'center',
        flex: 1,
        fontFamily,
      }}
    >
      <div
        style={{
          fontSize: 96,
          fontWeight: 900,
          color: ORANGE,
          lineHeight: 1,
          textShadow: `0 0 40px rgba(255,107,0,0.4)`,
        }}
      >
        {prefix}{currentValue.toLocaleString('pt-BR')}{suffix}
      </div>
      <div
        style={{
          fontSize: 22,
          color: GRAY,
          marginTop: 16,
          fontWeight: 400,
          letterSpacing: '0.5px',
        }}
      >
        {label}
      </div>
    </div>
  );
};

const Scene3: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 80px',
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize: 32,
          fontWeight: 400,
          color: GRAY,
          textTransform: 'uppercase',
          letterSpacing: '4px',
          marginBottom: 80,
          opacity: titleOpacity,
        }}
      >
        Nossos números falam por nós
      </div>

      <div style={{display: 'flex', gap: 80, width: '100%', justifyContent: 'center'}}>
        <AnimatedCounter
          targetValue={1600}
          prefix="+"
          label="projetos entregues"
          delay={10}
        />
        <div style={{width: 1, background: 'rgba(255,255,255,0.1)', alignSelf: 'stretch'}} />
        <AnimatedCounter
          targetValue={15}
          suffix="+"
          label="anos de SPED"
          delay={25}
        />
        <div style={{width: 1, background: 'rgba(255,255,255,0.1)', alignSelf: 'stretch'}} />
        <AnimatedCounter
          targetValue={0}
          label="autuações em clientes ativos"
          delay={40}
        />
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4 (18s–25s): Differentials ────────────────────────────────────────

interface BulletProps {
  text: string;
  delay: number;
}

const Bullet: React.FC<BulletProps> = ({text, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const localFrame = Math.max(0, frame - delay);

  const opacity = interpolate(localFrame, [0, 15], [0, 1], {extrapolateRight: 'clamp'});
  const x = interpolate(localFrame, [0, 15], [-40, 0], {extrapolateRight: 'clamp'});

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        opacity,
        transform: `translateX(${x}px)`,
        marginBottom: 32,
        fontFamily,
      }}
    >
      {/* Checkmark icon */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: ORANGE,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: `0 0 20px rgba(255,107,0,0.4)`,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <polyline points="20 6 9 17 4 12" stroke={WHITE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span style={{fontSize: 40, fontWeight: 500, color: WHITE}}>{text}</span>
    </div>
  );
};

const Scene4: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  const titleY = interpolate(frame, [0, 20], [30, 0], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 160px',
      }}
    >
      {/* Main phrase */}
      <div
        style={{
          fontFamily,
          fontSize: 60,
          fontWeight: 800,
          color: WHITE,
          textAlign: 'center',
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          lineHeight: 1.2,
          marginBottom: 72,
        }}
      >
        Não corrigimos só o arquivo.{' '}
        <span style={{color: ORANGE}}>Corrigimos a origem.</span>
      </div>

      {/* Bullet points */}
      <div style={{alignSelf: 'flex-start', paddingLeft: 60}}>
        <Bullet text="100% especialistas Protheus" delay={25} />
        <Bullet text="Ajuste na parametrização" delay={34} />
        <Bullet text="Validação completa antes da transmissão" delay={43} />
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 5 (25s–30s): Call to action ───────────────────────────────────────

const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Pulsing orange background glow
  const pulseIntensity = interpolate(
    Math.sin((frame / fps) * Math.PI * 1.5),
    [-1, 1],
    [0.05, 0.18],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  const titleY = interpolate(frame, [0, 20], [30, 0], {extrapolateRight: 'clamp'});

  const buttonOpacity = interpolate(frame, [20, 40], [0, 1], {extrapolateRight: 'clamp'});
  const buttonScale = spring({
    fps,
    frame: Math.max(0, frame - 20),
    config: {damping: 200},
  });

  // Button shimmer sweep
  const shimmerX = interpolate(frame % (fps * 2), [0, fps * 2], [-100, 200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 120px',
      }}
    >
      {/* Pulsing glow overlay */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%, rgba(255,107,0,${pulseIntensity}) 0%, transparent 70%)`,
        }}
      />

      <div
        style={{
          fontFamily,
          fontSize: 68,
          fontWeight: 800,
          color: WHITE,
          textAlign: 'center',
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          lineHeight: 1.2,
          marginBottom: 72,
          position: 'relative',
        }}
      >
        Você tem{' '}
        <span style={{color: ORANGE}}>30 minutos</span>{' '}
        para não ter dor de cabeça.
      </div>

      {/* CTA Button */}
      <div
        style={{
          opacity: buttonOpacity,
          transform: `scale(${buttonScale})`,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 60,
          cursor: 'default',
        }}
      >
        <div
          style={{
            background: ORANGE,
            borderRadius: 60,
            padding: '28px 72px',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            boxShadow: `0 0 60px rgba(255,107,0,0.5), 0 8px 32px rgba(255,107,0,0.3)`,
          }}
        >
          {/* Calendar icon */}
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke={WHITE} strokeWidth="2"/>
            <line x1="16" y1="2" x2="16" y2="6" stroke={WHITE} strokeWidth="2" strokeLinecap="round"/>
            <line x1="8" y1="2" x2="8" y2="6" stroke={WHITE} strokeWidth="2" strokeLinecap="round"/>
            <line x1="3" y1="10" x2="21" y2="10" stroke={WHITE} strokeWidth="2"/>
          </svg>
          <span
            style={{
              fontFamily,
              fontSize: 40,
              fontWeight: 700,
              color: WHITE,
              letterSpacing: '-0.5px',
            }}
          >
            Agendar reunião
          </span>
        </div>

        {/* Shimmer effect */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: shimmerX + '%',
            width: '40%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
            transform: 'skewX(-20deg)',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 6 (30s–35s): Closing / Brand ──────────────────────────────────────

const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const totalFrames = fps * 5; // 5-second scene

  const contentOpacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  const contentY = interpolate(frame, [0, 20], [30, 0], {extrapolateRight: 'clamp'});

  // Fade to black in last 1.5 seconds
  const fadeOutOpacity = interpolate(frame, [totalFrames - 45, totalFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeOutOpacity,
      }}
    >
      {/* Logo area */}
      <div
        style={{
          opacity: contentOpacity,
          transform: `translateY(${contentY}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
        }}
      >
        {/* Phoenyx logotype */}
        <Img
          src={staticFile('logotipo-phoenyx-ambar-removebg-preview.png')}
          style={{width: 420, objectFit: 'contain'}}
        />

        {/* Decorative line */}
        <div
          style={{
            width: 200,
            height: 4,
            background: `linear-gradient(90deg, transparent, ${ORANGE}, transparent)`,
            margin: '24px 0',
            borderRadius: 2,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontFamily,
            fontSize: 30,
            fontWeight: 400,
            color: GRAY,
            textAlign: 'center',
            letterSpacing: '1px',
          }}
        >
          Consultoria TOTVS Protheus{' '}
          <span style={{color: 'rgba(255,255,255,0.3)'}}>•</span>{' '}
          <span style={{color: ORANGE}}>phoenyx.com.br</span>
        </div>

        {/* Specialist tags */}
        <div
          style={{
            marginTop: 32,
            display: 'flex',
            gap: 20,
          }}
        >
          {['ECD', 'ECF', 'Bloco K'].map((tag) => (
            <div
              key={tag}
              style={{
                fontFamily,
                fontSize: 20,
                color: GRAY,
                border: `1px solid rgba(255,107,0,0.3)`,
                borderRadius: 20,
                padding: '6px 20px',
                letterSpacing: '1px',
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Root Composition ─────────────────────────────────────────────────────────

export const PhoenyxVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Scene timing in frames (30fps)
  const S1_START = 0;
  const S2_START = fps * 5;   // 5s
  const S3_START = fps * 10;  // 10s
  const S4_START = fps * 18;  // 18s
  const S5_START = fps * 25;  // 25s
  const S6_START = fps * 30;  // 30s

  // Global fade-in
  const globalOpacity = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{opacity: globalOpacity}}>
      {/* Always-on background */}
      <GradientBg variant={frame >= S3_START && frame < S4_START ? 'dark' : 'normal'} />
      <MeshBackground />

      {/* Scene 1: Opening 0–5s */}
      <Sequence from={S1_START} durationInFrames={fps * 5}>
        <Scene1 />
      </Sequence>

      {/* Scene 2: Pain 5–10s */}
      <Sequence from={S2_START} durationInFrames={fps * 5}>
        <Scene2 />
      </Sequence>

      {/* Scene 3: Numbers 10–18s */}
      <Sequence from={S3_START} durationInFrames={fps * 8}>
        <Scene3 />
      </Sequence>

      {/* Scene 4: Differentials 18–25s */}
      <Sequence from={S4_START} durationInFrames={fps * 7}>
        <Scene4 />
      </Sequence>

      {/* Scene 5: CTA 25–30s */}
      <Sequence from={S5_START} durationInFrames={fps * 5}>
        <Scene5 />
      </Sequence>

      {/* Scene 6: Closing 30–35s */}
      <Sequence from={S6_START} durationInFrames={fps * 5}>
        <Scene6 />
      </Sequence>
    </AbsoluteFill>
  );
};
