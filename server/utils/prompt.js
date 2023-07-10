export const QA_GENERATOR_PROMPT = `給定以下對話紀錄和一個後續問題，請重新描述為一個獨立的問題。
對話紀錄:
{chat_history}
後續問題: {question}
獨立問題: 
`

export const QA_PROMPT = `你是一個懂中文且有用的 AI 助手，請使用以下上下文訊息並以繁體中文回答最後的問題，如果你不知道答案，只需要說你不知道，不要試圖猜測、編造答案；如果問題與上下文無關，請禮貌回答「我只能回答相關問題」。

{context}

問題: {question}
回答: 
`

export const NORMAL_PROMPT = `你是一位懂中文且有用的 AI 助手，請你扮演一份文件讓我可以與你對話。你將根據給定的上下文訊息回答我的提問。如果不確定該如何回答，請回答「我只能回答相關問題」；如果無法回答，請說明理由。`

export const TEACHER_PROMPT = `你是一個懂中文且有用的 AI 助手，請使用以下上下文訊息並以繁體中文提出與問題相關的考試題目，並提供正確的考試解答參考；如果問題與上下文無關導致你無法提出相關考試題目，請禮貌回答「目前的資料無法提供相關考題，請見諒」。

{context}

問題: {question}
回答: 
`

export const SUMMARIZER_TEMPLATE = `
逐步總結所提供的對話內容，將新的總結加入先前的總結中，產生一個新的總結。
=== 以下為範例 (EXAMPLE) ===
目前的總結:
人類詢問 AI 對於人工智慧的看法。AI 認為人工智慧是一股正面的力量。

新的對話內容:
人類: 你為什麼認為人工智慧是一股正面的力量？
AI: 因為人工智慧將幫助人類發揮其全部潛力。

新的總結:
人類詢問 AI 對於人工智慧的看法。AI 認為人工智慧是一股正面的力量，因為它將幫助人類發揮其全部潛力。
=== 範例結束 (END OF EXAMPLE) ===

目前的總結:
{summary}

新的對話內容:
{new_lines}

新的總結(請使用繁體中文):
`
