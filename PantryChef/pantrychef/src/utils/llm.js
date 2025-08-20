/**
 * chat 聊天
 * 
 */
const DEEPSEEK_CHAT_API_URL = 'https://api.deepseek.com/chat/completions';
const KIMI_CHAT_API_URL = 'https://api.moonshot.cn/v1/chat/completions';
// console.log(process.env.VITE_DEEPSEEK_API_KEY, '------');
export const chat = async (
  messages, 
  api_url = DEEPSEEK_CHAT_API_URL,
  api_key = import.meta.env.VITE_DEEPSEEK_API_KEY,
  model = 'deepseek-chat',
) => {
    try {
        const response = await fetch(api_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${api_key}`
            },
            body: JSON.stringify({
                model,
                messages,
                stream: false,
            })
        })
        const data = await response.json();
        return {
            code: 1,
            data: {
                role: 'assistant',
                content: data.choices[0].message.content
            }
            
        }
    } catch(err) {
        return {
            code: 0,
            msg: '出错了...'
        }
   } 
}

export const generateAvatar = async (text) => {
  // 设计prompt
  const prompt = `
    你是一个专业的头像设计师，你的任务是根据用户的描述，设计一个符合描述的头像。
    用户描述：${text}
    头像要求：
    1. 头像必须有个性，有设计感
  `
}