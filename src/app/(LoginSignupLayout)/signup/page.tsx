// 승완
import SignupForm from '@components/signup/SignupForm';
import OrLogin from '@components/signup/OrLogin';
export default function SignUpPage() {
  return (
    <section className="w-full h-full flex flex-col">
      <p className="w-full h-[80px] min-h-[80px] flex justify-center items-end text-3xl font-bold mb-[40px] ">
        CEOS 투표 회원가입
      </p>
      <SignupForm />
      <OrLogin />
    </section>
  );
}
