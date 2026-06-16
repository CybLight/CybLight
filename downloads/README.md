# APK downloads

Place the signed release APK here for direct download from cyblight.org (deploy separately; APK files are not stored in git because GitHub rejects files over 100 MB):

`cyblight-v0.7.0.apk`

After publishing a new app version:

1. Bump `versionName` in `CybLight-Android/app/build.gradle.kts`
2. Build release APK
3. Copy/rename the file to match the version above
4. Update `LOCAL_APK` in `js/downloads.js` and links in `templates/downloads/index.html` if the filename changed
5. Run `npm run build` in the CybLight repo

GitHub Releases remain the fallback when the file is not uploaded here yet.
