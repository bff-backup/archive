#!/usr/bin/env zx

const [repo,] = argv._
const repoPath = path.join(__dirname, repo)
const registryArchivePath = path.join(__dirname, 'npm-registry')
const metaPath = path.join(registryArchivePath, 'meta.json')

if (!fs.pathExistsSync(repoPath)) {
  echo(`${repoPath} does not exist`)
  process.exit()
}

const getPackages = async (dir) => (
  await $`mise exec pnpm@8 -- pnpm --dir ${dir} -r list --json | jq '[.[] | select(.private|not) | {name}]'`.json()
)

const getVersions = async (pkg) => (
  {
    name: pkg.name,
    versions: await $`pnpm view ${pkg.name} versions --json`.json()
  }
)

const packCmd = (pkg, version) => $`npm pack ${pkg}@${version} --pack-destination npm-registry --json --dry-run`.json()
const downloadCmd = ({ name, version }) => $`npm pack ${name}@${version} --pack-destination npm-registry/${name} --json`.json()
const notArchived = ({ name, filename }) => !fs.pathExistsSync(path.join(registryArchivePath, name, filename))

const downloadReleases = async (releases) => {
  const downloads = await Promise.all(releases.filter(notArchived).map(downloadCmd))

  return downloads
}

const getReleases = async (pkg) => {
  const meta = await Promise.all(
    pkg.versions.map(version => packCmd(pkg.name, version))
  )

  return {
    name: pkg.name,
    releases: meta.flat(),
  }
}

if (fs.pathExistsSync(metaPath)) {
  const packages = fs.readJsonSync(metaPath)
  const downloads = await Promise.all(packages.map(async pkg => await downloadReleases(pkg.releases)))
  // console.dir(downloads, { depth: null })
} else {
  const packages = await getPackages(repoPath)
  // console.dir(packages, { depth: null })

  const versions = await Promise.all(packages.map(getVersions))
  // console.dir(versions, { depth: null })

  const releases = await Promise.all(versions.map(getReleases))
  // console.dir(releases, { depth: null })

  fs.writeJsonSync('./npm-registry/meta.json', releases)
}
