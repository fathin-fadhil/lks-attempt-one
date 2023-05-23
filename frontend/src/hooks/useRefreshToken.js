import axios from 'axios'
import useAuth from './useAuth'

function useRefreshToken() {
  const {setAuth} = useAuth()

  const refresh = async () => {
    const res = await axios.get('/token', {
      withCredentials: true
    })

    setAuth(prev => { return {...prev, ...res.data} })

    return res.data.accessToken
  }

  return refresh
}

export default useRefreshToken