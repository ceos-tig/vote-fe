'use client';
import ArrowBackSVG from '@public/arrowBack.svg';
import { Header } from '@components/all/Header';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const CandidateName = [
  '임형준',
  '장영환',
  '이도현',
  '이진우',
  '전민',
  '김성현',
  '박수빈',
  '박시영',
  '정기민',
  '권찬',
];

// 일단 프론트엔드 사용자가 백엔드 투표에 들어왔다는 것을 상정한 투표
const DUMMYRESPONSE = { isVoted: false, status: 'FE' };

export default function Page() {
  const router = useRouter();
  const [votedIdx, setVotedIdx] = useState<number>(-1);
  const [isVoted, setIsVoted] = useState<number>(0);
  const [part, setPart] = useState<string | null>(null);
  const username =
    typeof window !== 'undefined' ? localStorage.getItem('username') : null;

  const handleSubmitBackendVote = async () => {
    try {
      const sendingDataObject = {
        leaderName: CandidateName[votedIdx],
        username: localStorage.getItem('username'), // 임시 이름임. 로컬 스토리지에서 꺼내 쓸 예정ㄴ
      };

      const response = await fetch('/api/vote/be-vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
        body: JSON.stringify(sendingDataObject),
      });
      if (response.ok) {
        alert('파트장 투표가 완료되었습니다.');
        router.push('/vote/be-result');
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
      const response = await fetch('/api/vote/be', {
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
      <h1 className="py-[30px] text-[28px]">BE 파트장 투표</h1>
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
          router.push('/vote/be-result');
        }}
      >
        결과보기 ▶︎
      </div>
      <button
        onClick={handleSubmitBackendVote}
        className={`bg-themeColor text-white w-full h-[60px] rounded-[10px] mt-[20px] mb-[40px] text-[28px] font-semibold ${
          isVoted === 1 || part !== 'BACKEND' || votedIdx === -1
            ? 'opacity-50 cursor-not-allowed'
            : ''
        }`}
        disabled={isVoted === 1 || part !== 'BACKEND' || votedIdx === -1}
      >
        {DUMMYRESPONSE.isVoted ? '투표완료' : '투표하기'}
      </button>
    </div>
  );
}
