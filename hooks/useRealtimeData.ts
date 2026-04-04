import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function useRealtimeData<T>(
  table: string,
  initialData: T[],
  onDataChange?: (data: T[]) => void
) {
  const [data, setData] = useState<T[]>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const supabase = createClient()
    let channel: RealtimeChannel | null = null

    const subscribe = async () => {
      try {
        setIsLoading(true)

        channel = supabase
          .channel(`${table}-changes`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: table,
            },
            (payload) => {
              console.log('[v0] Realtime update:', payload)

              setData((prevData) => {
                let newData = [...prevData]

                if (payload.eventType === 'INSERT') {
                  newData = [payload.new as T, ...newData]
                } else if (payload.eventType === 'UPDATE') {
                  newData = newData.map((item) =>
                    (item as any).id === (payload.new as any).id ? (payload.new as T) : item
                  )
                } else if (payload.eventType === 'DELETE') {
                  newData = newData.filter((item) => (item as any).id !== (payload.old as any).id)
                }

                onDataChange?.(newData)
                return newData
              })
            }
          )
          .subscribe()
      } catch (err) {
        console.error('[v0] Realtime subscription error:', err)
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setIsLoading(false)
      }
    }

    subscribe()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [table, onDataChange])

  return { data, isLoading, error }
}
