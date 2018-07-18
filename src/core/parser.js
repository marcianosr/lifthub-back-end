export function parse(data) {
  // List of excersises trainer is using.
  // Expand when needed!
  const excersisesList = /^((.*squat.*)|(.*deadlift.*)|(.*press.*)|(.*row.*)|((.*biceps?.*))|((.*triceps?.*))|((.*pull?.*))|dips|stretch|block pulls?|buik en rug op ghd|(planken)|crunches)\n/;

  const firstLine = /^.*\n/;
  // const setDefinition = /^([\d,]{2,})\s+(\d*)\s*x\s*(\d+)\n/
  const setDefinition = /^([\d,]{1,})\s+(\d*)\s*x\s*(\d+)(\ssec.)?\n/;
  const noWeightDefinition = /^(\d{1})\s*x\s*(\d+)\n/;

  const result = [];
  const additional = [];

  let toParse = data.toLowerCase();
  let match = null;
  let matchMetaData = toParse.match(firstLine);

  // First slice all additional data which is not directly
  // related to the program.
  while (matchMetaData) {
    if ((matchMetaData = toParse.match(firstLine))) {
      if (toParse.match(excersisesList)) {
        match = matchMetaData[0];
        break;
      }
      additional.push(matchMetaData[0].trim());

      toParse = toParse.slice(matchMetaData[0].length);
    }
  }

  result.push({ additional: additional, });

  while (match) {
    if ((match = toParse.match(excersisesList))) {
      result.push({ excersise: match[1], sets: [], });
      toParse = toParse.slice(match[0].length);
    }

    // Pattern: Trainer didn't add weight to the excersise
    else if ((match = toParse.match(noWeightDefinition))) {
      const [, sets, reps,] = match;
      const amountSets = sets === "" ? 1 : parseInt(sets, 10);

      for (let i = 0; i < amountSets; i++) {
        result[result.length - 1].sets.push({
          weight: null,
          reps: parseInt(reps, 10),
        });
      }
      toParse = toParse.slice(match[0].length);
    }
    // Pattern: Trainer added weight to the excersise.
    // Parse weight, reps and store them in sets array.
    else if ((match = toParse.match(setDefinition))) {
      const [all, weight, sets, reps,] = match;
      const amountSets = sets === "" ? 1 : parseInt(sets, 10);
      const convertedWeight = convertDecimalSeperator(weight);
      const time = all.indexOf("sec") !== -1;

      for (let i = 0; i < amountSets; i++) {
        if (!time) {
          result[result.length - 1].sets.push({
            weight: convertedWeight ? convertedWeight : parseInt(weight, 10),
            reps: parseInt(reps, 10),
          });
        } else {
          result[result.length - 1].sets.push({
            time: all.trim(),
          });
        }
      }

      toParse = toParse.slice(all.length);
    } else if ((match = toParse.match(firstLine))) {
      // console.log('ADDIOT', match[0]);
      // additional.push(match[0].trim());
      result.push({ additional: [match[0].trim(),], });
      toParse = toParse.slice(match[0].length);
    } else {
      result.push({ excersise: toParse.trim(), sets: [], });
      toParse = toParse.slice(toParse.length);
    }
  }

  return result;
}

// In the Netherlands we use comma's for decimal numbers.
// Convert decimals to dots to use in JS.
const convertDecimalSeperator = decimal => {
  if (decimal.indexOf(",") !== -1) {
    return Number(decimal.replace(",", "."));
  }
  return false;
};
