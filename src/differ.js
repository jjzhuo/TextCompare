import * as diff from 'diff';

export function computeDiff(lhs, rhs) {
  const differences = diff.diffWords(lhs, rhs);
  let lhsIndex = 0;
  let rhsIndex = 0;
  let removals = [];
  let additions = []
  let currDiff = differences.shift();
  let lhsOutput = '';
  let rhsOutput = '';
  while (lhsIndex < lhs.length || rhsIndex < rhs.length) {
    // console.log(`indices: ${lhsIndex} ${rhsIndex} diff:${JSON.stringify(currDiff)}`);
    let diffLength = currDiff.value.length;

    if (currDiff.removed) {
      // find the currDiff.value in lhs, add (index, diffLength) to removals
      lhsIndex = lhs.indexOf(currDiff.value, lhsIndex);
      removals.push([lhsIndex, diffLength]);  
      lhsIndex += diffLength;
    } else if(currDiff.added) {
      rhsIndex = rhs.indexOf(currDiff.value, rhsIndex);
      additions.push([rhsIndex, diffLength]);
      rhsIndex += diffLength;
    }  else {
      lhsIndex += diffLength;
      rhsIndex += diffLength;
    }
   
    currDiff = differences.shift();
  }
  let lastIndex = 0;
  for (let i = 0; i < removals.length; i++) {
    let [index, length] = removals[i];
    if (index > lastIndex) {
      // Add the non-diff part of the string
      lhsOutput += lhs.slice(lastIndex, index);
    }
    // Add the diff part of the string
    lhsOutput += `<span class="diff-removed">${lhs.slice(index, index + length)}</span>`;
    lastIndex = index + length;
  }
  if (lastIndex <= lhs.length) {
    lhsOutput += lhs.slice(lastIndex);
  }
  lastIndex = 0;
  for (let i = 0; i < additions.length; i++) {
    let [index, length] = additions[i];
    if (index > lastIndex) {
      rhsOutput += rhs.slice(lastIndex, index);
    }
    rhsOutput += `<span class="diff-added">${rhs.slice(index, index + length)}</span>`;
    lastIndex = index + length;
  }
  if (lastIndex <= rhs.length) {
    rhsOutput += rhs.slice(lastIndex);
  }
  return [lhsOutput, rhsOutput];
}

export function computeDiff0(lhs, rhs) {
      const differences = diff.diffWords(lhs, rhs);
      let lhsIndex = 0;
      let rhsIndex = 0;
      let lhsOutput = '';
      let rhsOutput = '';
      let currDiff = differences.shift();
      let isWord = /\b\w+\b/.test(currDiff.value);
      let maybeSpace = isWord ? ' ' : '';
      while (lhsIndex < lhs.length || rhsIndex < rhs.length) {
        console.log(`indices: ${lhsIndex} ${rhsIndex} diff:${currDiff.value}`);
  
        let diffLength = currDiff.value.length;
        let lhsPhrase = lhs.slice(lhsIndex, lhsIndex + diffLength);
        let rhsPhrase = rhs.slice(rhsIndex, rhsIndex + diffLength);
        
        if (currDiff.removed) {
          console.log(`removal lhs="${lhsPhrase}`);
          let prevLhsIndex = lhsIndex;
          // Need to advance lhsIndex in case it contains multiple consecutive spaces
          while (lhsPhrase != currDiff.value && lhsIndex + lhsPhrase.length < lhs.length) {
            lhsIndex += 1;
            lhsPhrase = lhs.slice(lhsIndex, lhsIndex + diffLength);
          }
          if (lhsPhrase!= currDiff.value) {
            lhsIndex = prevLhsIndex;
            lhsPhrase = lhs.slice(lhsIndex, lhsIndex + diffLength);
          }
          console.assert(lhsPhrase == currDiff.value,
                         "\n lhs='%s'\n dif='%s'", lhsPhrase, currDiff.value);
          lhsOutput += `<span class="diff-removed">${maybeSpace}${lhsPhrase}</span>`;
          lhsIndex += diffLength;
        } else if(currDiff.added) {
          console.assert(rhsPhrase == currDiff.value,
                         "\n rhs='%s'\n dif='%s'", rhsPhrase, currDiff.value);
          rhsOutput += `<span class="diff-added">${maybeSpace}${rhsPhrase}</span>`;
          rhsIndex += diffLength;
        } else if (currDiff.value == '\n') {
            // Handle leading new lines
            rhsIndex += 1;
            currDiff = differences.shift();
            isWord = /\b\w+\b/.test(currDiff.value);
            maybeSpace = isWord ? ' ' : '';
            continue;
        } else {
          if (diffLength == 1 && currDiff.value == ' ' && lhsPhrase.trim().length == 0) {
            console.log("fuzzy match whitespace");
          } else {
            const prevLhsIndex = lhsIndex;
            // Need to advance lhsIndex in case it contains multiple consecutive spaces
            while (lhsPhrase != rhsPhrase && lhsIndex + lhsPhrase.length < lhs.length) {
              lhsIndex += 1;
              lhsPhrase = lhs.slice(lhsIndex, lhsIndex + diffLength);
            }
            // Still no match, then let's try our best and keep going with the previous Index.
            if (lhsPhrase!= rhsPhrase) {
              lhsIndex = prevLhsIndex;
              lhsPhrase = lhs.slice(lhsIndex, lhsIndex + diffLength);
            }
            console.assert(lhsPhrase.trim() == rhsPhrase.trim() && lhsPhrase == currDiff.value,
                           "\n lhs='%s'\n rhs='%s'\n dif='%s'", lhsPhrase, rhsPhrase, currDiff.value);
          }
          lhsPhrase = lhsPhrase.replace(/\r?\n/g, "<br/>");
          rhsPhrase = rhsPhrase.replace(/\r?\n/g, "<br/>");
          lhsIndex += diffLength;
          rhsIndex += diffLength;
          lhsOutput += `${maybeSpace}${lhsPhrase}`;
          rhsOutput += `${maybeSpace}${rhsPhrase}`;
        }
       console.log("indices: ", lhsIndex, " ", rhsIndex);
       currDiff = differences.shift();
       if (currDiff) {
        isWord = /\b\w+\b/.test(currDiff.value);
        maybeSpace = isWord ? ' ' : '';
       }
      }
      
      return [lhsOutput, rhsOutput];
  }
