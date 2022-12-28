import { Navbar, Button } from 'react-daisyui'
import { Logo } from 'components/ui'
import User from './User'

type Props = {
  toggleDrawer: () => void
  visible: boolean
  setVisible: (v: boolean) => void
}

export default function Header({ toggleDrawer, setVisible, visible }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-black transition-all duration-150 ">
      <Navbar className="flex justify-between bg-black py-3 px-1 ">
        <>
          <Button
            className="swap-rotate swap btn-ghost btn fill-white"
            onClick={toggleDrawer}
            size="lg"
          >
            <>
              <input type="checkbox" defaultChecked={visible} />
              <svg
                className="icon-lg fill-white-400 swap-off"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
              </svg>
              <svg
                className="swap-on fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
              </svg>
            </>
          </Button>
          <div className="flex-grow" onClick={() => setVisible(false)}>
            <a href="/" className="mx-auto">
              <Logo
                width="70"
                height="70"
                className="md:w-70 mx-auto hidden w-fit cursor-pointer md:block"
              />

              <Logo
                width="40"
                height="40"
                className="mx-auto mr-3 w-fit cursor-pointer md:hidden"
              />
            </a>
          </div>
          <User setVisible={setVisible} />
        </>
      </Navbar>
    </header>
  )
}
