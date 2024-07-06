'use client';

import { signOut } from 'next-auth/react';
import Button from './ui/Button';
import { ButtonHTMLAttributes, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, LogOutIcon } from 'lucide-react';

// interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}
interface SignOutButtonProps extends React.ComponentPropsWithoutRef<'button'> {}
export default function SignOutButton({ ...props }: SignOutButtonProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);
  return (
    <Button
      {...props}
      variant={'ghost'}
      onClick={async () => {
        setIsSigningOut(true);
        try {
          await signOut();
        } catch (error) {
          toast.error('Could not sign out');
        } finally {
          setIsSigningOut(false);
        }
      }}
    >
      {isSigningOut ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogOutIcon className="w-4 h-4" />
      )}
    </Button>
  );
}
