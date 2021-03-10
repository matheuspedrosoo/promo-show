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
      updateRequestInfo: newInfo => newInfo,
      ...config,
      ...localconfig,
    }
    if (finalConfig.isFetchMore) {
      setRequestInfo({
        ...initialRequestInfo,
        data: requestInfo.data,
        loading: true,
      })
    } else if (!finalConfig.quietly) {
      setRequestInfo({
        ...initialRequestInfo,
        loading: true,
      })
    }

    const fn = finalConfig.debauced ? debouncedAxios : axios

    try {
      response = await fn(finalConfig)
      const newRequestInfo = {
        ...initialRequestInfo,
        data: response.data,
      }
      if (response.headers['x-total-count'] !== undefined) {
        newRequestInfo.total = Number.parseInt(
          response.headers['x-total-count'],
          10
        )
      }

      setRequestInfo(finalConfig.updateRequestInfo(newRequestInfo, requestInfo))
    } catch (error) {
      setRequestInfo(
        finalConfig.updateRequestInfo(
          {
            ...initialRequestInfo,
            error,
          },
          requestInfo
        )
      )
    }

    if (config.onCompleted) {
      config.onCompleted(response)
    }
  }

  return [call, requestInfo]
}
