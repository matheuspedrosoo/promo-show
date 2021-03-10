import { useState } from 'react'
import axios from 'axios'
import useDebouncedPromise from 'components/utils/useDebouncedPromise'

const initialRequestInfo = {
  error: null,
  data: null,
  loading: false,
}

export default function useApi(config) {
  const [requestInfo, setRequestInfo] = useState(initialRequestInfo)
  const debouncedAxios = useDebouncedPromise(axios, config.debouncedDelay)

  async function call(localconfig) {
    let response = null
    const finalConfig = {
      baseURL: 'http://localhost:5000',
      ...config,
      ...localconfig,
    }

    if (!finalConfig.quietly) {
      setRequestInfo({
        ...initialRequestInfo,
        loading: true,
      })
    }

    const fn = finalConfig.debauced ? debouncedAxios : axios
    try {
      response = await fn(finalConfig)
      setRequestInfo({
        ...initialRequestInfo,
        data: response.data,
      })
    } catch (error) {
      setRequestInfo({
        ...initialRequestInfo,
        error,
      })
    }

    if (config.onCompleted) {
      config.onCompleted(response)
    }
  }

  return [call, requestInfo]
}
