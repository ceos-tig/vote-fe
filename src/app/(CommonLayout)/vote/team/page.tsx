'use client';
import ArrowBackSVG from '@public/arrowBack.svg';
import { Header } from '@components/all/Header';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const TeamName = ['AZITO', 'BEATBUDDY', 'TIG', 'BULDOG', 'COUPLELOG'];

export default function TeamPage() {
  const [votedIdx, setVotedIdx] = useState<number>(-1);
  // const [isVoted, setIsVoted] = useState<0 | 1>(0); // 투표를 안했으면 0 했으면 1
  const [isVoted, setIsVoted] = useState<0 | 1>(0);
  const [team, setTeam] = useState<string | null>(null); // 일단 임시 데이터 TIG

  const handleSubmitTeamVote = async () => {
    try {
      const sendingDataObject = {
        teamName: TeamName[votedIdx],
        username: localStorage.getItem('username'), // 임시 이름임. 로컬 스토리지에서 꺼내 쓸 예정ㄴ
      };

      const response = await fetch('/api/vote/team-vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
        body: JSON.stringify(sendingDataObject),
      });
      if (response.ok) {
        alert('팀 투표가 완료되었습니다.');
        router.push('/vote/team-result');
      } else {
        throw new Error('팀 투표에 실패했습니다.');
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 백엔드로부터 해당 유저의 상태를 쿠키나 로컬 스토리지에 있는 jwt를 이용하여 받아오고, 이를 상태와 연결하는 side effect
  useEffect(() => {
    const localStorageToken = localStorage.getItem('jwtToken');
    async function getTeamData() {
      const response = await fetch('/api/vote/team', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorageToken}`,
        },
        credentials: 'include',
      });

      const data = await response.json();

      // 이거를 기반으로 팀 이름 상태와 투표 했는지 상태가 연동되어야 함
      setTeam(data.result.status);
      setIsVoted(data.result.isVoted);
    }

    if (localStorageToken !== null) {
      getTeamData();
    } else {
      return;
    }
  }, []);
  const router = useRouter();
  return (
    <div className="flex flex-col w-full h-full px-[30px] relative pt-[80px] items-center">
      <Header />
      <ArrowBackSVG
        className="absolute top-[120px] left-[25px] cursor-pointer"
        onClick={() => {
          router.push('/');
        }}
      />

      <h1 className="py-[30px] text-[28px]">TEAM 투표</h1>

      <section className="flex flex-col items-center gap-y-[20px] w-full h-fit">
        {TeamName.map((name, idx) => (
          <div
            key={name}
            className={`w-[80%] h-[60px] text-2xl hover:cursor-pointer flex justify-center items-center rounded-xl bg-white shadow-teamBoxShadow ${
              idx === votedIdx ? 'border-2 border-themeColor' : ''
            }`}
            onClick={() => {
              if (localStorage.getItem('jwtToken') === null) {
                router.push('/vote/modal/need-login', { scroll: false });
                return;
              }

              if (isVoted === 1) {
                router.push('/vote/modal/already-vote', { scroll: false });
                return;
              } else if (team === null) {
                router.push('/vote/modal/need-login', { scroll: false });
                return;
              } else if (TeamName[idx] === team) {
                router.push('/vote/modal/vote-self', { scroll: false });
                return;
              } else {
                setVotedIdx(idx);
              }
            }}
          >
            {name}
          </div>
        ))}
      </section>

      <div
        className="text-themeColor text-[20px] font-semibold self-end mt-[20px] grow cursor-pointer"
        onClick={() => {
          router.push('/vote/team-result');
        }}
      >
        결과보기 ▶︎
      </div>

      {isVoted === 1 ? (
        <button
          className={`bg-themeColor text-white w-full h-[60px] rounded-[10px] mt-[20px] mb-[40px] text-[28px] font-semibold opacity-50 cursor-not-allowed`}
        >
          투표 완료
        </button>
      ) : (
        <button
          onClick={handleSubmitTeamVote}
          className={`bg-themeColor text-white w-full h-[60px] rounded-[10px] mt-[20px] mb-[40px] text-[28px] font-semibold ${
            isVoted || TeamName[votedIdx] === team || votedIdx === -1
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
          disabled={TeamName[votedIdx] === team || votedIdx === -1}
        >
          투표하기
        </button>
      )}
    </div>
  );
}
