import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Dropdown, Avatar, Badge } from 'react-daisyui';
import { MemberLevel } from 'lib/models';
import { LinkButton } from '../ui';

interface Props {
  setVisible: (visible: boolean) => void;
}

const User = ({ setVisible }: Props) => {
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [letters, setLetters] = useState<string | null>(null);
  const [level, setLevel] = useState<number>(-1);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      const { picture, first_name, nickname } = session.user;
      if (!photoSrc) setPhotoSrc(picture);
      if (!letters)
        setLetters(first_name ? first_name[0] : nickname ? nickname[0] : null);
      if (level == -1)
        setLevel(MemberLevel[session.user.user_type || 'subscriber']);
    }
  }, [letters, photoSrc, session?.user]);

  const messages = [];
  //user?.notifications?.filter((n) => n.type == 'message') || [];
  const newEvents = [];
  //member?.notifications?.filter((n) => n.type == 'event') || [];

  return (
    <>
      {session?.user ? (
        <div
          className="dropdown-end dropdown mr-2 bg-black text-white"
          onClick={() => setVisible(false)}
          color={'primary'}
        >
          <div
            className="avatar-circle avatar z-50 h-40 w-40 cursor-pointer rounded-full ring-2 ring-accent"
            color={'primary'}
          >
            <img
              src={photoSrc}
              height={70}
              width={70}
              alt={session?.user?.name}
            />
            {letters}
          </div>

          <Dropdown.Menu>
            {session?.user && level > 3 && (
              <>
                <Dropdown.Item href="/member/events">
                  Events
                  {newEvents.length > 0 && (
                    <Badge color="accent">{newEvents.length}</Badge>
                  )}
                </Dropdown.Item>
                <Dropdown.Item href="/member/account">Account</Dropdown.Item>
                {messages.length > 0 && (
                  <Dropdown.Item href="/member/account">
                    Notifications
                    <Badge color="accent">{messages.length}</Badge>
                  </Dropdown.Item>
                )}

                <Dropdown.Item href="/member/invite">Invite</Dropdown.Item>
              </>
            )}
            <Dropdown.Item href="/api/auth/logout">Logout</Dropdown.Item>
          </Dropdown.Menu>
        </div>
      ) : (
        <LinkButton
          href={`/api/auth/signin`}
          color="ghost"
          onClick={(e) => {
            e.preventDefault();
            signIn();
          }}
        >
          members
        </LinkButton>
      )}
    </>
  );
};

export default User;
