// src/index.ts
function checkRepeat(session) {
  const groupId = session.guildId;
  const content = session.content.replace(/[^a-zA-Z0-9\u4e00-\u9fa5\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7A3\u0F00-\u0FFF\u0600-\u06FF\u1100-\u11FF\u0E00-\u0E7F]+/g, "").trim();
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
function apply(ctx) {
  ctx.on("message", async (session) => {
    const count = checkRepeat(session);
    if (count >= 3) {
      const messages = [
        "\u4E0D\u8981\u590D\u8BFB\u4E86\uFF01",
        "\u590D\u8BFB\u673A\u574F\u4E86\u5417\uFF1F",
        "\u6362\u4E2A\u8BDD\u9898\u5427\u3002",
        "\u4F60\u4EEC\u5728\u5E72\u4EC0\u4E48\uFF1F",
        "\u6211\u8981\u6253\u65AD\u4F60\u4EEC\u7684\u590D\u8BFB\uFF01",
        "\u8FD8\u5728\u590D\u8BFB\u8FD8\u5728\u590D\u8BFB\uFF1F"
      ];
      const interrupt = messages[Math.floor(Math.random() * messages.length)];
      await session.send(interrupt);
      interruptRepeat(session);
    }
  });
}
var repeatMap = {};
var name = "anti-repeat";
export {
  name,
  apply
};
