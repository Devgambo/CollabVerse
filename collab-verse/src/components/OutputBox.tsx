import React from 'react'

interface Props {
  output: string;
}

function OutputBox({output}: Props) {

  return (
    <div className=' text-white text-xs font-sans'>
      {output}
    </div>
  )
}

export default OutputBox
