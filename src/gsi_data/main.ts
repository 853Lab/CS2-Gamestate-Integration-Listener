import { MapData } from './map'
import { RoundData } from './round'
import { PlayerData } from './player'
import { ProviderData } from './provider'
/** CSGO发来的数据 */
export interface Data {
  /**
   * 游戏客户端的基本信息
   */
  provider?: ProviderData
  /**
   * 地图数据
   */
  map?: MapData
  /**
   * 回合数据
   */
  round?: RoundData
  /**
   * 玩家数据
   */
  player: PlayerData
  /**
   * 变动时这块会出现
   */
  previously?: {
    player?: {
      activity?: 'menu' | 'playing'
    }
  }
  /**
   * 变动时这块会出现
   */
  added?: {
    player?: {
      state: boolean
      weapons: boolean
      match_stats: boolean
    }
  }
  auth: { [key: string]: string }
}