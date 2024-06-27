import { type Candidate, type teamProp } from 'types/CandidateType';

type CombinedType = Candidate | teamProp;

export default function ranking(
  candidateRanking: CombinedType[]) {
  let rankingIndex = 1;
  let count = 1;
  const rankingIndexes = candidateRanking.map((candidate, idx) => {
    if (
      idx < candidateRanking.length - 1 &&
      candidate.voteCount !== candidateRanking[idx + 1].voteCount
    ) {
      const temp = rankingIndex;
      rankingIndex += count;
      count = 1;
      return temp;
    } else {
      count++;
      return rankingIndex;
    }
  });
  if (count > 1) {
    rankingIndexes[rankingIndexes.length - 1] = rankingIndex;
  }
  return rankingIndexes;
}
