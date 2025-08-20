/**
 * chat 聊天
 * 
 */
const DEEPSEEK_CHAT_APP_URL = 'https://api.deepseek.com/chat/completions';

export const chat = async (
    messages,
    api_url = DEEPSEEK_CHAT_APP_URL,
    api_key = import.meta.env.VITE_DEEPSEEK_API_KEY,
    model = 'deepseek-chat'
) => {
    try {
        const response = await fetch(api_url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${api_key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages,
                stream: false,
            })
        })
        const data = await response.json();
        // console.log(data);
        return {
            code: 0,
            data: {
                role: 'assistant',
                content: data.choices[0].message.content
            }

        }
    } catch (err) {
        return {
            code: 0,
            msg: '出错了'
        }
    }
}

export const deepChat = async (messages)=>{
    const res = await chat(
        messages,
        DEEPSEEK_CHAT_APP_URL,
        import.meta.env.VITE_DEEPSEEK_API_KEY,
        'deepseek-chat'
    )
    return res ;
}

export const generateAvatar = async()=>{
    // 设计prompt
    const prompt = `
        你是一名风景拍摄者，也是一位漫画设计师，需要为用户设计头像，主打风景画或者实景图，按照用户所给信息(${text})，要求有个性，有设计感，能够符合用户需求。
    `
}