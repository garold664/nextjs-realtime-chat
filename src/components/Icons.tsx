import { LucideProps, UserPlus } from 'lucide-react';

export const Icons = {
  Logo: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="SvgjsSvg3273"
      x="0"
      y="0"
      version="1.1"
      viewBox="0 0 512 512"
      width="50"
      height="50"
    >
      <path
        d="M0 .001h235.016v50.361H0zm0 92.327h235.016v50.36H0zm0 92.328v50.36h235.016v-50.36zM461.638.001h50.361v235.016h-50.361zm-92.328 0h50.36v235.016h-50.36zm-92.327 0v235.015h50.36V.001zm0 461.638h235.016V512H276.983zm0-92.328h235.016v50.36H276.983zm163.673-92.327H276.983v50.36H512v-50.36zM0 276.984h50.361V512H0zm92.328 0h50.36V512h-50.36zm92.327 0v235.015h50.361V276.984z"
        fill="rgba(5, 68, 159, 1)"
      ></path>
    </svg>
  ),
  UserPlus,
};

export type Icon = keyof typeof Icons;
