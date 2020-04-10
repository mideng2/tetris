
export function getSum (arr) {
  return arr.reduce(function(prev, curr, idx, arr){
      return prev + curr
  });
}