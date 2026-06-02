import type { Response as ResponseType } from '../types'

interface Props {
  response: ResponseType
}

export default function ResponseBlock({ response }: Props) {
  if (!response.schema) return null

  return (
    <pre className="bg-gray-900 text-gray-200 rounded-lg p-4 overflow-x-auto text-xs leading-relaxed mt-2 mb-4">
      <code>{JSON.stringify(response.schema, null, 2)}</code>
    </pre>
  )
}