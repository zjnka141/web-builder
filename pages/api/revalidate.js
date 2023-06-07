export default async function handler(req, res) {
    // // Check for secret to confirm this is a valid request
    // if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
    //   return res.status(401).json({ message: 'Invalid token' });
    // }
    try {
        // this should be the actual path not a rewritten path
        // e.g. for "/blog/[slug]" this should be "/blog/post-1"
        console.log('Revalidate::: ', `/${req.query.path.replace(/__/g, '/')}`);
        await res.revalidate(`/${req.query.path.replace(/__/g, '/')}`)
        await res.revalidate(`/${req.query.path.replace(/__/g, '/')}/published`)
        return res.json({ revalidated: true });
    } catch (err) {
        console.log('err', err);
        // If there was an error, Next.js will continue
        // to show the last successfully generated page
        return res.status(500).send('Error revalidating');
    }
  }