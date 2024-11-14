export default async function handler(req, res) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.NEXT_REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    // Path to revalidate
    const path = req.query.path

    if (!path) {
      return res.status(400).json({ message: 'Path is required' })
    }

    // This should match the path you want to revalidate
    await res.revalidate(path)

    return res.json({ revalidated: true, path })
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating')
  }
}