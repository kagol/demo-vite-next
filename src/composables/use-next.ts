import { onMounted, ref } from 'vue'
import { WebMcpServer, createMessageChannelPairTransport, z, WebMcpClient } from '@opentiny/next-sdk'

export function useNext({ sessionId }) {
  const loadingSessionId = ref(false)

  onMounted(async () => {
    // 第二步：创建 WebMcpServer ，并与 ServerTransport 连接
    const [serverTransport, clientTransport] = createMessageChannelPairTransport()

    const server = new WebMcpServer()

    server.registerTool(
      'demo-tool',
      {
        title: '演示工具',
        description: '一个简单工具',
        inputSchema: { foo: z.string() }
      },
      async (params) => {
        console.log('params:', params)
        return { content: [{ type: 'text', text: `收到: ${params.foo}` }] }
      }
    )

    await server.connect(serverTransport)

    // 第三步：创建 WebMcpClient ，并与 WebAgent 连接
    const client = new WebMcpClient()
    await client.connect(clientTransport)
    const { sessionId: sessionID } = await client.connect({
      agent: true,
      sessionId,
      url: 'https://ai.opentiny.design/api/v1/webmcp/mcp' // https://agent.opentiny.design/api/v1/webmcp-trial/mcp
    })
    loadingSessionId.value = true
    console.log('sessionID', sessionID)
  })

  return {
    loadingSessionId
  }
}
