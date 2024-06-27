'use client';
import { Header } from '@components/all/Header';
import ArrowBackSVG from '@public/arrowBack.svg';
import CrownSVG from '@public/crown.svg';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import useRanking from '@utils/useRanking';
import { type teamProp } from 'types/CandidateType';
import SpinnerSVG from '@public/spinner.svg';

export default function TeamResultPage() {
  const [teamState, setTeamState] = useState<teamProp[]>([]);
  const [loading, setLoading] = useState(true);
  const rankingIndexes = useRanking(teamState);

  useEffect(() => {
    async function getTeamResultData() {
      const response = await fetch('/api/vote/team-result');

      const data: teamProp[] = await response.json();

      const tmpData: teamProp[] = data.sort((a, b) => {
        if (a.voteCount === b.voteCount) {
          // voteCount가 같을 경우, teamName으로 알파벳 순 정렬
          return a.teamName.localeCompare(b.teamName);
        }
        // voteCount 내림차순 정렬
        return b.voteCount - a.voteCount;
      });

      setTeamState(tmpData);
      setLoading(false);
    }

    getTeamResultData();
  }, []);

  const router = useRouter();

  if (loading)
    return (
      <div className="flex flex-col w-full h-full justify-center items-center">
        <SpinnerSVG className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-themeColor" />
      </div>
    );

  return (
    <div className="flex flex-col w-full h-full relative px-5 pt-[120px] items-center">
      <Header />
      <ArrowBackSVG
        className="absolute top-[120px] left-[25px] cursor-pointer"
        onClick={() => {
          router.back();
        }}
      />
      <div className="w-[120px] h-[120px] bg-white flex justify-center items-center rounded-full text-[24px] font-semibold relative">
        <div className="absolute top-[-24px] left-[-18px]">
          <CrownSVG />
        </div>
        {teamState[0].teamName}
      </div>
      <div className="my-[10px]">{teamState[0].voteCount}표</div>
      <section className="w-full bg-white rounded-t-xl overflow-y-scroll">
        {teamState.slice(1).map((team, idx) => {
          return (
            <div
              key={team.teamName}
              className="flex justify-between items-center w-[100%] h-[70px] text-[28px] px-[30px] border-b border-gray-200"
            >
              <div className="basis-[40px] flex justify-center">
                {rankingIndexes[idx + 1]}
              </div>
              <div className="flex items-center">{team.teamName}</div>
              <div>{team.voteCount}표</div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
