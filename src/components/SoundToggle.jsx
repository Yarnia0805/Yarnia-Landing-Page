import { toggleSfx } from './game/sfx'

export default function SoundToggle({ soundOn, setSoundOn }) {
  return (
    <div
      onClick={() => { setSoundOn(toggleSfx()) }}
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        width: 40,
        height: 40,
        borderRadius: 10,
        background: 'rgba(26,26,46,0.08)',
        border: '2px solid #1A1A2E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 9999,
        fontSize: 20,
        userSelect: 'none',
      }}
    >
      {soundOn ? '🔊' : '🔇'}
    </div>
  )
}
