export const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export function listedLabel(daysAgo: number) {
  if (daysAgo === 0) return 'Listed today'
  if (daysAgo === 1) return 'Listed yesterday'
  if (daysAgo < 30) return `Listed ${daysAgo} days ago`
  const months = Math.round(daysAgo / 30)
  return `Listed ${months} month${months === 1 ? '' : 's'} ago`
}

export function agoLabel(daysAgo: number) {
  if (daysAgo === 0) return 'today'
  if (daysAgo === 1) return 'yesterday'
  if (daysAgo < 30) return `${daysAgo} days ago`
  const months = Math.round(daysAgo / 30)
  return `${months} month${months === 1 ? '' : 's'} ago`
}
