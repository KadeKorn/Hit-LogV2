const IS_DEV = process.env.APP_VARIANT === 'development';

export default ({ config }) => ({
    ...config,

    name: IS_DEV ? 'Lift Atlas Dev' : config.name,

    scheme: IS_DEV ? 'hitlog-dev' : config.scheme,

    ios: {
        ...config.ios,
        bundleIdentifier: IS_DEV
            ? 'com.kadekorn.hitlog.dev'
            : config.ios.bundleIdentifier,
    },

    android: {
        ...config.android,
        package: IS_DEV
            ? 'com.kadekorn.hitlog.dev'
            : config.android.package,
    },
});