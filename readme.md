

### Clean app and build

```watchman watch-del-all && rm -rf node_modules ios android && npm install && npx expo prebuild --clean && cd ios && pod install && cd .. && bash run-ios-beta.sh```