import Head from 'next/head'
import Image from 'next/image'
import { useContext } from 'react'
import OCFContext from '../context/ocfc'

export default function Home() {
  const OCFC = useContext(OCFContext);

  if (!OCFC) return null;

  const { account, contract, mintMember, createFight, joinAndFight, trainFighter } = OCFC;

  const handleMintMember = async () => {
    const accounts = await mintMember();
    console.log(accounts);
  }
  const handleCreateFight = async () => {
    const result = await createFight(account, 1, 2, 3);
    console.log(result)
  }
  // Alice wants to play the game, so she calls the mintMember function to mint a new ERC721 token and assign it to her. This also adds her to the game as a member.
  // Alice wants to create a new fight, so she calls the createFight function and specifies her three moves as [1, 2, 3]. This adds a new fight to the game with Alice as the first fighter and no second fighter yet.
  // Bob also wants to play the game, so he calls the mintMember function to mint a new ERC721 token and assign it to him. This also adds him to the game as a member.
  // Bob sees that Alice has created a fight and wants to join, so he calls the joinAndFight function and specifies his three moves as [3, 2, 1]. This adds Bob as the second fighter in the fight and calculates the outcome of the fight based on the moves made by both players. The result is then recorded in the game.
  // Alice and Bob can continue to play the game by creating and joining new fights, and their scores will be updated based on the outcomes of the fights.
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <button onClick={handleMintMember}>Oyuna katıl</button>
        <button onClick={handleCreateFight}>Oyun Oluştur</button>
      </div>
    </div>
  )
}
