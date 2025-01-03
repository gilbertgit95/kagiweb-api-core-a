interface Env {
    AppEnv: string,
    AppPort: number,
    AppAdminConfirmKey: string,

    DafaultPagination: number,
    DafaultAccountLTLimit: number,
    DafaultAccountLTExpiration: number,

    DefaultPasswordExpiration: number,

    MongoURI: string | undefined,
    DBName: string | undefined,

    RootLogsDir: string,
    RootWebappDir: string,
    RootAssetsDir: string,
    RootWebappEndpoint: string
    RootAssetsEndpoint: string
    RootApiEndpoint: string,

    JwtExp: number,
    JwtSecretKey: string
}

class Config {
    public static getEnv():Env {
        const appEnv = process.env.APP_ENV? process.env.APP_ENV: 'PROD'

        return {
            AppEnv: appEnv,
            AppPort: Number(process.env.APP_PORT),
            AppAdminConfirmKey: process.env.APP_ADMIN_CONFIRM_KEY? process.env.APP_ADMIN_CONFIRM_KEY: '',

            DafaultPagination: Number(process.env.DEFAULT_PAGINATION),
            DafaultAccountLTLimit: Number(process.env.DEFAULT_USER_LT_LIMIT),
            DafaultAccountLTExpiration: Number(process.env.DEFAULT_USER_LT_EXP),

            DefaultPasswordExpiration: Number(process.env.DEFAULT_PASSWORD_EXP),

            MongoURI: process.env[`${ appEnv }_MONGO_URI`]? process.env[`${ appEnv }_MONGO_URI`]: '',
            DBName: process.env[`${ appEnv }_MONGO_DB_NAME`]? process.env[`${ appEnv }_MONGO_DB_NAME`]: '',

            RootLogsDir: process.env.ROOT_LOGS_DIR? process.env.ROOT_LOGS_DIR: '',
            RootWebappDir: process.env.ROOT_WEBAPP_DIR? process.env.ROOT_WEBAPP_DIR: '',
            RootAssetsDir: process.env.ROOT_ASSETS_DIR? process.env.ROOT_ASSETS_DIR: '',
            RootWebappEndpoint: process.env.ROOT_WEBAPP_ENDPOINT? process.env.ROOT_WEBAPP_ENDPOINT: '',
            RootAssetsEndpoint: process.env.ROOT_ASSETS_ENDPOINT? process.env.ROOT_ASSETS_ENDPOINT: '',
            RootApiEndpoint: process.env.ROOT_API_ENDPOINT? process.env.ROOT_API_ENDPOINT: '',

            JwtExp: Number(process.env.JWT_EXPIRATION),
            JwtSecretKey: process.env.JWT_SECRET_KEY? process.env.JWT_SECRET_KEY: ''
        }
    }

    public static setAppEnv(type:string):void {
        process.env.APP_ENV = type
    }
}

export { Env }
export default Config