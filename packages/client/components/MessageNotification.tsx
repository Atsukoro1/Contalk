import React, { useEffect, useState } from 'react'

interface IProps {
  messages: any[],
  onSelect: (_id: any, key: number) => void;
}

const MessageNotification = ({ messages, onSelect }: IProps) => {
  const [actualMessages, setActualMessages] = useState<any[]>([]);

  useEffect(() => {
    setActualMessages(messages);
  }, [messages]);

  return (
    <div className="fixed bottom-10 right-10">
      {
        actualMessages != null ? actualMessages.map((el: any, key: number) => {
          return (
            <div
              onClick={() => {
                onSelect(el.conversation, key);
              }}
              className={
                // This is done to prevent the first element from moving
                `flex ${ actualMessages.length - 1 != key ? "mb-4" : "mb-0" } flex-row 
                bg-slate-100 p-3 rounded-lg hover:cursor-pointer`
            }>
              <div>
                <img 
                  src="https://cdn.pixabay.com/photo/2016/08/20/05/36/avatar-1606914_960_720.png" 
                  alt="user avatar"
                  className="h-10 w-10 rounded-full"
                />
              </div>
            
              <div className='ml-3'>
                <h1 className='text-blue-600 font-poppins font-semibold'>
                  { el.author.name }
                </h1>
            
                <p className='text-gray-500'>
                  { 
                    el.content.length > 50 
                      ? el.content.substring(50, 100) + "..."
                      : el.content
                  }
                </p>
              </div>
            </div>     
          )
        })
        : ""
      }
    </div>
  )
}

export default MessageNotification