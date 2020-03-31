import { utils } from './../support'

const stats = {
  startTime: undefined,
  endTime: undefined
}

const getUptime = () => {
  return utils.msToTime(Date.now() - stats.startTime)
}

const setEndTime = () => {
  stats.endTime = Date.now()
}

const setStartTime = () => {
  stats.startTime = Date.now()
}

export {
  getUptime,
  setEndTime,
  setStartTime
}
