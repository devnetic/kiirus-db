import * as utils from '@devnetic/utils'

const STATS = {
  startTime: 0,
  endTime: 0
}

const getUptime = () => {
  return utils.msToTime(Date.now() - STATS.startTime)
}

const setEndTime = () => {
  STATS.endTime = Date.now()
}

const setStartTime = () => {
  STATS.startTime = Date.now()
}

export {
  getUptime,
  setEndTime,
  setStartTime
}
