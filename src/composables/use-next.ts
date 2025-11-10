import { onMounted, ref } from 'vue'
import {
  WebMcpServer,
  WebMcpClient,
  createMessageChannelPairTransport,
  createRemoter,
  z,
} from '@opentiny/next-sdk'

export function useNext({ numberValue }) {
  const sessionId = ref('')
  const visible = ref(false)

  onMounted(async () => {
    // 第二步：创建 WebMcpServer ，并与 ServerTransport 连接
    const [serverTransport, clientTransport] = createMessageChannelPairTransport()

    const server = new WebMcpServer()

    server.registerTool(
      'counter',
      {
        title: '自增一个数字',
        description: '在现有的数字基础上，自增一个数字',
        inputSchema: { number: z.number() }
      },
      async ({ number }) => {
        console.log('number:', number)
        numberValue.value += number
        return { content: [{ type: 'text', text: `收到: ${number}` }] }
      }
    )

    await server.connect(serverTransport)

    // 第三步：创建 WebMcpClient ，并与 WebAgent 连接
    const client = new WebMcpClient()
    await client.connect(clientTransport)
    const { sessionId: sessionID } = await client.connect({
      agent: true,
      url: 'http://localhost:3000/api/v1/webmcp/mcp' // https://agent.opentiny.design/api/v1/webmcp-trial/mcp
    })
    sessionId.value = sessionID
    console.log('sessionId:', sessionId.value)

    // const remoter = createRemoter({
    //   sessionId: sessionId.value,
    //   onShowAIChat: () => {
    //     console.log('显示AI对话框')
    //     visible.value = !visible.value
    //   },
    //   menuItems: [
    //     {
    //       action: 'qr-code',
    //       show: false
    //     },
    //     {
    //       action: 'remote-control',
    //       show: false
    //     },
    //     {
    //       action: 'remote-url',
    //       show: false
    //     }
    //   ]
    // })
  })

  return {
    sessionId,
    visible,
  }
}