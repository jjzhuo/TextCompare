import * as diff from 'diff';

export function computeDiff(lhs: string, rhs: string): [string, string] {
  const differences = diff.diffWords(lhs, rhs);
  let lhsIndex = 0;
  let rhsIndex = 0;
  let removals: Array<[number, number]> = [];
  let additions: Array<[number, number]> = []
  let currDiff = differences.shift();
  
  let lhsOutput = '';
  let rhsOutput = '';
  while (lhsIndex < lhs.length || rhsIndex < rhs.length) {
    if (currDiff == undefined) {
      break;
    }
    let diffLength = currDiff.value.length;

    if (currDiff.removed) {
      lhsIndex = lhs.indexOf(currDiff.value, lhsIndex);
      removals.push([lhsIndex, diffLength]);  
      lhsIndex += diffLength;
    } else if(currDiff.added) {
      rhsIndex = rhs.indexOf(currDiff.value, rhsIndex);
      additions.push([rhsIndex, diffLength]);
      rhsIndex += diffLength;
    } else {
      lhsIndex += diffLength;
      rhsIndex += diffLength;
    }
   
    currDiff = differences.shift();
  }
  let lastIndex = 0;
  for (let i = 0; i < removals.length; i++) {
    let [index, length] = removals[i];
    if (index > lastIndex) {
      lhsOutput += lhs.slice(lastIndex, index);
    }
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
