import { useMidgard } from 'redux/midgard/hooks'

const Home = () => {
  const { pools } = useMidgard()

  return <div>{JSON.stringify(pools)}</div>
}

export default Home
