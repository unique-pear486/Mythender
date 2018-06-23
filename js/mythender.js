/* global on findObjs sendChat */
function repeat(patternIn, countIn) {
  if (countIn < 1) return '';
  let result = '';
  let count = countIn;
  let pattern = patternIn;
  while (count > 1) {
    if (count & 1) result += pattern;
    count >>= 1;
    pattern += pattern;
  }
  return result + pattern;
}

function params(msgStr) {
  // Split string on spaces, convert all but the first part to numbers
  return msgStr.split(' ').slice(1).map(Number);
}

function say(message, who, playerid) {
  const characters = findObjs({ _type: 'character' });
  let speaking;
  characters.forEach((chr) => {
    if (chr.get('name') === who) speaking = chr;
  });

  if (speaking) sendChat(`character|${speaking.id}`, message);
  else sendChat(`player|${playerid}`, message);
}

function stormroll(msg) {
  const [dice, bonusDice] = params(msg.content);
  const message =
    `&{template:storm} {{name=Gathering Storm!}} {{dice=${repeat('[[d6cs>4cf<3]]', dice)}}} {{bonusDice=${repeat('[[d6cs>4cf<3]]', bonusDice)}}}`;
  say(message, msg.who, msg.playerid);
}

function thunderroll(msg) {
  const [dice, bonusDice] = params(msg.content);
  const message =
    `&{template:thunder} {{name=Thunder Claps!}} {{dice=${repeat('[[d6cs>4cf<3]]', dice)}}} {{bonusDice=${repeat('[[d6cs>4cf<3]]', bonusDice)}}}`;
  say(message, msg.who, msg.playerid);
}

function mythicroll(msg) {
  const [dice] = params(msg.content);
  const message =
    `&{template:mythic} {{name=The Die is cast}} {{dice=${repeat('[[d6cs>4cf<3]]', 1 + dice)}}}`;
  say(message, msg.who, msg.playerid);
}

on('chat:message', (msg) => {
  // This allows players to enter !sr <number> to roll a number of d6 dice with a target of 4.
  if (msg.type === 'api') {
    if (msg.content.indexOf('!stormroll ') !== -1) {
      stormroll(msg);
    } else if (msg.content.indexOf('!thunderroll ') !== -1) {
      thunderroll(msg);
    } else if (msg.content.indexOf('!mythicroll ') !== -1) {
      mythicroll(msg);
    } else {
      say(`Didn't understand ${msg.content}`);
    }
  }
});
