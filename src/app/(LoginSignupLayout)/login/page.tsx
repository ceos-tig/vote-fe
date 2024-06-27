'use client'
import LoginForm from '@components/login/LoginForm';
import OrSignup from '@components/login/OrSignup';
import ArrowBackSVG from '@public/arrowBack.svg';
import { useRouter } from 'next/navigation';
export default function LoginPage() {
  const router = useRouter();
  return (
    <div className="relative">
      <p className="w-full h-[100px] min-h-[100px] flex justify-center items-end text-3xl font-bold mb-[50px]">
        CEOS 투표 로그인
      </p>
      <ArrowBackSVG
        className="absolute top-[20px] left-[10px] cursor-pointer"
        onClick={() => {
          router.push('/');
        }}
      />
      <LoginForm />
      <OrSignup />
    </div>
  );
}
