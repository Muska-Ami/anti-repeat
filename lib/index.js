"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.name = void 0;
exports.apply = apply;
const repeatMap = {};
function checkRepeat(session) {
    const groupId = session.guildId;
    const content = session.content.replace(/[^a-zA-Z0-9\u4e00-\u9fa5\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7A3\u0F00-\u0FFF\u0600-\u06FF\u1100-\u11FF\u0E00-\u0E7F]+/g, '').trim();
    if (!repeatMap[groupId])
        repeatMap[groupId] = {};
    if (!repeatMap[groupId][content])
        repeatMap[groupId][content] = { count: 1 };
    else
        repeatMap[groupId][content].count++;
    for (let key in repeatMap[groupId]) {
        if (repeatMap[groupId][content] != repeatMap[groupId][key])
            delete repeatMap[groupId][key];
    }
    return repeatMap[groupId][content].count;
}
function interruptRepeat(session) {
    const groupId = session.guildId;
    const content = session.content;
    if (!repeatMap[groupId])
        return;
    if (!repeatMap[groupId][content])
        return;
    repeatMap[groupId][content].count = 0;
    delete repeatMap[groupId][content];
}
exports.name = 'anti-repeat';
function apply(ctx) {
    ctx.on('message', async (session) => {
        const count = checkRepeat(session);
        if (count >= 3) {
            // 定义一个数组，存储打断的内容
            const messages = [
                '不要复读了！',
                '复读机坏了吗？',
                '换个话题吧。',
                '你们在干什么？',
                '我要打断你们的复读！',
                '还在复读还在复读？'
            ];
            // 使用Math.floor随机选择一个打断的内容
            const interrupt = messages[Math.floor(Math.random() * messages.length)];
            await session.send(interrupt);
            interruptRepeat(session);
        }
    });
}
