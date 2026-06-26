export default function SectionSkeleton({ height = '400px' }) {
  return (
    <div
      style={{ height, background: 'linear-gradient(90deg,#1a1a2e 25%,#222240 50%,#1a1a2e 75%)', backgroundSize: '200% 100%', animation: 'skeletonShimmer 1.5s infinite' }}
      aria-hidden="true"
    />
  )
}
