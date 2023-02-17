import { Context } from 'koishi'

interface RepeatMap {
  [groupId: string]: {
    [content: string]: {
      count: number
    }
  }
}

const repeatMap: RepeatMap = {}


function checkRepeat (session) {
  const groupId = session.guildId
  const content = session.content
  if (!repeatMap[groupId]) repeatMap[groupId] = {}
  if (!repeatMap[groupId][content]) repeatMap[groupId][content] = { count: 1 }
  else repeatMap[groupId][content].count++
  for (let key in repeatMap[groupId]){
    if (repeatMap[groupId][content] != repeatMap[groupId][key])
    delete repeatMap[groupId][key]
  }
  return repeatMap[groupId][content].count
}

function interruptRepeat (session) {
  const groupId = session.guildId
  const content = session.content
  if (!repeatMap[groupId]) return
  if (!repeatMap[groupId][content]) return
  repeatMap[groupId][content].count = 0
  delete repeatMap[groupId][content]
}

export const name = 'anti-repeat'
export function apply (ctx: Context) {
  ctx.on('message', async (session) => {
    const count = checkRepeat(session)
    if (count >= 3) {
      // 定义一个数组，存储打断的内容
      const messages = [
        '不要复读了！',
        '复读机坏了吗？',
        '换个话题吧。',
        '你们在干什么？',
        '我要打断你们的复读！'
      ]
      // 使用Math.floor随机选择一个打断的内容
      const interrupt = messages[Math.floor(Math.random() * messages.length)]
      await session.send(interrupt)
      interruptRepeat(session)
    }
  })
}