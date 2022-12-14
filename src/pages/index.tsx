import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import OCFContext from '../context/ocfc'
import Header from '../containers/header'

export default function Home() {
  const OCFC = useContext(OCFContext);
  const router = useRouter();

  if (!OCFC) return null;

  const { isWalletConnected, mintMember, isAlreadyMember } = OCFC;

  const handleJoinFight = async () => {
    if (!isWalletConnected) return;

    const isMember = await isAlreadyMember();

    if (!isMember) {
      try {
        const result = await mintMember();
        console.log(result);
      } catch (error) {
        console.log(error);
        return;
      }
    }
    router.push('/game');
  }

  return (
    <div>
      <Head>
        <title>OnChain Fight Club</title>
        <meta name="description" content="On chahin fight club page P2E game blockchain" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className='background min-h-screen pt-20'>
        <div className='w-full text-center mt-52'>
          <h2 className='text-5xl '>Welcome to</h2>
          <h1 className='text-8xl font-bold text-[#fbfbfe]'>On Chain Fight Club</h1>
        </div>
        <div className='flex justify-center mt-20'>
          {!isWalletConnected ? (
            <label htmlFor="my-modal-4" className="btn">Join Fight</label>
          ) : (
            <button
              onClick={handleJoinFight}
              className='btn btn-primary'
              type='button'

            >Join Fight</button>
          )}
        </div>
      </main>
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">You need to connect your wallet before entering the game!</h3>
          <p className="py-4">
            You can use Metamask, WalletConnect, or any other wallet that supports Ethereum.
          </p>
        </label>
      </label>
    </div>
  )
}
