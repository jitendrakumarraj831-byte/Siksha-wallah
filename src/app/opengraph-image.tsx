import { ImageResponse } from 'next/og';

export const alt = 'Siksha Wallah — Admission Consultancy, Forbesganj Bihar';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #00102e 0%, #001850 50%, #003590 100%)',
          color: 'white',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 76,
            fontWeight: 800,
            letterSpacing: '-2px',
          }}
        >
          SIKSHA<span style={{ color: '#fbbf24' }}>WALLAH</span>
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 28,
            fontSize: 34,
            fontWeight: 600,
            color: '#dbeafe',
            textAlign: 'center',
          }}
        >
          Admission Consultancy · Forbesganj, Bihar
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 40,
            fontSize: 26,
            color: '#fbbf24',
            fontWeight: 700,
          }}
        >
          B.Ed · Nursing · Engineering · BSCC Loan Guidance
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 24,
            fontSize: 22,
            color: '#93c5fd',
          }}
        >
          5,000+ students guided since 2015
        </div>
      </div>
    ),
    { ...size },
  );
}
