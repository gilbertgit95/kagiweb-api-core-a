import os from 'os'
import Config from '../utilities/config'

const env = Config.getEnv()

type TIpType = 'IPv4' | 'IPv6'

interface ISystemInfo {
    // app directory
    currentDir: string | null
    // app port
    appPort: string | null
    // ip address
    localWifiAddress: string | null
    // os
    os: string | null

}

class SystemInfo {
    /**
     * this will get ip address from the available interfaces
     * @param {string} netInterface - interface name, could be Wi-fi or etc
     * @param {TIpType} familyType - ip version
     * @returns {string} returns ip address
     */
    public getIp(netInterface:string, familyType:TIpType = 'IPv4'):string|null {
        let address = null

        for (const [netKey, netvalue] of Object.entries(os.networkInterfaces())) {

            // match interface name
            if (netKey === netInterface) {
                netvalue?.forEach((item) => {
                    // match family type or ip version
                    if (item.family === familyType) address = item.address
                })
            }
        }
        return address
    }

    /**
     * this will return some information about the system and the app
     * @returns
     */
    public details():ISystemInfo {
        return {
            currentDir: process.env.PWD? process.env.PWD: null,
            appPort: String(env.AppPort),
            localWifiAddress: this.getIp('Wi-Fi'),
            os: process.env.OS? process.env.OS: null
        }
    }
}

export { TIpType, ISystemInfo }
export default new SystemInfo()