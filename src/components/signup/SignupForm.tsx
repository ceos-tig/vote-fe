'use client';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const idRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const partRef = useRef<HTMLSelectElement>(null);
  const teamRef = useRef<HTMLSelectElement>(null);
  const router = useRouter();

  async function handleSubmitSignupForm(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      idRef.current &&
      passwordRef.current &&
      nameRef.current &&
      emailRef.current &&
      partRef.current &&
      teamRef.current
    ) {
      const userNameValue = nameRef.current.value;
      const userIdValue = idRef.current.value;
      const userPasswordValue = passwordRef.current.value;
      const userEmailValue = emailRef.current.value;
      const userPartValue = partRef.current.value;
      const userTeamValue: number = parseInt(teamRef.current.value);

      const sendingDataObject = {
        loginId: userIdValue,
        password: userPasswordValue,
        email: userEmailValue,
        part: userPartValue,
        username: userNameValue,
        teamId: userTeamValue,
      };

      try {
        const response = await fetch('/api/user/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(sendingDataObject),
        });

        if (!response.ok) {
          throw new Error('Sign up failed!');
        } else {
          router.push('/login');
        }
      } catch (error) {
        alert(error);
      }
    }
  }

  return (
    <form
      action=""
      className="w-full h-fit flex flex-col gap-y-4 items-center relative mb-4"
      onSubmit={handleSubmitSignupForm}
    >
      <div className="loginSignupItem">
        <label htmlFor="userName" className="w-full">
          이름
        </label>
        <input
          type="text"
          id="userName"
          name="userName"
          className="w-full h-8"
          placeholder="Enter your name"
          required
          ref={nameRef}
        />
      </div>
      <div className="loginSignupItem">
        <label htmlFor="userId" className="w-full">
          아이디
        </label>

        <input
          type="text"
          name="userId"
          className="w-full h-8"
          placeholder="Enter your Id"
          required
          ref={idRef}
        />
      </div>
      <div className="loginSignupItem">
        <label htmlFor="userPassword" className="w-full">
          비밀번호
        </label>

        <input
          type="password"
          name="userPassword"
          className="w-full h-8"
          placeholder="Enter your password"
          required
          ref={passwordRef}
        />
      </div>
      <div className="loginSignupItem">
        <label htmlFor="userEmail" className="w-full">
          이메일
        </label>

        <input
          type="email"
          name="userEmail"
          className="w-full h-8"
          placeholder="Enter your own email"
          required
          ref={emailRef}
        />
      </div>
      <div className="loginSignupItem">
        <label htmlFor="userPart" className="w-full">
          파트
        </label>

        <select name="userPart" className="w-full h-8" required ref={partRef}>
          <option value="FRONTEND">FRONTEND</option>
          <option value="BACKEND">BACKEND</option>
        </select>
      </div>
      <div className="loginSignupItem">
        <label htmlFor="userTeam" className="w-full">
          소속 팀
        </label>

        <select name="userTeam" className="w-full h-8" required ref={teamRef}>
          <option value="1">AZITO</option>
          <option value="2">BEATBUDDY</option>
          <option value="3">BULDOG</option>
          <option value="4">COUPLELOG</option>
          <option value="5">TIG</option>
        </select>
      </div>

      <button className="bg-themeColor text-white  bottom-0 w-[90px] h-[45px] rounded-lg">
        회원가입
      </button>
    </form>
  );
}
