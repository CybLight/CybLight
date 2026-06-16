# APK downloads

Release APKs are published on [GitHub Releases](https://github.com/CybLight/CybLight-Android/releases) and linked from the downloads page.

APK files are not stored in this git repo (GitHub rejects files over 100 MB).

After publishing a new app version:

1. Bump `versionName` in `CybLight-Android/app/build.gradle.kts`
2. Build release APK and upload to GitHub Releases
3. Run `npm run build` in the CybLight repo if page copy changed

The downloads page fetches the latest release URL and version from the GitHub API automatically.
