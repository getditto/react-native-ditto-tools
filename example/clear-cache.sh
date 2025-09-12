#!/bin/bash

echo "🧹 Clearing all caches and resetting development environment..."

# Kill any running Metro processes
echo "🔄 Killing Metro processes..."
lsof -ti:8081,8082 2>/dev/null | xargs kill -9 2>/dev/null || echo "No Metro processes found on ports 8081/8082"

# Clear npm cache
echo "📦 Clearing npm cache..."
npm cache clean --force

# Clear yarn cache
echo "🧶 Clearing yarn cache..."
yarn cache clean --all

# Clear Metro cache
echo "📱 Clearing Metro cache..."
rm -rf /tmp/metro-cache 2>/dev/null || echo "Metro cache directory not found"
rm -rf ~/.metro 2>/dev/null || echo "Metro home directory not found"

# Clear Watchman cache
echo "👀 Clearing Watchman cache..."
watchman watch-del-all 2>/dev/null || echo "Watchman not available"

# Clear Expo cache
echo "☄️ Clearing Expo cache..."
rm -rf .expo 2>/dev/null || echo "Expo cache directory not found"

# Clear React Native cache
echo "⚛️ Clearing React Native cache..."
rm -rf /tmp/react-* 2>/dev/null || echo "No React Native temp files found"

# Clear node_modules cache
echo "🗂️ Clearing node_modules cache..."
rm -rf node_modules/.cache 2>/dev/null || echo "node_modules cache not found"

# Clear CocoaPods cache
echo "🍫 Clearing CocoaPods cache..."
if command -v pod &> /dev/null; then
    pod cache clean --all 2>/dev/null || echo "CocoaPods cache clean failed"
    rm -rf ~/Library/Caches/CocoaPods 2>/dev/null || echo "CocoaPods cache directory not found"
    rm -rf ios/Pods 2>/dev/null || echo "iOS Pods directory not found"
    rm -rf ios/Podfile.lock 2>/dev/null || echo "Podfile.lock not found"
    rm -rf ios/.symlinks 2>/dev/null || echo "iOS symlinks directory not found"
    rm -rf ios/build 2>/dev/null || echo "iOS build directory not found"
else
    echo "⚠️ CocoaPods not installed, skipping pod cache clearing"
fi

# Clear Xcode derived data
echo "🔨 Clearing Xcode derived data..."
rm -rf ~/Library/Developer/Xcode/DerivedData 2>/dev/null || echo "Xcode DerivedData not found"

echo "🔨 Clearing Android build cache..."
rm -rf ~/.gradle/caches/*/transforms/*
cd example/android && ./gradlew clean
cd ..

# Optional: Remove node_modules and lock files for complete reset
read -p "🚨 Do you want to remove node_modules and reinstall? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🗑️ Removing node_modules and lock files..."
    rm -rf node_modules
    rm -f package-lock.json yarn.lock

    echo "📥 Reinstalling dependencies..."
    npm install 

    # Install pods after npm install
    if command -v pod &> /dev/null && [ -f "ios/Podfile" ]; then
        echo "🍫 Installing CocoaPods..."
        cd ios
        pod install
        cd ..
        echo "✅ CocoaPods installation complete!"
    else
        echo "⚠️ CocoaPods not available or Podfile not found, skipping pod install"
    fi
else
    echo "⏭️ Skipping node_modules removal"
fi

echo "✅ Cache clearing complete!"
echo "💡 You can now run 'npx expo start --clear' or 'npx expo run:ios' to start with a clean slate"