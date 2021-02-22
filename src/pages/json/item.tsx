import React, {useCallback} from 'react'
import {classnames} from '@biqi/ui/lib/util'

type IProps<T> = {
  className?: string
  onItemClick: (val: T) => void
  data: T
  children: React.ReactNode | JSX.Element
}

function Item<T>(props: IProps<T>) {
  const {onItemClick, data, children, className = ''} = props
  const onClick = useCallback(() => {
    typeof onItemClick === 'function' ? onItemClick(data) : ''
  }, [data])
  return (
    <li className={classnames(className)} onClick={onClick}>
      {children}
    </li>
  )
}

export {Item}
