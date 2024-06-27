'use client';
import ArrowBackSVG from '@public/arrowBack.svg';
import { Header } from '@components/all/Header';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const CandidateName = [
  '김다희',
  '김동혁',
  '김민영',
  '김수현',
  '김승완',
  '송은수',
  '안혜연',
  '이나현',
  '이지인',
  '조유담',
];

const DUMMYRESPONSE = { isVoted: false, status: 'FE' };

export default function Page() {
  const router = useRouter();
  const [votedIdx, setVotedIdx] = useState<number>(-1);
  const [isVoted, setIsVoted] = useState<number>(0);
  const [part, setPart] = useState<string | null>(null);
  const username =
    typeof window !== 'undefined' ? localStorage.getItem('username') : null;

  const handleSubmitFrontendVote = async () => {
    try {
      const sendingDataObject = {
        leaderName: CandidateName[votedIdx],
        username: username,
      };

      const response = await fetch('/api/vote/fe-vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
        body: JSON.stringify(sendingDataObject),
      });
      if (response.ok) {
        alert('파트장 투표가 완료되었습니다.');
        router.push('/vote/fe-result');
      } else {
        throw new Error('파트장 투표에 실패했습니다.');
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const localStorageToken = localStorage.getItem('jwtToken');
    async function getTeamData() {
      const response = await fetch('/api/vote/fe', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorageToken}`,
        },
        credentials: 'include',
      });

      const data = await response.json();

      setPart(data.result.status);
      setIsVoted(data.result.isVoted);
    }

    if (localStorageToken !== null) {
      getTeamData();
    } else {
      return;
    }
  }, []);

  return (
    <div className="flex flex-col w-full h-full px-[30px] relative pt-[80px] items-center">
      <Header />
      <ArrowBackSVG
        className="absolute top-[120px] left-[25px] cursor-pointer"
        onClick={() => {
          router.push('/');
        }}
      />
      <h1 className="py-[30px] text-[28px]">FE 파트장 투표</h1>
      <section className="flex flex-wrap gap-[20px] w-full">
        {CandidateName.map((name, idx) => (
          <button
            key={name}
            onClick={() => {
              if (isVoted === 1) {
                router.push('/vote/modal/already-vote', { scroll: false });
                return;
              } else if (part === null) {
                router.push('/vote/modal/need-login', { scroll: false });
                return;
              } else if (CandidateName[idx] === username) {
                router.push('/vote/modal/vote-self', { scroll: false });
              } else {
                setVotedIdx(idx);
              }
            }}
            className={`basis-[calc(50%-10px)] h-[60px] bg-white rounded-[10px] flex justify-center items-center shadow-md text-[24px] font-semibold ${
              idx === votedIdx ? 'border-2 border-themeColor' : ''
            }`}
          >
            {name}
          </button>
        ))}
      </section>
      <div
        className="text-themeColor text-[20px] font-semibold self-end mt-[20px] grow cursor-pointer"
        onClick={() => {
          router.push('/vote/fe-result');
        }}
      >
        결과보기 ▶︎
      </div>
      <button
        onClick={handleSubmitFrontendVote}
        className={`bg-themeColor text-white w-full h-[60px] rounded-[10px] mt-[20px] mb-[40px] text-[28px] font-semibold ${
          isVoted === 1 || part !== 'FRONTEND' || votedIdx === -1
            ? 'opacity-50 cursor-not-allowed'
            : ''
        }`}
        disabled={isVoted === 1 || part !== 'FRONTEND' || votedIdx === -1}
      >
        {DUMMYRESPONSE.isVoted ? '투표완료' : '투표하기'}
      </button>
    </div>
  );
}
