import * as utils from '@devnetic/utils'

interface StatsInterface{
  startTime: number
  endTime: number
}

const stats: StatsInterface = {
  startTime: 0,
  endTime: 0
}

export const getUptime = (): string => {
  return utils.msToTime(Date.now() - stats.startTime)
}

export const setEndTime = (): void => {
  stats.endTime = Date.now()
}

export const setStartTime = (): void => {
  stats.startTime = Date.now()
}
